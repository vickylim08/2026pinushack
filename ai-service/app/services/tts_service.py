import os
import hashlib
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

CACHE_DIR = Path("app/static/tts")
CACHE_DIR.mkdir(parents=True, exist_ok=True)

def _cache_key(text: str, voice: str, model: str, speed: float) -> str:
    raw = f"{model}|{voice}|{speed}|{text}".encode("utf-8")
    return hashlib.sha256(raw).hexdigest()

async def synthesize_story_to_mp3(text: str, voice: str = "en-US-AriaNeural", speed: float = 1.0) -> str:
    """
    Generates (or reuses cached) MP3 for the given text using edge-tts.
    Returns relative path under /static, e.g. 'tts/<hash>.mp3'
    """
    text = (text or "").strip()
    if not text:
        raise ValueError("text is empty")

    # keep it short for hackathon reliability
    if len(text) > 1500:
        text = text[:1500] + "..."

    # Use a high-quality neural voice by default if 'alloy' (OpenAI) was passed
    if voice == "alloy" or not voice:
        voice = "en-US-AriaNeural"  # Calming female voice

    model = "edge-tts"
    key = _cache_key(text, voice, model, speed)
    filename = f"{key}.mp3"
    mp3_path = CACHE_DIR / filename

    # cache hit
    if mp3_path.exists() and mp3_path.stat().st_size > 0:
        return f"tts/{filename}"

    try:
        import edge_tts
        # edge-tts speed format is like "+0%" or "-10%"
        # We'll approximate: 1.0 -> "+0%", 1.2 -> "+20%", 0.8 -> "-20%"
        rate_str = "+0%"
        if speed != 1.0:
            pct = int((speed - 1.0) * 100)
            sign = "+" if pct >= 0 else "-"
            rate_str = f"{sign}{abs(pct)}%"
        
        communicate = edge_tts.Communicate(text, voice, rate=rate_str)
        await communicate.save(str(mp3_path))
        
    except Exception as e:
        print(f"edge-tts Error: {e}")
        raise

    return f"tts/{filename}"
