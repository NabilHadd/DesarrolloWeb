# API de Recetas · FastAPI

Servicio REST que entrega las recetas persistidas en `recetas_db`. La API consolida la información normalizada en PostgreSQL y la publica con FastAPI 0.115 y SQLAlchemy.

| Recurso | Valor |
| --- | --- |
| Carpeta | `multiApi/FastApi` |
| Puerto docker-compose | `9000` (→ `8000` interno) |
| Base URL local | `http://localhost:9000` |

## Despliegue

### Opción A · Docker (recomendada)
```sh
docker compose up --build fastapi_app
```
1. Levanta `db_recetas` y ejecuta los seeders.
2. Publica la API en `http://localhost:9000`.

### Opción B · Ejecución local (Python 3.11+)
```sh
cd multiApi/FastApi
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export DB_HOST=localhost
export DB_NAME=recetas_db
export DB_USER=dev_user
export DB_PASSWORD=dev_password
uvicorn main:app --reload --port 8000
```
Define las variables según la instancia PostgreSQL que utilices.

## Inventario de endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/` | Verificación de salud. |
| `GET` | `/meals` | Lista todas las recetas, incluyendo los primeros 20 ingredientes y medidas formateados para el frontend. |

### `GET /`
Retorna un mensaje breve confirmando que el servicio está activo.

**Ejemplo**
```http
GET / HTTP/1.1
Host: localhost:9000
```

**Respuesta 200**
```json
{
  "message": "Hola desde FastAPI - API de Recetas"
}
```

### `GET /meals`
Transforma la estructura relacional (`meals`, `ingredients`, `meal_ingredients`) a un arreglo plano compatible con el frontend (campos `strIngredientN`/`strMeasureN`).

**Parámetros**
- No requiere parámetros ni autenticación.

**Respuesta 200**
```json
[
  {
    "strMeal": "Charquicán",
    "strMealThumb": "https://cdn.example.com/charquican.jpg",
    "strIngredient1": "Papa",
    "strMeasure1": "200 g",
    "strIngredient2": "Zapallo",
    "strMeasure2": "150 g"
  },
  {
    "strMeal": "Pastel de choclo",
    "strMealThumb": "https://cdn.example.com/pastel-choclo.jpg",
    "strIngredient1": "Choclo",
    "strMeasure1": "2 tazas"
  }
]
```

**Modelo de datos emitido**

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `strMeal` | `string` | Nombre comercial de la receta. |
| `strMealThumb` | `string (URL)` | Miniatura almacenada en la tabla `meals`. |
| `strIngredient1..20` | `string` | Nombres de ingredientes ordenados. Si no existen más ingredientes, el campo se omite. |
| `strMeasure1..20` | `string` | Cantidades asociadas al ingrediente `n`. |

## Errores y respuestas estándar

| Código | Motivo | Cuerpo |
| --- | --- | --- |
| `500` | Error consultando PostgreSQL o construyendo la respuesta. | `{ "error": "Error interno del servidor al consultar las comidas." }` |

> FastAPI ya expone la documentación interactiva en `http://localhost:9000/docs` (Swagger UI) y `http://localhost:9000/redoc` (ReDoc).

## Variables de entorno

| Nombre | Descripción | Predeterminado |
| --- | --- | --- |
| `DB_HOST` | Host o servicio donde corre PostgreSQL. | `db_recetas` (Docker) / `localhost` |
| `DB_NAME` | Base de datos objetivo. | `recetas_db` |
| `DB_USER` | Usuario con permisos de lectura. | `dev_user` |
| `DB_PASSWORD` | Contraseña del usuario configurado. | `dev_password` |
| `DB_PORT` | Puerto PostgreSQL interno. | `5432` |

## Prueba rápida
```sh
curl -s http://localhost:9000/meals | jq '.[0] | {nombre: .strMeal, ingredientes: [.strIngredient1, .strIngredient2]}'
```
Muestra la primera receta junto a sus dos primeros ingredientes como verificación inicial.
