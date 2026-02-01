from app.models.artwork import Artwork
from app.models.user_profile import UserProfile

def score_artwork(art: Artwork, user: UserProfile) -> int:
    score = 0

    for tag in art.tags:
        if tag in user.style:
            score += 4
        if tag in user.mood:
            score += 3
        if tag in user.colors:
            score += 2
        if tag in user.themes:
            score += 2

    if art.price < user.budget.min or art.price > user.budget.max:
        return -100
    else:
        score += 5

    area = art.size.width * art.size.height

    if user.space == "bedroom" and area <= 5000:
        score += 2
    elif user.space == "living_room" and area >= 5000:
        score += 2

    return score
