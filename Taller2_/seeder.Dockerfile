FROM python:3.11

# Instalar dependencias necesarias para pandas/requests/psycopg2
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY .env .
COPY seedRecetas.py .
COPY seedPokemon.py .
COPY seedEconomia.py .

RUN pip install --no-cache-dir python-dotenv psycopg2-binary pandas requests