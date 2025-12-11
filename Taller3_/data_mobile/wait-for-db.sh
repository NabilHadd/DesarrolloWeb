#!/bin/sh

HOST=$1
PORT=$2
shift 2

echo "Waiting for database on $HOST:$PORT..."

while ! nc -z "$HOST" "$PORT"; do
  echo "Waiting..."
  sleep 1
done

echo "Database is up!"

exec sh -c "$@"
