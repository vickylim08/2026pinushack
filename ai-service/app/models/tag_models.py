from pydantic import BaseModel
from typing import List, Optional, Dict, Any

STYLE_TAGS = ["abstract", "realistic", "minimal", "surreal", "expressionist", "impressionist", "pop-art", "geometric"]
MOOD_TAGS  = ["calm", "energetic", "melancholic", "joyful", "mysterious", "reflective"]
COLOR_TAGS = ["blue", "red", "green", "yellow", "black", "white", "monochrome", "pastel"]
THEME_TAGS = ["nature", "ocean", "city", "memory", "identity", "dream", "portrait", "landscape"]
SPACE_TAGS = ["bedroom", "living_room", "study", "office", "hallway"]

class TagSuggestRequest(BaseModel):
    title: str
    story: Optional[str] = ""
    medium: Optional[str] = None
    year: Optional[int] = None
    size: Optional[Dict[str, Any]] = None

    # One of these should be provided:
    imageUrl: Optional[str] = None
    imageBase64: Optional[str] = None  # if you can’t host images yet

class TagSuggestResponse(BaseModel):
    style: List[str]
    mood: List[str]
    colors: List[str]
    themes: List[str]
    space: List[str]
    explanation: str
