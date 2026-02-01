from app.models.artwork import Artwork
from app.models.user_profile import UserProfile
from app.services.openai_client import call_llm_json

def explain_artwork(user: UserProfile, art: Artwork) -> dict:
    size_str = f'{art.size.width}×{art.size.height}{art.size.unit}'
    prompt = f"""
You are an art curator + buying decision assistant for a PHYSICAL art marketplace.
Your job: give the buyer confidence without making fake claims.

User preferences:
- style: {user.style}
- mood: {user.mood}
- colors: {user.colors}
- themes: {user.themes}
- budget: {user.budget.min} to {user.budget.max}
- space: {user.space}

Artwork:
- id: {art.id}
- title: {art.title}
- artist: {art.artistName}
- year: {art.year}
- price: {art.price} {art.currency}
- size: {size_str}
- tags: {art.tags}
- story: {art.story}

Return STRICT JSON only in this format:
{{
  "summary": "1 short persuasive paragraph, not salesy",
  "bullets": ["3 concise reasons tied to user prefs, size/space, and story/tags"],
  "placement": "1 line placement suggestion using size + space",
  "buyer_questions": ["2-3 practical questions for physical purchase (framing/shipping/care)"]
}}

Rules:
- Do not invent details not provided
- Do not mention investment returns
- Keep the tone supportive, curator-like
"""
    return call_llm_json(prompt)

def compare_artworks(user: UserProfile, artA: Artwork, artB: Artwork) -> dict:
    size_A = f'{artA.size.width}×{artA.size.height}{artA.size.unit}'
    size_B = f'{artB.size.width}×{artB.size.height}{artB.size.unit}'
    
    prompt = f"""
You are a helpful art advisor helping a buyer choose between two pieces.
Be balanced, objective, but help them reach a conclusion based on their preferences.

User Profile:
- style: {user.style}
- mood: {user.mood}
- colors: {user.colors}
- themes: {user.themes}
- budget: {user.budget.min}-{user.budget.max}
- space: {user.space}

Option A:
- Title: {artA.title}
- Artist: {artA.artistName}
- Price: {artA.price}
- Size: {size_A}
- Tags: {artA.tags}
- Story: {artA.story}

Option B:
- Title: {artB.title}
- Artist: {artB.artistName}
- Price: {artB.price}
- Size: {size_B}
- Tags: {artB.tags}
- Story: {artB.story}

Return STRICT JSON in this format:
{{
  "verdict": "A" or "B" or "depends",
  "why": "1 sentence summary of the recommendation",
  "differences": [
    {{ "aspect": "Price", "A": "Higher ($500)", "B": "Lower ($300)" }},
    {{ "aspect": "Mood", "A": "...", "B": "..." }}
  ],
  "confidence_tip": "A closing tip to help them decide (e.g. 'If your room is dark, go with B')"
}}
    """
    return call_llm_json(prompt)
