import psycopg2
import pandas as pd
import requests
import io


DB_CONFIG = {
    "dbname": "pokemon",
    "user": "postgres",
    "password": "123",
    "host": "localhost",
    "port": "5432"
}
URL = "https://pokeapi.co/api/v2/"
ABILITY = 'ability/'
TYPE = 'type/'
POSTFIJO = '?limit=100000&offset=0'
POKEMON = 'pokemon/'



def conectar_bd():
    return psycopg2.connect(**DB_CONFIG)



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
    effect = 'null'

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
    types = raw_data.get('types')
    id_pokemon = raw_data.get('id')
    return [{
        'id_type': x
                    .get('type')
                    .get('name'),

        'id_pokemon': id_pokemon
        } 
        for x in types
        ]


def requestPokemonAbility(pokemon):
    response = requests.get(f'{URL+POKEMON}/{pokemon}')
    raw_data = response.json()
    abilities = raw_data.get('abilities')
    id_pokemon = raw_data.get('id')
    return [
        {
            'id_ability': x['ability']['url']
                                    .rstrip('/')
                                    .split('/')[-1],

            'id_pokemon': id_pokemon
        } 
        for x in abilities
        ]






def main():

    
    #todos los item economicos
    types_response = requests.get(URL+TYPE+POSTFIJO)
    type_names = map(lambda x : x.get('name') ,types_response.json().get('results'))
    data_types = [requestType(x) for x in type_names]

    abilities_response = requests.get(URL+ABILITY+POSTFIJO)
    abilitie_names = map(lambda x : x.get('name') ,abilities_response.json().get('results'))
    data_abilities = [requestAbility(x) for x in abilitie_names]

    pokemon_response = requests.get(URL+POKEMON+POSTFIJO)
    pokemon_names = map(lambda x : x.get('name') ,pokemon_response.json().get('results'))
    data_pokemon = [requestPokemon(x) for x in pokemon_names]
    data_pokemon_ability = [requestPokemonAbility(x) for x in pokemon_names]
    data_pokemon_type = [requestPokemonType(x) for x in pokemon_names]



    df_types = pd.DataFrame(data_types)

    df_abilities = pd.DataFrame(data_abilities)

    df_pokemons = pd.DataFrame(data_pokemon)

    df_pokemon_ability = pd.DataFrame(data_pokemon_ability)

    df_pokemon_type = pd.DataFrame(data_pokemon_type)

    

    # conexión
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()

    # ---------- INSERT DF 1: pokemon ----------
    buffer1 = io.StringIO()
    df_pokemons.to_csv(buffer1, index=False, header=False, sep='\t')
    buffer1.seek(0)

    cur.copy_from(buffer1, 'pokemon', sep='\t')
    conn.commit()



    # ---------- INSERT DF 2: types ----------
    buffer2 = io.StringIO()
    df_types.to_csv(buffer2, index=False, header=False, sep='\t')
    buffer2.seek(0)

    cur.copy_from(buffer2, 'type', sep='\t')
    conn.commit()
    



    # ---------- INSERT DF 3: abilities ----------
    buffer3 = io.StringIO()
    df_abilities.to_csv(buffer3, index=False, header=False, sep='\t')
    buffer3.seek(0)

    cur.copy_from(buffer3, 'ability', sep='\t')
    conn.commit()




    # ---------- INSERT DF 4: pokemon-type ----------
    buffer4 = io.StringIO()
    df_pokemon_type.to_csv(buffer4, index=False, header=False, sep='\t')
    buffer4.seek(0)

    cur.copy_from(buffer4, 'pokemon_type', sep='\t')
    conn.commit()




        # ---------- INSERT DF 5: pokemon-ability  ----------
    buffer5 = io.StringIO()
    df_pokemon_ability.to_csv(buffer5, index=False, header=False, sep='\t')
    buffer5.seek(0)


    cur.copy_from(buffer5, 'pokemon_ability', sep='\t')
    conn.commit()

    cur.close()
    conn.close()



    

if __name__ == "__main__":
    main()