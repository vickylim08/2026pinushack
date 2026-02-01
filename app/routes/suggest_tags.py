from fastapi import APIRouter
from app.models.tag_models import TagSuggestRequest
from app.services.tag_suggester import suggest_tags_from_image

router = APIRouter()

@router.post("/ai/suggest-tags")
def ai_suggest_tags(payload: TagSuggestRequest):
    return suggest_tags_from_image(payload.model_dump())
