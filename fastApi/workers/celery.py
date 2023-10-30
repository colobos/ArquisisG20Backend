from celery import Celery
import os
from dotenv import load_dotenv

load_dotenv()

DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB = os.getenv('DB')
DB_HOST = os.getenv('DB_HOST')

SQLALCHEMY_DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB}"

app = Celery('workers',
             backend='redis://redis/0',
             broker='redis://redis/0',
             include=['workers.tasks'])

app.conf.update(
    result_expires=3600,
)

if __name__ == '__main__':
    app.start()