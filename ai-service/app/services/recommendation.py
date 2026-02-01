from typing import List
from app.models.artwork import Artwork
from app.models.user_profile import UserProfile
from app.services.scoring import score_artwork

def rank_artworks(artworks: List[Artwork], user: UserProfile):
    ranked = []

    for art in artworks:
        s = score_artwork(art, user)
        if s > 0:
            ranked.append({
                "artwork": art,
                "score": s
            })

    ranked.sort(key=lambda x: x["score"], reverse=True)
    return ranked
