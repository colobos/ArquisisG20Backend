#!/bin/sh
echo "Make migrations"
npx sequelize-cli db:migrate
echo "Starting server"
npm run dev