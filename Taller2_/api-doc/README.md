# Documentación de APIs

Este directorio concentra la referencia técnica de las tres APIs exigidas por el taller. Cada servicio funciona y se despliega de manera independiente; consulta el archivo correspondiente para conocer endpoints, modelos de datos y pasos de ejecución.

| Servicio | Stack | Puerto (docker-compose) | Documento |
| --- | --- | --- | --- |
| Recetas | FastAPI + SQLAlchemy | `localhost:9000` | [fastapi-recetas.md](fastapi-recetas.md) |
| Economía | Express + Prisma + PostgreSQL | `localhost:9001` | [express-indicadores.md](express-indicadores.md) |
| Pokemones | NestJS + Prisma + PostgreSQL | `localhost:9002` | [nest-pokemons.md](nest-pokemons.md) |

> Todos los servicios comparten las variables de entorno definidas en `docker-compose.yml`. Para un despliegue local, inicia la pila desde la raíz del proyecto:
>
> ```sh
> docker compose up --build
> ```
>
> También puedes correr cada API en forma aislada siguiendo las instrucciones indicadas en su documento.
