from fastapi import FastAPI, WebSocket
import uvicorn
import websockets
import json
from joblib import load

app = FastAPI()

loaded_model = load("gaussian_model.joblib")
async def fetch_numbers():
    uri = "ws://127.0.0.1:8000/ws"
    async with websockets.connect(uri) as websocket:
        while True:
            data = await websocket.recv()
            yield json.loads(data)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    async for numbers in fetch_numbers():
        y_predict = loaded_model.predict([[numbers["x1"], numbers["x2"]]])
        y_predict = y_predict[0]
        # sum_result = numbers["x1"] + numbers["x2"]
        print(y_predict)
        await websocket.send_json({"sum": y_predict})

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8002)