import psycopg2
import pandas as pd
import requests
import io
import os
from dotenv import load_dotenv
import time
from datetime import datetime

# carga variables de entorno desde el archivo .env en el directorio raíz
load_dotenv()


# config de db leida desde .env
DB_HOST = os.environ.get("ECONOMIA_DB_HOST", "db_economia")
DB_NAME = os.environ.get("ECONOMIA_DB_DATABASE", "economia_db")
DB_USER = os.environ.get("DB_USER", "dev_user") # dev_user es contraseña en caso de no estar definida
DB_PASSWORD = os.environ.get("DB_PASSWORD", "dev_password") 
DB_PORT = os.environ.get("ECONOMIA_DB_PORT", "5432") 

# URL de la API y Año
URL = "https://findic.cl/api"
YEAR = '2024'



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
            print(f"Conexión exitosa a la DB de Economía en el intento {attempt + 1}.")
            return conn
        except Exception as e:
            if attempt < MAX_RETRIES - 1:
                print(f"Error al conectar (Intento {attempt + 1}/{MAX_RETRIES}): {e}. Reintentando en 3 segundos...")
                time.sleep(3)
            else:
                print(f"ERROR FATAL: No se pudo conectar a la base de datos de Economía después de {MAX_RETRIES} intentos.")
                return None
    return None



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
    indicator_names = list(response.json().keys())[3:7]

    indicator_list = list(response.json().items())[3:7]

    for _, d in indicator_list:
        d.pop("fecha", None)
        d.pop("valor", None)

    
    history_indicators_mtx = [requestSerie(i, YEAR) for i in indicator_names]
    history_indicators_flat = [x for sub in history_indicators_mtx for x in sub]

    # dataframe indicadores
    data_indicators = [v for _, v in indicator_list]
    df_indicators = pd.DataFrame(data_indicators)

    # dataframe historicos
    data_historic = history_indicators_flat
    df_historic = pd.DataFrame(data_historic)

    # conexión
    conn = conectar_bd()
    if not conn:
        return
        
    cur = conn.cursor()

    # ---------- INSERT DF 1: indicator ----------
    buffer1 = io.StringIO()
    df_indicators.to_csv(buffer1, index=False, header=False)
    buffer1.seek(0)
    try:
        cur.copy_from(buffer1, 'indicator', sep=',')
        conn.commit()
    except Exception as e:
        conn.rollback()
        print(f"FALLO al insertar indicadores: {e}")


    # ---------- INSERT DF 2: indicator_history ----------
    buffer2 = io.StringIO()
    df_historic.to_csv(buffer2, index=False, header=False)
    buffer2.seek(0)
    try:
        cur.copy_from(buffer2, 'indicator_value', sep=',')
        conn.commit()
    except Exception as e:
        conn.rollback()


    cur.close()
    conn.close()
  

if __name__ == "__main__":
    main()