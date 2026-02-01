from typing import List, Dict
from app.models.artwork import Artwork
from app.models.user_profile import UserProfile
from app.services.openai_client import call_llm_json

def ai_curate_top_4(user: UserProfile, candidates: List[Artwork]) -> Dict:
    # Keep candidate details compact
    simplified = []
    for a in candidates:
        simplified.append({
            "id": a.id,
            "title": a.title,
            "artistName": a.artistName,
            "year": a.year,
            "price": a.price,
            "currency": a.currency,
            "size": f"{a.size.width}×{a.size.height}{a.size.unit}",
            "tags": a.tags,
            "story": (a.story or "")[:220]
        })

    prompt = f"""
You are a digital curator for a PHYSICAL art marketplace.
Select the best 4 artworks for the user and explain WHY in a warm, friendly, and enthusiastic tone.

User profile:
- style: {user.style}
- mood: {user.mood}
- colors: {user.colors}
- themes: {user.themes}
- budget: {user.budget.min} to {user.budget.max}
- space: {user.space}

Candidate artworks (already filtered and relevant):
{simplified}

Return STRICT JSON only:
{{
  "top_artwork_ids": ["id1","id2","id3","id4"],
  "reasons": {{
    "id1": ["reason1","reason2","reason3"]
  }},
  "curator_welcome": "1 warm and welcoming sentence"
}}

Rules:
- Do not invent facts beyond provided data.
- Tone: Friendly, approachable, and encouraging (like a helpful friend).
- Do not mention investment returns.
- Use size/space as a real factor where appropriate.
- If fewer than 4 candidates exist, return as many as possible.
"""
    return call_llm_json(prompt)
