# API de Indicadores · Express

Servicio REST que centraliza los indicadores económicos almacenados en `economia_db`. Se construyó con Express 5, Prisma ORM y PostgreSQL 16.

| Recurso | Valor |
| --- | --- |
| Carpeta | `multiApi/ExpressApi` |
| Puerto docker-compose | `9001` (→ `3000` interno) |
| Base URL local | `http://localhost:9001` |

## Despliegue

### Opción A · Docker
```sh
docker compose up --build express_app
```
Asegúrate de descomentar el servicio `express_app` en `docker-compose.yml` antes de ejecutar el comando.

### Opción B · Ejecución local
```sh
cd multiApi/ExpressApi
npm install
npx prisma generate
export DATABASE_URL="postgresql://dev_user:dev_password@localhost:5435/economia_db"

```
Por defecto la API quedará publicada en `http://localhost:3000`.

## Inventario de endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/` | Health-check básico. |
| `GET` | `/indicator` | Lista de códigos disponibles en la tabla `indicator`. |
| `GET` | `/indicator/:code` | Metadatos del indicador solicitado (nombre, unidad). |
| `GET` | `/indicator/:code/:date` | Valor histórico para la fecha exacta registrada. |

### `GET /`
Confirma el estado del servicio.

**Respuesta 200**
```json
{
  "service": "Express Indicator API",
  "status": "Running"
}
```

### `GET /indicator`
Devuelve los códigos disponibles para consumo rápido en el frontend.

**Respuesta 200**
```json
[
  "UF",
  "UTM",
  "IPC",
  "IMACEC"
]
```

### `GET /indicator/:code`
Obtiene la definición del indicador.

**Parámetros**
- `code` (path, string) — identificador en mayúsculas.

**Respuesta 200**
```json
{
  "code": "UF",
  "name": "Unidad de Fomento",
  "unit": "CLP"
}
```

### `GET /indicator/:code/:date`
Recupera el valor registrado para un día específico.

**Parámetros**
- `code` (path) — indicador.
- `date` (path) — fecha `YYYY-MM-DD` presente en `indicator_value`.

**Respuesta 200**
```json
{
  "indicator_code": "UF",
  "date": "2024-10-21T00:00:00.000Z",
  "value": "37123.1500"
}
```

## Errores y consideraciones

| Código | Motivo | Detalle |
| --- | --- | --- |
| `404` | Registro inexistente | El indicador o la fecha no están cargados (Prisma retorna `null`). |
| `500` | Error interno | Fallo al consultar PostgreSQL o inicializar Prisma. |

## Variables de entorno

| Nombre | Descripción | Ejemplo |
| --- | --- | --- |
| `PORT` | Puerto HTTP opcional. | `3000` |
| `DATABASE_URL` | Cadena utilizada por Prisma. | `postgresql://dev_user:dev_password@db_economia:5432/economia_db` |

## Pruebas rápidas
```sh
curl http://localhost:9001/indicator/UF
curl http://localhost:9001/indicator/UF/2024-10-21
```
Ambas solicitudes deben responder con JSON válido y tiempos de respuesta <100 ms en entorno local.
