import psycopg2
import pandas as pd
import os
import requests


DB_CONFIG = {
    "dbname": "economia",
    "user": "postgres",
    "password": "123",
    "host": "localhost",
    "port": "5432"
}

URL = "https://findic.cl/api"

fst_date = '01-01-2024'
snd_date = '01-01-2025'

unidades = {
    "uf": (fst_date, snd_date),
    "dolar": (fst_date, snd_date),
    "euro": (fst_date, snd_date)

}

"${codigo}/${newDate}"


def conectar_bd():
    return psycopg2.connect(**DB_CONFIG)



def main():

    conn = conectar_bd()
    cur = conn.cursor()

    for indice, fechas in unidades.items():

        response = requests.get(f'{URL}/{indice}/01-01-2024')
        try:


            cur.execute("""
                INSERT INTO "Producto" (nombre, descripcion, precio, stock, imagen)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                row["nombre"],
                row["descripcion"],
                row["precio"],
                row["stock"],
                psycopg2.Binary(imagen_bytes)
            ))

        except Exception as e:
            print(f"Error en fila {i}: {e}")
        
        print(response.json())


'''
    # Insertar registros
    for i, row in df.iterrows():
        try:
            img_path = os.path.join(IMAGES_DIR, imagenes[i])
            imagen_bytes = leer_imagen(img_path)

            cur.execute("""
                INSERT INTO "Producto" (nombre, descripcion, precio, stock, imagen)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                row["nombre"],
                row["descripcion"],
                row["precio"],
                row["stock"],
                psycopg2.Binary(imagen_bytes)
            ))

        except Exception as e:
            print(f"Error en fila {i}: {e}")

    conn.commit()
    print("✅ Productos insertados correctamente.")

    # Insertar administrador por defecto
    try:
        cur.execute("""
            INSERT INTO "Administrador" (rut_admin, nombre, email, contraseña)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (rut_admin) DO NOTHING
        """, (
            "111111111",
            "Nabil",
            "nabil@example.com",
            "123"
        ))
        print("✅ Administrador agregado correctamente.")
    except Exception as e:
        print(f"Error al insertar administrador: {e}")

    # Confirmar cambios y cerrar
    conn.commit()
    cur.close()
    conn.close()
    print("✅ Productos y administrador insertados correctamente.")'''


if __name__ == "__main__":
    main()