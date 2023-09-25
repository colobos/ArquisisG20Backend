# 2023-2 / IIC2173 - E1 | Fintech Async


## Informacion dirección de la API

Dominio de la API (con www.): [https://www.arquisis.me/](https://www.arquisis.me/)<br>
IP de la API: 3.143.165.103

## Diagrama UML

El diagrama UML realizado se encuentra en la carpeta docs/e1-uml-diagram.png

El sistema se basa en la autenticación a través de Auth0 y utiliza un Frontend desplegado en Amazon S3 para interactuar con los usuarios. El Frontend se comunica con CloudFront, que actúa como una capa de almacenamiento y distribución de contenido. Luego, se establece una comunicación con el Backend alojado en instancias de Amazon EC2.

El API Gateway se encarga de gestionar las solicitudes entrantes y utiliza tokens JWT (JSON Web Tokens) para garantizar la seguridad de la comunicación. Cuando se recibe una solicitud en EC2, esta es intermediada por NGINX, que redirige la solicitud al puerto correspondiente en función de la ruta.

Dentro de la instancia de EC2, encontramos una API Rest que procesa estas solicitudes. La API Rest interactúa con una base de datos para almacenar y gestionar la información relevante. Además, se comunica con un Broker utilizando un listener MQTT para recibir datos en tiempo real.

Cuando se realizan solicitudes a la API Rest, esta puede acceder a la información almacenada en la base de datos para responder a las solicitudes de manera eficiente y precisa. En resumen, el sistema se compone de múltiples componentes que trabajan juntos para brindar una experiencia segura y eficiente a los usuarios, desde la autenticación hasta el procesamiento de datos en tiempo real.


## Pasos para reeplicar Pipeline de CI


Los pasos para reeplicar el pipeline de CI utilizado se encuentran en la carpeta docs/CI pipeline.pdf


## Ejecutar la Aplicación en Local

Para correr la aplicación de forma local, primero se deben descargar ambos repositorios: ArquisisG20Front y ArquisisG20Backend.

Para correr el Backend, se debe ubicar en la carpeta principal, y correr los siguientes códigos:

```sh
docker compose build -d
docker compose up -d
```
Una vez que la aplicación se encuentre corriendo con compose up -d, se debe acceder al contenedor de postgresql con:
```sh
docker exec -it postgres psql -U nombre_usuario_db -d nombre_db
```
Y crear las siguientes consultas a la base de datos:
```sh
CREATE TABLE Brokers (id serial PRIMARY KEY, stocks_id varchar(255), datetime varchar(255), stocks_symbol varchar(255), stocks_shortName varchar(255), stocks_price float, stocks_currency varchar(255), stocks_source varchar(255), created_at DATE, updated_at DATE);

CREATE TABLE Purchase (id serial PRIMARY KEY, user_id int, amount int, group_id varchar(255), datetime varchar(255), stocks_symbol varchar(255), stocks_shortName varchar(255), country varchar(255), city varchar(255), location varchar(255), created_at DATE, updated_at DATE);

CREATE TABLE Wallet (id serial PRIMARY KEY, user_id varchar(255), money float, created_at DATE, updated_at DATE);

CREATE TABLE Validation ("id" SERIAL PRIMARY KEY, "request_id" VARCHAR(255), "group_id" VARCHAR(255), "seller" FLOAT, "valid" BOOLEAN, "created_at" TIMESTAMP, "updated_at" TIMESTAMP);
```

Para correr el Frontend, se debe ubicar en la carpeta principal, y correr los siguientes códigos:
```sh
npm install
npm start
```

Asimismo, se deben crear 2 archivos .env respectivamente para el Backend y para el Frontend:

El archivo .env del Backend debe contener:
DB_USER=nombre_usuario_db
DB_NAME=nombre_db
DB_PASSWORD=password_db
DB_HOST=db
CLIENT_ID=emqx_client_id
USERNAME=students
PASSWORD=iic2173-2023-2-students
HOST=broker.legit.capital
HOST_PORT=9000
POSTGRES_USER=nombre_usuario_db
POSTGRES_PASSWORD=password_db
POSTGRES_DB=nombre_db

El archivo .env del Frontend para correr de forma local debe contener:
REACT_APP_BACKEND_LOCAL_URL=http://localhost:3000/
REACT_APP_BACKEND_ENV=local
