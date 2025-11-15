import psycopg2
import pandas as pd
import requests
import io
from datetime import datetime


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
POKEMON = 'pokemon/'



def conectar_bd():
    return psycopg2.connect(**DB_CONFIG)



def requestPokemon(pokemon):
    response = requests.get(f'{URL+POKEMON}/{pokemon}')
    raw_data = response.json()
    return {
        'id': raw_data.get('id'),
        'height': raw_data.get('height'),
        'weight': raw_data.get('weight'),
        'name': raw_data.get('species').get('name'),
        'sprite': raw_data.get('sprites').get('front_default')
    }


def requestType(type):
    response = requests.get(f'{URL+POKEMON}/{type}')
    raw_data = response.json()
    return {
        'id': raw_data.get('id'),
        'name': raw_data.get('name'),
        'sprite': raw_data.get('sprites').get('generation-iii').get('colosseum').get('name_icon')
    }









def requestSerie(item, date):
    response = requests.get(f'{URL}/{item}/{date}')
    respuesta = response.json()['serie']

    for d in respuesta:
        d['indicator_code'] = item
        d['date'] = datetime.strptime(d['fecha'], "%Y-%m-%d").date()
        d['value'] = d['valor']
        d.pop('valor', None)
        d.pop('fecha', None)


    return respuesta



def main():

    
    #todos los item economicos
    response = requests.get(URL)
    indicator_names = list(response.json().keys())[3:]

    indicator_list = list(response.json().items())[3:]

    for _, d in indicator_list:
        d.pop("fecha", None)
        d.pop("valor", None)

    
    history_indicators_mtx = [requestSerie(i, YEAR) for i in indicator_names]
    history_indicators_flat = [x for sub in history_indicators_mtx for x in sub]

    # dataframe indicadores
    data_indicators = [v for _, v in indicator_list]
    df_indicators = pd.DataFrame(data_indicators)

    # dataframe historicos
    data_historic = [v for  v in history_indicators_flat]
    df_historic = pd.DataFrame(data_historic)

    # conexión
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()

    # ---------- INSERT DF 1: indicator ----------
    buffer1 = io.StringIO()
    df_indicators.to_csv(buffer1, index=False, header=False)
    buffer1.seek(0)

    cur.copy_from(buffer1, 'indicator', sep=',')
    conn.commit()

    # ---------- INSERT DF 2: indicator_history ----------
    buffer2 = io.StringIO()
    df_historic.to_csv(buffer2, index=False, header=False)
    buffer2.seek(0)

    cur.copy_from(buffer2, 'indicator_value', sep=',')
    conn.commit()

    cur.close()
    conn.close()



    

if __name__ == "__main__":
    main()