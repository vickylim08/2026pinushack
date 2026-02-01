from fastapi import APIRouter
from app.models.artwork import Artwork
from app.models.user_profile import UserProfile
from app.services.ai_buddy import compare_artworks

router = APIRouter()

@router.post("/ai/compare")
def compare(payload: dict):
    try:
        user = UserProfile(**payload["userProfile"])
        artA = Artwork(**payload["artA"])
        artB = Artwork(**payload["artB"])
        result = compare_artworks(user, artA, artB)
        return result
    except Exception as e:
        print(f"AI Error in /ai/compare: {e}")
        # Fallback response
        return {
            "verdict": "depends",
            "why": "Both artworks have unique qualities that match your profile. (AI unavailable)",
            "differences": [
                {"aspect": "Price", "A": f"{payload['artA'].get('price')}", "B": f"{payload['artB'].get('price')}"},
                {"aspect": "Style", "A": "Unique", "B": "Distinctive"}
            ],
            "confidence_tip": "Choose the one that speaks to you most emotionally."
        }
