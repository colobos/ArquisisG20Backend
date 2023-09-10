# Database

# Opens the database console in the database container
psql:
	sh -c "docker exec -it postgres psql -U arquisis -d arquisis_db"

# docker compose run app npx sequelize-cli db:migrate