#!/bin/bash

# Create vacations DB:
echo "Starting data import..."

# Import vacations collection:
mongoimport --db vacations --collection vacations --drop --file /docker-entrypoint-initdb.d/vacations.vacations.json --jsonArray

# Import users collection:
mongoimport --db vacations --collection users --drop --file /docker-entrypoint-initdb.d/vacations.users.json --jsonArray

# Import likes collection:
mongoimport --db vacations --collection likes --drop --file /docker-entrypoint-initdb.d/vacations.likes.json --jsonArray

echo "Data import completed successfully!"