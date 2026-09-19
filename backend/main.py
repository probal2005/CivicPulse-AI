from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.ai import router as ai_router

app = FastAPI(
    title="CivicPulse AI Backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://civicpulseai-ten.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_router)


@app.get("/")
async def root():
    return {
        "name": "CivicPulse AI Backend",
        "status": "online",
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "civicpulse-ai",
    }