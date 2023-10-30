from .celery import app
from sqlalchemy.orm import Session
from sql_app import crud, schemas, models
from datetime import datetime, timedelta, date
from sql_app.database import SessionLocal
from typing import List
import numpy as np
import itertools 
from celery.contrib.abortable import AbortableTask
from time import sleep

@app.task(bind=True, base=AbortableTask)
def dummyTask(self):
    while True:
        sleep(5)
        print('Aun no muero!')
        if self.is_aborted():
            return "Hasta que me detubiste"
    return "Hola mundo"


def calculate_linear_regression(x: List[float], y: List[float]):
    n = len(x)
    if n != len(y):
        raise ValueError("Input lists must have the same length.")
    
    x_mean = np.mean(x)
    y_mean = np.mean(y)
    xy_mean = np.mean(np.multiply(x, y))
    x_squared_mean = np.mean(np.square(x))

    slope = (xy_mean - x_mean * y_mean) / (x_squared_mean - x_mean ** 2)
    intercept = y_mean - slope * x_mean

    return slope, intercept

@app.task
def get_data_sotcks(symbol: str, days: int, user_id: str, amount: int, shortname: str):
    days_before, prices_for_day_before = calculate_prices_for_day(symbol=symbol, days=days)
    
    # Calculate linear regression without scipy
    x = list(range(len(days_before)))
    y = prices_for_day_before
    slope, intercept = calculate_linear_regression(x, y)

    days_after, prices_for_day_after = make_predictions(slope, intercept, days)
    purchase_effectives = get_purchase_effectives(symbol=symbol)
    ponderator = calculate_ponderator(purchase_effectives)

    total_days = days_before + days_after
    total_predictions = prices_for_day_before + [round(price * ponderator, 1) for price in prices_for_day_after]

    prediction_value = total_predictions[-1] * int(amount)

    prediction = save_prediction(symbol=symbol, days=days, user_id=user_id, amount=amount, shortname=shortname, 
                    total_days=total_days, total_predictions=total_predictions, prediction_value=prediction_value)
    
    print(prediction)

    return {"days": total_days, "prices": total_predictions, "prediction_value": prediction_value}


def get_info_stocks(symbol: str, days: int, db: Session = SessionLocal()):
    datelimit = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d") 
    response = crud.get_data_by_symbol( db=db, symbol=symbol, date=datelimit)
    data = response
    counter = 1
    while (len(response) == 100):
        offset = counter * 100
        response = crud.get_data_by_symbol( db=db, symbol=symbol, date=datelimit, skip=offset)
        data += response
        counter += 1
    return data

def calculate_prices_for_day(symbol: str, days: int):
    stocks_info = get_info_stocks(symbol=symbol, days=days)

    key_func:schemas.Broker = lambda x: x.created_at.strftime("%Y-%m-%d")     
    prices_for_day = dict() 

    for key, group in itertools.groupby(stocks_info, key_func):
        elements = list(group)
        prices_for_day[key] = calculate_promedio(elements)
    return list(prices_for_day.keys()), list(prices_for_day.values())

def calculate_promedio(grouped_stock_list: List[schemas.Broker]):
    if len(list(grouped_stock_list)) == 0:
        return 0
 
    suma = sum(stock.stocks_price for stock in grouped_stock_list)
    average = suma / len(list(grouped_stock_list))
    return round(average, 1)

def make_predictions(slope: float, intercept: float, days: int):
    days_to_predict = calculate_days_to_predict(days)
    prediction = calculate_prediction(slope, intercept, days)

    return days_to_predict, prediction

def calculate_prediction(slope: float, intercept: float, days: int):
    prediction = []
    for day in range(days, 2*days):
        prediction.append(slope*day + intercept)
    return prediction

def calculate_days_to_predict(days: int):
    base = date.today()
    date_list = [(base + timedelta(days=x)).strftime("%Y-%m-%d") for x in range(days)]
    return date_list

def get_purchase_effectives(symbol: str, db: Session = SessionLocal()):
    datelimit = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d") 
    response = crud.get_purchase_effectives(db=db, symbol=symbol, date=datelimit)
    return response

def calculate_ponderator(purchase_effectives: int):
    pond = 1 + ((5 + purchase_effectives - 50) / 50)
    return pond

def save_prediction(symbol: str, days: int, user_id: str, amount: str, shortname: str, prediction_value: int, total_predictions: List[float], total_days: List[date], db: Session = SessionLocal()):
    db_prediction = models.Predictions(
                        user_id=user_id,
                        shortname=shortname,
                        symbol=symbol,
                        prediction_value=prediction_value,
                        state=True,
                        amount=amount,
                        time=days,
                        precios=total_predictions, 
                        dates=total_days,
                        datesimulation=date.today()
                        )
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)
    return db_prediction
    