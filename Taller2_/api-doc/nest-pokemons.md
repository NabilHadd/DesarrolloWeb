# API de Pokemones · NestJS

Servicio que expone información de pokemones almacenada en `pokemon_db`, incluyendo sus tipos y habilidades relacionadas. Está construido con NestJS 11, Prisma y PostgreSQL 16.

| Recurso | Valor |
| --- | --- |
| Carpeta | `multiApi/nest-api` |
| Puerto docker-compose | `9002` (→ `3001` interno) |
| Base URL local | `http://localhost:9002` |

## Despliegue

### Opción A · Docker
```sh
docker compose up --build nest_app
```
Descomenta el servicio `nest_app` en `docker-compose.yml` si aún está inhabilitado.

### Opción B · Ejecución local
```sh
cd multiApi/nest-api
npm install
npx prisma generate
export DATABASE_URL="postgresql://dev_user:dev_password@localhost:5436/pokemon_db"
npm run start:dev -- --port 3001
```

## Inventario de endpoints

Todos los endpoints reciben el parámetro de consulta obligatorio `id` (numérico) para identificar al pokémon.

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/pokemon` | Devuelve la ficha principal del pokémon (altura, peso, sprite). |
| `GET` | `/pokemon/tipos` | Lista los tipos asociados. |
| `GET` | `/pokemon/habilidades` | Lista las habilidades registradas. |

### `GET /pokemon?id={id}`
Devuelve los atributos principales del pokémon.

**Response 200**
```json
{
  "id": 25,
  "name": "Pikachu",
  "height": "0.40",
  "weight": "6.00",
  "sprite": "https://cdn.example.com/pikachu.png"
}
```

### `GET /pokemon/tipos?id={id}`
Lista los tipos asociados al pokémon.

```json
[
  { "id": 13, "name": "Eléctrico", "sprite": "https://cdn.example.com/type-electric.png" }
]
```

### `GET /pokemon/habilidades?id={id}`
Retorna las habilidades vinculadas.

```json
[
  { "id": 98, "name": "Electric Surge", "effect": "Boosts Electric-type moves." },
  { "id": 31, "name": "Static", "effect": "May paralyze on contact." }
]
```

## Errores y validaciones

| Código | Motivo | Descripción |
| --- | --- | --- |
| `400` | Parámetro inválido | `id` vacío o no numérico. |
| `404` | Registro inexistente | No se encontró el pokémon o la relación solicitada. |
| `500` | Error interno | Problemas de conexión o consultas Prisma. |

## Variables de entorno

| Nombre | Descripción | Ejemplo |
| --- | --- | --- |
| `PORT` | Puerto HTTP (opcional). | `3001` |
| `DATABASE_URL` | Cadena usada por Prisma. | `postgresql://dev_user:dev_password@db_pokemon:5432/pokemon_db` |

## Pruebas rápidas
```sh
curl "http://localhost:9002/pokemon?id=1"
curl "http://localhost:9002/pokemon/tipos?id=1"
curl "http://localhost:9002/pokemon/habilidades?id=1"
```
Cada respuesta debería retornar JSON consistente listo para ser consumido por el frontend.
