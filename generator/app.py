from fastapi import FastAPI, WebSocket
import uvicorn
from numpy.random import multivariate_normal
import asyncio

app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    # Generate data from Gaussian 1 for 1 minute
    end_time = asyncio.get_event_loop().time() + 60
    while asyncio.get_event_loop().time() < end_time:
        x1, x2 = multivariate_normal([5.5, 5.5], [[1, 0], [0, 1]])
        await websocket.send_json({"x1": x1, "x2": x2})
        await asyncio.sleep(1)

    # Generate data from Gaussian 2 for the rest of the time
    while True:
        x1, x2 = multivariate_normal([13, 13], [[1, 0], [0, 1]])
        await websocket.send_json({"x1": x1, "x2": x2})
        await asyncio.sleep(1)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)