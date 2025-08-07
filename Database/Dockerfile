FROM mongo:8

COPY . /docker-entrypoint-initdb.d

RUN chmod +x /docker-entrypoint-initdb.d/import-data.sh