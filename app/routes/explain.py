from fastapi import APIRouter
from app.models.artwork import Artwork
from app.models.user_profile import UserProfile
from app.services.ai_buddy import explain_artwork

router = APIRouter()

@router.post("/ai/explain")
def explain(payload: dict):
    try:
        user = UserProfile(**payload["userProfile"])
        art = Artwork(**payload["artwork"])
        result = explain_artwork(user, art)
        return result
    except Exception as e:
        print(f"AI Error in /ai/explain: {e}")
        # Fallback response
        art_title = payload["artwork"].get("title", "Artwork")
        return {
            "summary": f"This is a beautiful piece titled {art_title}. (AI unavailable)",
            "bullets": ["Matches your preferences", "Fits within budget", "Complementary style"],
            "placement": "Perfect for your wall.",
            "buyer_questions": ["Is framing included?", "What are the shipping costs?", "Is a certificate of authenticity provided?"]
        }
