# AI Crowd Risk Predictor - Backend

## 🎯 Overview

FastAPI-based backend system for real-time crowd analysis, risk prediction, and proactive safety management.

## 🏗️ Architecture

### Core Components

1. **CrowdAnalyzer** (`crowd_agent.py`)
   - Simulates YOLO-based crowd detection
   - Generates bounding boxes for person detection
   - Classifies crowd density into 4 risk levels
   - Provides real-time analysis with confidence scores

2. **RiskPredictor** (`risk_predictor.py`)
   - Predicts crowd risk for 10-minute and 30-minute horizons
   - Uses trend analysis and pattern recognition
   - Factors in time-of-day, event patterns, and historical data
   - Provides confidence scores for predictions

3. **SafetyActionManager** (`safety_actions.py`)
   - Manages proactive safety measures
   - Deploys officers, barricades, and medical units
   - Provides context-aware action recommendations
   - Simulates emergency protocol activation

## 🚀 Quick Start

### Installation

```bash
cd backend
pip install -r requirements.txt
```

### Run Server

```bash
# Method 1: Direct uvicorn
uvicorn app:app --reload --host 0.0.0.0 --port 8000

# Method 2: Using start script
python start_server.py

# Method 3: Production
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4
```

## 📡 API Endpoints

### Core Endpoints

- `GET /` - API status and information
- `GET /health` - Health check with component status
- `POST /upload-video` - Upload video file for analysis
- `POST /analyze-video/{file_id}` - Start video analysis
- `GET /events` - Get historical event data
- `WebSocket /ws` - Real-time updates

### Example Usage

```bash
# Health check
curl http://localhost:8000/health

# Upload video
curl -X POST -F "file=@crowd_video.mp4" http://localhost:8000/upload-video

# Start analysis
curl -X POST http://localhost:8000/analyze-video/your-file-id
```

## 🔄 WebSocket Communication

The backend provides real-time updates via WebSocket:

```javascript
const ws = new WebSocket('ws://localhost:8000/ws');

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    if (data.type === 'analysis_update') {
        // Handle risk data and safety actions
        console.log('Risk Level:', data.risk_data.current.level);
        console.log('Actions:', data.safety_actions.actions);
    }
};
```

## 📊 Risk Classification System

### 4-Tier Risk Levels

1. **Good** (0-50 detections)
   - "Good to go / Well managed / Low crowd"
   - Actions: Regular monitoring, standard protocols

2. **Moderate** (51-120 detections)
   - "Moderate crowd but no danger"
   - Actions: Increased monitoring, enhanced officer presence

3. **Overcrowd** (121-200 detections)
   - "Overcrowd / Very much crowded / Attention needed"
   - Actions: Deploy more officers, control entry flow

4. **Stampede** (201+ detections)
   - "Stampede / Red alert / Very much attention needed"
   - Actions: Emergency protocols, close barricades, medical teams

## 🔮 Prediction System

### Time Horizons

- **10-minute predictions**: Short-term crowd changes
- **30-minute predictions**: Medium-term trend analysis

### Prediction Factors

- Time of day patterns
- Event schedules
- Historical data
- Weather conditions
- Current crowd trends

## 🛡️ Safety Action System

### Resource Types

1. **Officers**
   - Dynamic deployment based on risk level
   - Status tracking (patrol, monitoring, deployed)
   - Equipment assignment
   - Communication channels

2. **Barricades**
   - Position management
   - Status control (open, controlled, closed)
   - Capacity tracking
   - Type classification

3. **Medical Units**
   - Strategic positioning
   - Status monitoring (standby, ready, active)
   - Equipment level assignment
   - Response time tracking

## 💾 Database Schema

### Events Table

```sql
CREATE TABLE events (
    id TEXT PRIMARY KEY,
    timestamp DATETIME,
    video_filename TEXT,
    current_risk TEXT,
    current_confidence REAL,
    detections INTEGER,
    prediction_10min TEXT,
    prediction_30min TEXT,
    actions TEXT
);
```

## 🔧 Configuration

### Environment Variables

```bash
HOST=0.0.0.0          # Server host
PORT=8000             # Server port
RELOAD=true           # Auto-reload for development
```

### CORS Settings

Configured for frontend development:
- `http://localhost:5173` (Vite)
- `http://localhost:3000` (React)

## 🧪 Testing

### Manual Testing

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test WebSocket connection
wscat -c ws://localhost:8000/ws
```

### Load Testing

```bash
# Install wrk
brew install wrk  # macOS
apt install wrk   # Ubuntu

# Test API performance
wrk -t12 -c400 -d30s http://localhost:8000/health
```

## 📈 Performance

### Optimization Features

- Async/await for non-blocking operations
- WebSocket for real-time communication
- SQLite for fast local storage
- Efficient crowd detection simulation
- Memory-optimized data structures

### Scaling Considerations

- Use Redis for session management in production
- Implement database connection pooling
- Add caching layer for frequent queries
- Use message queues for heavy processing

## 🔒 Security

### Current Implementation

- CORS protection
- Input validation
- File upload restrictions
- SQL injection prevention

### Production Recommendations

- Add authentication/authorization
- Implement rate limiting
- Use HTTPS/WSS
- Add request validation middleware
- Implement logging and monitoring

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   lsof -ti:8000 | xargs kill -9
   ```

2. **Module import errors**
   ```bash
   pip install -r requirements.txt
   export PYTHONPATH="${PYTHONPATH}:$(pwd)"
   ```

3. **WebSocket connection issues**
   - Check firewall settings
   - Verify CORS configuration
   - Test with WebSocket client

## 📝 Development Notes

### Adding New Features

1. **New Risk Factors**
   - Modify `risk_predictor.py`
   - Update prediction algorithms
   - Add new confidence factors

2. **Additional Safety Actions**
   - Extend `safety_actions.py`
   - Add new resource types
   - Implement new deployment strategies

3. **Enhanced Analytics**
   - Add new database tables
   - Implement data aggregation
   - Create reporting endpoints

### Code Structure

```
backend/
├── app.py              # Main FastAPI application
├── crowd_agent.py      # YOLO simulation & crowd detection
├── risk_predictor.py   # Risk prediction algorithms
├── safety_actions.py   # Safety measure management
├── start_server.py     # Server startup script
└── requirements.txt    # Python dependencies
```

## 🚀 Production Deployment

### Docker Deployment

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Systemd Service

```ini
[Unit]
Description=AI Crowd Risk Predictor API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/crowd-predictor/backend
ExecStart=/usr/local/bin/uvicorn app:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

## 📊 Monitoring

### Health Checks

The `/health` endpoint provides comprehensive system status:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00",
  "components": {
    "crowd_analyzer": "active",
    "risk_predictor": "active",
    "safety_manager": "active",
    "database": "connected"
  }
}
```

### Logging

Structured logging for production monitoring:

```python
import logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

---

## 🎯 Ready for Hackathon!

This backend provides a complete foundation for the AI Crowd Risk Predictor application with:

✅ Real-time crowd analysis simulation  
✅ 4-tier risk classification system  
✅ Predictive analytics (10min/30min)  
✅ Proactive safety action management  
✅ WebSocket real-time updates  
✅ RESTful API endpoints  
✅ SQLite data persistence  
✅ Comprehensive documentation  

Start the server and begin building the future of crowd safety management! 🚀