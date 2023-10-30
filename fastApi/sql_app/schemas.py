from typing import Union, List
from datetime import date, datetime

from pydantic import BaseModel

class Broker(BaseModel):
    id: int
    stocks_id: str
    datetime: datetime 
    stocks_symbol: str
    stocks_shortname: str
    stocks_price: float
    stocks_currency: str
    stocks_source: Union[str, None]
    created_at: date 
    updated_at: date 

    class Config:
        orm_mode = True

class Predictions(BaseModel):
    id: int
    user_id: str
    shortname:  str
    symbol:  str
    prediction_value: float
    state: bool
    amount: int
    time: int
    precios: List[float]
    dates: List[date]
    datesimulation: date
    created_at: date
    updated_at: date

    class Config:
        orm_mode = True
