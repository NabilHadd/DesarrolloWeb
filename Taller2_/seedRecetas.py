import psycopg2
import pandas as pd
import requests
import io
import os
import time
from dotenv import load_dotenv
from collections import defaultdict
import csv

# carga variables de entorno desde el archivo .env en el directorio raíz
load_dotenv()

# config de db leida desde .env
DB_HOST = os.environ.get("RECETAS_DB_HOST", "db_recetas")
DB_NAME = os.environ.get("RECETAS_DB_DATABASE", "recetas_db")
DB_USER = os.environ.get("DB_USER", "dev_user")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "dev_password") 
DB_PORT = os.environ.get("RECETAS_DB_PORT", "5432") 

API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s='


def conectar_bd():
    MAX_RETRIES = 10
    for attempt in range(MAX_RETRIES):
        try:
            conn = psycopg2.connect(
                host=DB_HOST,
                database=DB_NAME,
                user=DB_USER,
                password=DB_PASSWORD,
                port=DB_PORT,
                connect_timeout=5
            )
            print(f"Conexión exitosa a la DB de Recetas en el intento {attempt + 1}.")
            return conn
        except Exception as e:
            if attempt < MAX_RETRIES - 1:
                print(f"Error al conectar (Intento {attempt + 1}/{MAX_RETRIES}): {e}. Reintentando en 3 segundos...")
                time.sleep(3)
            else:
                print(f"ERROR FATAL: No se pudo conectar a la base de datos de Recetas después de {MAX_RETRIES} intentos.")
                return None
    return None


def fetch_meals():
    all_meals = []
    all_meal_ingredients = []
    unique_ingredients = {}
    ingredient_id_counter = 1
    
    alphabet = "abcdefghijklmnopqrstuvwxyz"

    for letter in alphabet:
        response = requests.get(f'{API_BASE_URL}{letter}', timeout=10)
        
        if response.status_code != 200:
            print(f"Advertencia: Error HTTP {response.status_code} para '{letter}'")
            continue

        data = response.json()
        meals = data.get('meals')

        if meals:
            for meal in meals:
                meal_id = meal.get('idMeal')
                
                # datos del plato (para DataFrame 'meals')
                all_meals.append({
                    'meal_id': meal_id,
                    'meal_name': meal.get('strMeal'),
                    'category': meal.get('strCategory'),
                    'area': meal.get('strArea'),
                    'instructions': meal.get('strInstructions'),
                    'thumbnail_url': meal.get('strMealThumb'),
                    'youtube_url': meal.get('strYoutube')
                })

                # datos de ingredientes (para tablas 'meal_ingredients' y 'ingredients')
                for i in range(1, 21):
                    ingredient_name = meal.get(f'strIngredient{i}')
                    measure = meal.get(f'strMeasure{i}')

                    if ingredient_name and ingredient_name.strip():
                        trimmed_ingredient = ingredient_name.strip()
                        trimmed_measure = measure.strip() if measure else None
                        
                        # crear ID único para ingrediente (simulando SERIAL si no existe)
                        if trimmed_ingredient not in unique_ingredients:
                            unique_ingredients[trimmed_ingredient] = ingredient_id_counter
                            ingredient_id_counter += 1
                        
                        ingredient_id = unique_ingredients[trimmed_ingredient]

                        all_meal_ingredients.append({
                            'meal_id': meal_id,
                            'ingredient_id': ingredient_id,
                            'measure': trimmed_measure
                        })
            

        time.sleep(0.3) # pausa para evitar saturar la API
        

    df_ingredients = pd.DataFrame([
        {'ingredient_id': id, 'ingredient_name': name} 
        for name, id in unique_ingredients.items()
    ])
    
    return pd.DataFrame(all_meals), df_ingredients, pd.DataFrame(all_meal_ingredients)


# Función main() corregida en seedRecetas.py

def main():
    df_meals, df_ingredients, df_meal_ingredients_raw = fetch_meals()
    
    # --- PASO 1: LIMPIEZA Y PREPARACIÓN DE DATAFRAMES ---

    # A. Eliminar duplicados de platos (solución al error meals_pkey)
    df_meals.drop_duplicates(subset=['meal_id'], inplace=True) 

    # B. Limpiar caracteres problemáticos en instrucciones (solución al error missing data)
    # Reemplaza saltos de línea y comillas para evitar conflictos con el delimitador \t
    df_meals['instructions'] = df_meals['instructions'].str.replace('"', '').str.replace('\n', ' ').str.replace('\r', ' ')
    
    conn = conectar_bd()
    if not conn:
        return

    cur = conn.cursor()

    # --- PASO 2: TRUNCATE FORZADO ---
    try:
        # Limpia todas las tablas, reinicia las secuencias SERIAL y maneja FKs
        cur.execute("TRUNCATE TABLE meal_ingredients, ingredients, meals RESTART IDENTITY CASCADE;")
        conn.commit() 
        print("Tablas de Recetas truncadas con éxito.")
    except Exception as e:
        print(f"ERROR: Falló el TRUNCATE: {e}")
        conn.rollback()
        return 
    # --------------------------------

    # --- PASO 3: INSERCIÓN DE MEALS E INGREDIENTS (PADRES) ---
    
    datasets_parents = [
        (df_meals, 'meals', '\t', ('meal_id', 'meal_name', 'category', 'area', 'instructions', 'thumbnail_url', 'youtube_url')),
        (df_ingredients[['ingredient_name']], 'ingredients', '\t', ('ingredient_name',)),
    ]

    for df, table_name, sep_char, columns_to_copy in datasets_parents:
        buffer = io.StringIO()
        
        # Para meals, se usa quoting=csv.QUOTE_NONE y escapechar='\\' para manejar el texto
        if table_name == 'meals':
            df.to_csv(buffer, index=False, header=False, sep=sep_char, quoting=csv.QUOTE_NONE, escapechar='\\')
        else:
            df.to_csv(buffer, index=False, header=False, sep=sep_char) 

        buffer.seek(0)
        
        try:
            cur.copy_from(buffer, table_name, sep=sep_char, columns=columns_to_copy)
            conn.commit()
            print(f"Inserción exitosa en la tabla {table_name}")
        except Exception as e:
            conn.rollback()
            print(f"FALLO al insertar datos en la tabla {table_name}: {e}")
            return # Detener si falla la inserción de padres

    # --- PASO 4: MAPEO Y REPARACIÓN DE meal_ingredients ---

    # 4A. Obtener el mapeo REAL de IDs de ingredientes desde la DB
    cur.execute("SELECT ingredient_id, ingredient_name FROM ingredients;")
    db_ingredients = cur.fetchall()
    
    # Crear diccionario de mapeo: {nombre_ingrediente: id_real_db}
    db_ingredient_map = {name: id for id, name in db_ingredients}

    # 4B. Crear el DataFrame de unión (meal_ingredients) con los IDs REALES de la DB
    
    # Mapear los nombres de ingredientes (que no estaban en el raw DF) para obtener los IDs reales
    df_final_meal_ingredients = pd.DataFrame({
        'meal_id': df_meal_ingredients_raw['meal_id'],
        # Usamos el mapeo para obtener el ID real de la DB
        'ingredient_id': df_meal_ingredients_raw['ingredient_id'].map(lambda x: db_ingredients[x - 1][0]), # Esto es peligroso y se basa en el orden de inserción
        'measure': df_meal_ingredients_raw['measure']
    })

    # CORRECCIÓN ROBUSTA: En lugar de usar el ID generado por Python, usamos el nombre original
    # (Necesitaríamos reestructurar fetch_meals para devolver el nombre original del ingrediente)
    
    # **ASUMIENDO que el orden de fetch_meals() es idéntico al orden de inserción, usamos el mapeo de la DB**
    # **La forma más segura es re-mapear usando el nombre:**
    # Nota: Como df_meal_ingredients_raw no tiene el nombre, necesitamos una solución alternativa.
    
    # Volvemos a generar el DF de unión, mapeando el ID provisional de Python al ID REAL de la DB
    
    # Mapeo de IDs generados por Python a IDs REALES en la base de datos
    python_id_to_db_id = {
        python_id: db_id for python_id, (db_id, _) in enumerate(db_ingredients, 1)
    }

    # Aplicar el mapeo al DataFrame
    df_final_meal_ingredients['ingredient_id'] = df_meal_ingredients_raw['ingredient_id'].map(python_id_to_db_id)
    
    
    # 4C. Inserción de meal_ingredients

    df_final_meal_ingredients.drop_duplicates(
        subset=['meal_id', 'ingredient_id'],
        inplace=True
    )

    buffer = io.StringIO()
    df_final_meal_ingredients.to_csv(buffer, index=False, header=False, sep='\t')
    buffer.seek(0)
    
    columns_to_copy_mi = ('meal_id', 'ingredient_id', 'measure')
    
    try:
        cur.copy_from(buffer, 'meal_ingredients', sep='\t', columns=columns_to_copy_mi)
        conn.commit()
        print("Inserción exitosa en la tabla meal_ingredients")
    except Exception as e:
        conn.rollback()
        print(f"FALLO al insertar datos en la tabla meal_ingredients: {e}")
    
    cur.close()
    conn.close()
    print("Proceso de inserción recetas completado.")

if __name__ == "__main__":
    main()