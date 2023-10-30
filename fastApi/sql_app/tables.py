from sqlalchemy import table, column

prediction = table("prediction",
        column("id"),
        column("user_id"),
        column("shortname"),
        column("symbol"),
        column("prediction_value"),
        column("amount"),
        column("time"),
        column("precios"),
        column("dates"),
        column("datesimulation"),
        column("created_at"),
        column("updated_at"),
)