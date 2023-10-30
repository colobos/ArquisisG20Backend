from sqlalchemy.orm import Session
from . import database
from datetime import datetime
from . import models
from sqlalchemy import update
from . import tables
from typing import List
from datetime import date


def get_data_by_symbol(db: Session, symbol: str, date: datetime, skip: int = 0, limit: int = 100):
    return db.query(
        models.Broker).filter(
        models.Broker.datetime >= date).filter(
        models.Broker.stocks_symbol == symbol
        ).offset(skip).limit(limit).all()

def get_purchase_effectives(db: Session, symbol: str, date: datetime):
    return db.query(
        models.Purchase).filter(
        models.Purchase.created_at >= date).filter(
        models.Purchase.stocks_symbol == symbol
        ).count()

def update_with_final_data(db: Session, id: str, precios: List[float], dates: List[date], prediction_value: float):
    stmt = ( 
        update(tables.prediction).
        where(tables.prediction.c.id == id).
        values(precios=precios, dates=dates, prediction_value=prediction_value)
    )

    database.engine.execute(stmt)