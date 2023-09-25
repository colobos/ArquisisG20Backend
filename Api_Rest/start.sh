#!/bin/sh
echo "Starting server"
npx sequelize-cli db:migrate
yarn dev