/*

CREATE TABLE Brokers (id serial PRIMARY KEY, stocks_id varchar(255), datetime varchar(255), stocks_symbol varchar(255), stocks_shortName varchar(255), stocks_price float, stocks_currency varchar(255), stocks_source varchar(255), created_at DATE, updated_at DATE);

CREATE TABLE Purchase (id serial PRIMARY KEY, user_id varchar(255), amount int, group_id varchar(255), datetime varchar(255), stocks_symbol varchar(255), stocks_shortName varchar(255), country varchar(255), city varchar(255), location varchar(255), created_at DATE, updated_at DATE);

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

*/