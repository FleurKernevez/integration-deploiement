FROM mysql:latest
ENV MYSQL_ROOT_PASSWORD ynovpwd
COPY ./sqlfiles/migrate-v001.sql /docker-entrypoint-initdb.d
EXPOSE 3306