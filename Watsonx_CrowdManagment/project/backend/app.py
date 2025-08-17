import os
import uuid
import json
import time
import asyncio
import sqlite3
import requests
from datetime import datetime
from typing import List, Dict, Any
from fastapi import FastAPI, File, UploadFile, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from crowd_agent import CrowdAnalyzer
from risk_predictor import RiskPredictor
from safety_actions import SafetyActionManager

app = FastAPI(title="AI Crowd Risk Predictor API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
crowd_analyzer = CrowdAnalyzer()
risk_predictor = RiskPredictor()
safety_manager = SafetyActionManager()

# Watsonx credentials
API_KEY = os.getenv("WATSONX_API_KEY")
PROJECT_ID = os.getenv("WATSONX_PROJECT_ID")
BASE_URL = os.getenv("WATSONX_AI_URL")
MODEL_ID = "ibm/granite-3-3-8b-instruct"

# Watsonx: Get access token
def get_access_token():
    url = "https://iam.cloud.ibm.com/identity/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {
        "apikey": API_KEY,
        "grant_type": "urn:ibm:params:oauth:grant-type:apikey"
    }
    resp = requests.post(url, headers=headers, data=data)
    return resp.json()["access_token"]

# Watsonx: Make prediction
def get_prediction(crowd_count, time_str, status):
    token = get_access_token()
    prompt = f"""
    Current crowd count: {crowd_count}
    Time: {time_str}
    Status: {status}

    Predict the situation for the next 10 minutes. 
    Categories:
    1. Good to go / Low crowd
    2. Moderate crowd, no danger
    3. Very crowded, attention needed
    4. Stampede risk / Red alert
    """

    url = f"{BASE_URL}/ml/v1/text/generation?version=2023-05-29"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    body = {
        "input": prompt,
        "parameters": {"decoding_method": "greedy", "max_new_tokens": 100},
        "model_id": MODEL_ID,
        "project_id": PROJECT_ID
    }

    resp = requests.post(url, headers=headers, json=body)
    return resp.json()["results"][0]["generated_text"]

# WebSocket connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except:
                pass

manager = ConnectionManager()

# Initialize DB
def init_db():
    conn = sqlite3.connect('crowd_events.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS events (
            id TEXT PRIMARY KEY,
            timestamp DATETIME,
            video_filename TEXT,
            current_risk TEXT,
            current_confidence REAL,
            detections INTEGER,
            prediction_10min TEXT,
            prediction_30min TEXT,
            actions TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# Routes
@app.get("/")
async def root():
    return {"message": "AI Crowd Risk Predictor API", "status": "running"}

@app.post("/upload-video")
async def upload_video(file: UploadFile = File(...)):
    try:
        os.makedirs("uploads", exist_ok=True)
        file_id = str(uuid.uuid4())
        file_path = f"uploads/{file_id}_{file.filename}"

        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        return {
            "file_id": file_id,
            "filename": file.filename,
            "status": "uploaded",
            "message": "Video uploaded successfully"
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Upload failed: {str(e)}"})

@app.post("/analyze-video/{file_id}")
async def analyze_video(file_id: str):
    try:
        asyncio.create_task(process_video_analysis(file_id))
        return {
            "file_id": file_id,
            "status": "analysis_started",
            "message": "Video analysis started"
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Analysis failed: {str(e)}"})

async def process_video_analysis(file_id: str):
    try:
        for frame_count in range(100):
            await asyncio.sleep(2)
            analysis = crowd_analyzer.analyze_frame(frame_count)
            predictions = risk_predictor.predict_risk(analysis)
            actions = safety_manager.get_actions(analysis['risk_level'])

            risk_data = {
                "current": {
                    "level": analysis['risk_level'],
                    "category": analysis['category'],
                    "confidence": analysis['confidence'],
                    "detections": analysis['detections']
                },
                "predictions": {
                    "next10min": predictions['10min'],
                    "next30min": predictions['30min']
                }
            }

            safety_data = {
                "actions": actions['actions'],
                "officers": actions['officers'],
                "barricades": actions['barricades'],
                "medical": actions['medical']
            }

            store_event(file_id, analysis, predictions, actions)

            await manager.broadcast({
                "type": "analysis_update",
                "risk_data": risk_data,
                "safety_actions": safety_data,
                "frame_count": frame_count
            })

    except Exception as e:
        await manager.broadcast({
            "type": "error",
            "message": f"Analysis error: {str(e)}"
        })

def store_event(file_id: str, analysis: dict, predictions: dict, actions: dict):
    try:
        conn = sqlite3.connect('crowd_events.db')
        cursor = conn.cursor()

        event_id = str(uuid.uuid4())
        cursor.execute('''
            INSERT INTO events (
                id, timestamp, video_filename, current_risk, current_confidence,
                detections, prediction_10min, prediction_30min, actions
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            event_id,
            datetime.now(),
            file_id,
            analysis['risk_level'],
            analysis['confidence'],
            analysis['detections'],
            json.dumps(predictions['10min']),
            json.dumps(predictions['30min']),
            json.dumps(actions['actions'])
        ))

        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Database error: {e}")

@app.get("/events")
async def get_events():
    try:
        conn = sqlite3.connect('crowd_events.db')
        cursor = conn.cursor()

        cursor.execute('SELECT * FROM events ORDER BY timestamp DESC LIMIT 50')
        events = []
        for row in cursor.fetchall():
            events.append({
                "id": row[0],
                "timestamp": row[1],
                "video_filename": row[2],
                "current_risk": row[3],
                "current_confidence": row[4],
                "detections": row[5],
                "prediction_10min": json.loads(row[6]) if row[6] else None,
                "prediction_30min": json.loads(row[7]) if row[7] else None,
                "actions": json.loads(row[8]) if row[8] else None
            })

        conn.close()
        return {"events": events}

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Database error: {str(e)}"})

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "components": {
            "crowd_analyzer": "active",
            "risk_predictor": "active",
            "safety_manager": "active",
            "database": "connected"
        }
    }

@app.post("/predict-risk")
async def predict_risk(request: Request):
    """Call IBM Watsonx AI model to get crowd prediction"""
    try:
        data = await request.json()
        crowd_count = data.get("crowd_count")
        time_str = data.get("time")
        status = data.get("status")

        if not (crowd_count and time_str and status):
            return JSONResponse(status_code=400, content={"error": "Missing required fields"})

        prediction = get_prediction(crowd_count, time_str, status)
        return {"prediction": prediction}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Prediction failed: {str(e)}"})

# Run with: uvicorn app:app --reload
