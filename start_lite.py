from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

app = FastAPI(title="Nexus AI - Lite Mode", version="1.0.0")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "mode": "lite"}

@app.get("/")
async def root():
    return {"message": "Nexus AI Lite API Running"}

# Mock endpoints so frontend doesn't crash immediately
@app.get("/api/system-status")
async def system_status():
    return {
        "cpu_usage": 15,
        "memory_usage": 30,
        "active_agents": 0,
        "system_health": "healthy"
    }

if __name__ == "__main__":
    uvicorn.run("start_lite:app", host="0.0.0.0", port=8001, reload=True)
