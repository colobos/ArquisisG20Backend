from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Date, Float, ARRAY, DateTime
from sqlalchemy.orm import relationship
from .database import Base

class Broker(Base):
    __tablename__ = "brokers"

    id = Column(Integer, primary_key=True, index=True)
    stocks_id = Column(String)
    datetime = Column(DateTime)
    stocks_symbol = Column(String)
    stocks_shortname = Column(String)
    stocks_price = Column(Float)
    stocks_currency = Column(String)
    stocks_source = Column(String)
    created_at = Column(Date)
    updated_at = Column(Date)

class Purchase(Base):
    __tablename__ = "purchase"
    __allow_unmapped__ = True
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String)
    amount: Column(Integer)
    group_id: Column(String)
    datetime: Column(String)
    stocks_symbol = Column(String)
    stocks_shortname = Column(String)
    country: Column(String)
    city: Column(String)
    location: Column(String)
    created_at = Column(Date)
    updated_at = Column(Date)

class Predictions(Base):
    __tablename__ = "prediction"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String)
    shortname = Column(String)
    symbol = Column(String)
    prediction_value = Column(Float)
    state = Column(Boolean)
    amount = Column(Integer)
    time = Column(Integer)
    precios = Column(ARRAY(Float))
    dates = Column(ARRAY(Date))
    datesimulation = Column(Date)