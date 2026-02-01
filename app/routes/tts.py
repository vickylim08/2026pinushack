from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from app.services.tts_service import synthesize_story_to_mp3

router = APIRouter()

class TTSRequest(BaseModel):
    text: str
    voice: Optional[str] = "alloy"   # simple default
    speed: Optional[float] = 1.0

@router.post("/tts/story")
async def tts_story(payload: TTSRequest):
    try:
        rel_path = await synthesize_story_to_mp3(
            text=payload.text,
            voice=payload.voice or "en-US-AriaNeural",  # Use nice default if missing
            speed=payload.speed or 1.0
        )
        # Served under /static
        return {"audioUrl": f"/static/{rel_path}"}
    except Exception as e:
        print(f"TTS Route Error: {e}")
        # Fallback to avoid 500
        return {"audioUrl": "/static/tts/fallback.mp3", "note": "AI TTS unavailable, returning fallback."}
