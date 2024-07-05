# Importation des bibliothèques nécessaires
import asyncio
from fastapi import FastAPI, WebSocket
import uvicorn
import json

# Création de l'instance de l'application FastAPI
app = FastAPI()

# Route WebSocket
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Chargement des données depuis un fichier JSON
            with open("./dataMachine.json", "r") as file:
                data = json.load(file)
            # Envoi des données au client via WebSocket
            await websocket.send_json(data)
            # Attendre avant d'envoyer le prochain message
            await asyncio.sleep(1)
    except Exception as e:
        print(f"Erreur : {e}")
    finally:
        await websocket.close()

# Fonction principale pour démarrer le serveur
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8002)