from fastapi import FastAPI
from workers.tasks import get_data_sotcks, dummyTask
from celery.result import AsyncResult
from celery.contrib.abortable import AbortableAsyncResult
from workers.celery import app as celery_app

app = FastAPI()

@app.get("/job/{job_id}")
def get_job(job_id: str):
    job = AsyncResult(job_id, app=celery_app)
    data = job.get()
    return data

@app.post("/job")
def make_simulation(data: dict):
    job_id = get_data_sotcks.delay(symbol=data["symbol"], days=int(data["time"]), user_id=data["user_id"],
                                   amount=int(data["amount"]), shortname=data["shortname"])
    return f"{job_id}"

@app.get("/heartbeat") # Hay algo de esto en la documentación, en volá echar un ojo?

def heartbeat():
    return True

@app.get("/cancelTask/{taskId}")
def cancelTask(taskId: str):
    job = AbortableAsyncResult(taskId, app=celery_app)
    job.abort()
    data = job.get()
    return data

@app.get("/test")
def tester(symbol: str, days: int):
    result = get_data_sotcks.delay(symbol=symbol, days=days)
    data = result.get()
    return data

@app.get("/careateDummy")
def createDummy():
    job_id = dummyTask.delay() 
    return f"{job_id}"

if __name__ == '__main__':
    app.start()