/*

CREATE TABLE Brokers (id serial PRIMARY KEY, stocks_id varchar(255), datetime varchar(255), stocks_symbol varchar(255), stocks_shortName varchar(255), stocks_price float, stocks_currency varchar(255), stocks_source varchar(255), created_at DATE, updated_at DATE);

CREATE TABLE Purchase (id serial PRIMARY KEY, user_id varchar(255), amount int, group_id varchar(255), datetime varchar(255), stocks_symbol varchar(255), stocks_shortName varchar(255), country varchar(255), city varchar(255), location varchar(255), request_id varchar(255), created_at DATE, updated_at DATE);

CREATE TABLE Wallet (id serial PRIMARY KEY, user_id varchar(255), money float, created_at DATE, updated_at DATE);

CREATE TABLE Validation (
  "id" SERIAL PRIMARY KEY,
  "request_id" VARCHAR(255),
  "group_id" VARCHAR(255),
  "seller" FLOAT,
  "valid" BOOLEAN,
  "created_at" TIMESTAMP,
  "updated_at" TIMESTAMP
);

6509f4af7fd48ae4910c8833

CREATE TABLE Prediction (
  "id" SERIAL PRIMARY KEY,
  "user_id" VARCHAR(255),
  "shortname" VARCHAR(255),
  "symbol" VARCHAR(255),
  "prediction_value" float,
  "state" BOOLEAN,
  "amount" int,
  "time" int,
  "precios" float[],
  "dates" DATE[],
  "datesimulation" DATE,
  "created_at" TIMESTAMP,
  "updated_at" TIMESTAMP
);


INSERT INTO Prediction ("user_id", "shortname", "symbol", "prediction_value", "state", "amount", "time", "precios", "dates", "datesimulation", "created_at", "updated_at")
VALUES ('6509f4af7fd48ae4910c8833', 'Empresa1', 'SYM1', 10.5, true, 100, 12, '{10.5, 11.2, 9.8}', '{2023-10-19, 2023-10-20, 2023-10-21}', '2023-10-19', NOW(), NOW());



INSERT INTO Prediction ("user_id", "shortname", "symbol", "prediction_value", "state", "amount", "time", "precios", "dates", "datesimulation", "created_at", "updated_at")
VALUES ('6509f4af7fd48ae4910c8833', 'Empresa1', 'SYM1', 10.5, true, 100, 12, 
'{10.5, 11.2, 9.8, 10.1, 12.0, 12.1, 8.5, 10.5, 10.5, 9.1, 7.1, 13.7}', 
'{2023-10-19, 2023-10-20, 2023-10-21, 2023-10-22, 2023-10-23, 2023-10-24, 2023-10-25, 2023-10-26, 2023-10-27, 2023-10-28, 2023-10-29, 2023-10-30}', '2023-10-19', 
NOW(), NOW());

*/

