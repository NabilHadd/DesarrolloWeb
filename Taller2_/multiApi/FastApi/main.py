from fastapi import FastAPI
from sqlalchemy import create_engine, text
from collections import defaultdict
import os

app = FastAPI(
    title="API de Recetas Taller 2",
    description="API para consultar recetas y sus ingredientes desde la base de datos PostgreSQL.",
    version="1.0.0",
    contact={
        "name": "Diego Parga",
        "email": "diego.parga@alumnos.ucn.cl",
    })

DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_NAME = os.environ.get("DB_NAME", "recetas_db")
DB_USER = os.environ.get("DB_USER", "dev_user")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "dev_password")
DB_PORT = "5432" # El puerto interno del contenedor de DBs
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL) #para ORM. en este caso no usaré prisma

@app.get("/")
def read_root():
    return {"message": "Hola desde FastAPI - API de Recetas"}

@app.get("/meals",
    tags=["Recetas"], # Lo agrupa bajo el tag "Recetas"
    summary="Obtener todas las recetas con ingredientes detallados.",
    description="Retorna una lista de todas las comidas disponibles, transformando la estructura relacional de ingredientes (strIngredient1, strMeasure1, etc.) para cada receta.")
def get_meals():
    """
    Retorna todas las comidas agrupando sus ingredientes en el formato solicitado.
    """
    query = """
        SELECT
            m.meal_id,
            m.meal_name,
            m.thumbnail_url,
            i.ingredient_name,
            mi.measure
        FROM meals m
        JOIN meal_ingredients mi ON m.meal_id = mi.meal_id
        JOIN ingredients i ON mi.ingredient_id = i.ingredient_id
        ORDER BY m.meal_id;
    """

    meals_data = defaultdict(lambda: {
        'meal_id': None,
        'strMeal': None, 
        'strMealThumb': None, 
        'ingredients': []
    })

    try:
        with engine.connect() as connection:
            result = connection.execute(text(query))

            for row in result:
                meal_id, meal_name, thumbnail_url, ingredient_name, measure = row
                
                # inicialización de la comida
                if meals_data[meal_id]['meal_id'] is None:
                    meals_data[meal_id]['meal_id'] = meal_id
                    meals_data[meal_id]['strMeal'] = meal_name
                    meals_data[meal_id]['strMealThumb'] = thumbnail_url
                
                meals_data[meal_id]['ingredients'].append({
                    'ingredient': ingredient_name,
                    'measure': measure
                })
          
            
            final_list = []
            for meal in meals_data.values():
                formato = {
                    "strMeal": meal['strMeal'],
                    "strMealThumb": meal['strMealThumb']
                }
            
                # se añaden hasta 20 ingredientes, en pares de ingredient{i} y measure{i}
                for idx, item in enumerate(meal['ingredients'][:20], 1):
                    formato[f'strIngredient{idx}'] = item['ingredient'] if item['ingredient'] else None
                    formato[f'strMeasure{idx}'] = item['measure'] if item['measure'] else None
                
                final_list.append(formato)
            
            return final_list
            
    except Exception as e:
        print(f"Error al consultar la DB: {e}")
        return {"error": "Error interno del servidor al consultar las comidas."}
