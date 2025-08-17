#!/usr/bin/env python3
"""
Start script for the AI Crowd Risk Predictor backend server
"""

import uvicorn
import os
import sys

def main():
    """Start the FastAPI server"""
    print("🚀 Starting AI Crowd Risk Predictor Backend Server...")
    print("📊 Initializing crowd analysis components...")
    print("🔮 Loading risk prediction models...")
    print("🛡️  Setting up safety action systems...")
    print("💾 Connecting to database...")
    print("🌐 Starting WebSocket connections...")
    
    # Configuration
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    reload = os.getenv("RELOAD", "true").lower() == "true"
    
    print(f"\n✅ Server starting on http://{host}:{port}")
    print("📡 WebSocket endpoint: ws://localhost:8000/ws")
    print("📋 API documentation: http://localhost:8000/docs")
    print("🔍 Health check: http://localhost:8000/health")
    print("\n🎯 Ready for crowd analysis!")
    
    try:
        uvicorn.run(
            "app:app",
            host=host,
            port=port,
            reload=reload,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Server error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()