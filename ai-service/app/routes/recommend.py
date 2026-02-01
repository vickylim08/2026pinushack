from fastapi import APIRouter
from app.models.artwork import Artwork
from app.models.user_profile import UserProfile
from app.services.recommendation import rank_artworks
from app.services.ai_curation import ai_curate_top_4

router = APIRouter()

@router.post("/ai/recommend")
def recommend(payload: dict):
    user = UserProfile(**payload["userProfile"])
    artworks = [Artwork(**a) for a in payload["artworks"]]

    ranked = rank_artworks(artworks, user)
    candidates = [item["artwork"] for item in ranked[:20]]

    try:
        ai_result = ai_curate_top_4(user, candidates)
        return ai_result
    except Exception:
        return {
            "recommendedArtworks": [a.id for a in candidates[:4]],
            "curator_welcome": "Here are some artworks selected based on your preferences."
        }
