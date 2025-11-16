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
    df_meals, df_ingredients, df_meal_ingredients = fetch_meals()
    
    # Conexión
    conn = conectar_bd()
    if not conn:
        return

    cur = conn.cursor()

    try:
        cur.execute("TRUNCATE TABLE meal_ingredients, ingredients, meals RESTART IDENTITY CASCADE;")
        conn.commit()
        print("Tablas de Recetas truncadas con éxito.")
    except Exception as e:
        conn.rollback()
        print(f"FALLO al truncar tablas: {e}")
        return

    datasets = [
        (df_meals, 'meals', '\t'),    
        (df_ingredients, 'ingredients', '\t'),
        (df_meal_ingredients, 'meal_ingredients', '\t'),
    ]

    for df, table_name, sep_char in datasets:
        buffer = io.StringIO()
        
        if table_name == 'meals':
            df.to_csv(buffer, index=False, header=False, sep='\t', quoting=csv.QUOTE_NONE, escapechar='\\')
            columns_to_copy = ('meal_id', 'meal_name', 'category', 'area', 'instructions', 'thumbnail_url', 'youtube_url')
    
        elif table_name == 'ingredients':
            df[['ingredient_name']].to_csv(buffer, index=False, header=False, sep='\t')
            columns_to_copy = ('ingredient_name',)
        
        elif table_name == 'meal_ingredients':
            df.to_csv(buffer, index=False, header=False, sep='\t')
            columns_to_copy = ('meal_id', 'ingredient_id', 'measure')

        buffer.seek(0)
        
        try:
            cur.copy_from(buffer, table_name, sep=sep_char, columns=columns_to_copy)
            conn.commit()
            print(f"Inserción exitosa en la tabla {table_name}")
        except Exception as e:
            conn.rollback()
            print(f"FALLO al insertar datos en la tabla {table_name}: {e}")
            
    cur.close()
    conn.close()
    print("Proceso de inserción recetas completado.")

if __name__ == "__main__":
    main()