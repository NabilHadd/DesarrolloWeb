import psycopg2
import pandas as pd
import requests
import io
import time
import os
from dotenv import load_dotenv

# carga variables de entorno desde el archivo .env en el directorio raíz
load_dotenv()

# config de db leida desde .env
DB_HOST = os.environ.get("POKEMON_DB_HOST", "db_pokemon")
DB_NAME = os.environ.get("POKEMON_DB_DATABASE", "pokemon_db")
DB_USER = os.environ.get("DB_USER", "dev_user")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "dev_password")
DB_PORT = os.environ.get("POKEMON_DB_PORT", "5432") 

URL = "https://pokeapi.co/api/v2/"
ABILITY = 'ability/'
TYPE = 'type/'
POSTFIJO = '?limit=100000&offset=0'
POKEMON = 'pokemon/'



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
            print(f"Conexión exitosa a la DB de Pokémon en el intento {attempt + 1}.")
            return conn
        except Exception as e:
            if attempt < MAX_RETRIES - 1:
                print(f"Error al conectar (Intento {attempt + 1}/{MAX_RETRIES}): {e}. Reintentando en 3 segundos...")
                time.sleep(3)
            else:
                print(f"ERROR FATAL: No se pudo conectar a la base de datos de Pokémon después de {MAX_RETRIES} intentos.")
                return None
    return None



def requestPokemon(pokemon):
    response = requests.get(f'{URL+POKEMON}{pokemon}')
    raw_data = response.json()
    return {
        'id': raw_data.get('id'),
        'name': raw_data.get('species').get('name'),
        'height': raw_data.get('height'),
        'weight': raw_data.get('weight'),
        'sprite': raw_data.get('sprites').get('front_default')
    }


def requestType(type):
    response = requests.get(f'{URL+TYPE}{type}')
    raw_data = response.json()
    return {
        'id': raw_data.get('id'),
        'name': raw_data.get('name'),
        'sprite': raw_data.get('sprites').get('generation-iii').get('colosseum').get('name_icon') 
    }

def requestAbility(ability):
    response = requests.get(f'{URL}{ABILITY}{ability}')
    raw_data = response.json()

    # buscar efecto en inglés
    effect_entries = raw_data.get('effect_entries', [])
    effect = None # Cambiado de 'null' a None

    for entry in effect_entries:
        if entry.get('language', {}).get('name') == 'en':
            effect = entry.get('short_effect')
            break

    return {
        'id': raw_data.get('id'),
        'name': raw_data.get('name'),
        'effect': effect
    }

def requestPokemonType(pokemon):
    response = requests.get(f'{URL+POKEMON}{pokemon}')
    raw_data = response.json()
    types = raw_data.get('types', [])
    id_pokemon = raw_data.get('id')

    return [
        {
            'id_type': int(x['type']['url'].rstrip('/').split('/')[-1]),
            'id_pokemon': id_pokemon
        }
        for x in types
    ]


def requestPokemonAbility(pokemon):
    response = requests.get(f'{URL+POKEMON}{pokemon}')
    raw_data = response.json()
    abilities = raw_data.get('abilities', [])
    id_pokemon = raw_data.get('id')

    return [
        {
            'id_ability': int(x['ability']['url'].rstrip('/').split('/')[-1]),
            'id_pokemon': id_pokemon
        }
        for x in abilities
    ]


def requestPokemonAbility(pokemon):
    response = requests.get(f'{URL+POKEMON}{pokemon}')
    raw_data = response.json()
    abilities = raw_data.get('abilities', [])
    id_pokemon = raw_data.get('id')

    return [
        {
            'id_ability': int(x['ability']['url'].rstrip('/').split('/')[-1]),
            'id_pokemon': id_pokemon
        }
        for x in abilities
    ]



def main():

    
    #todos los item economicos
    types_response = requests.get(URL+TYPE+POSTFIJO)
    type_names = list(map(lambda x : x.get('name') ,types_response.json().get('results')))
    data_types = [requestType(x) for x in type_names]

    abilities_response = requests.get(URL+ABILITY+POSTFIJO)
    abilitie_names = list(map(lambda x : x.get('name') ,abilities_response.json().get('results')))
    data_abilities = [requestAbility(x) for x in abilitie_names]

    pokemon_response = requests.get(URL+POKEMON+POSTFIJO)
    pokemon_names = list(map(lambda x : x.get('name') ,pokemon_response.json().get('results')))
    data_pokemon = [requestPokemon(x) for x in pokemon_names]
    data_pokemon_type = [
        x
        for pokemon in pokemon_names
        for x in requestPokemonType(pokemon)
    ]

    data_pokemon_ability = [
        x
        for pokemon in pokemon_names
        for x in requestPokemonAbility(pokemon)
    ]


    df_types = pd.DataFrame(data_types)

    df_abilities = pd.DataFrame(data_abilities)

    df_pokemons = pd.DataFrame(data_pokemon)

    df_pokemon_ability = pd.DataFrame(data_pokemon_ability)

    df_pokemon_type = pd.DataFrame(data_pokemon_type)

    

    # conexión
    conn = conectar_bd()
    if not conn:
        return

    cur = conn.cursor()

    # lista de DataFrames y sus nombres de tabla correspondientes
    datasets = [
        (df_pokemons, 'pokemon'),
        (df_types, 'type'),
        (df_abilities, 'ability'),
        (df_pokemon_type, 'pokemon_type'),
        (df_pokemon_ability, 'pokemon_ability')
    ]

    for df, table_name in datasets:
        buffer = io.StringIO()
        df.to_csv(buffer, index=False, header=False, sep='\t')
        buffer.seek(0)
        
        try:
            cur.copy_from(buffer, table_name, sep='\t')
            conn.commit()
        except Exception as e:
            conn.rollback()


    cur.close()
    conn.close()




    

if __name__ == "__main__":
    main()