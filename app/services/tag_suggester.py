import os, json
import requests
from typing import Dict, Any

from dotenv import load_dotenv
load_dotenv()

from app.models.tag_models import STYLE_TAGS, MOOD_TAGS, COLOR_TAGS, THEME_TAGS, SPACE_TAGS

def _extract_json(text: str) -> dict:
    text = text.strip()
    if text.startswith("{") and text.endswith("}"):
        return json.loads(text)
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        return json.loads(text[start:end+1])
    raise ValueError("Model did not return valid JSON")

def _fetch_image_bytes(image_url: str, max_bytes: int = 8_000_000) -> bytes:
    # Basic safety: size limit + timeout
    resp = requests.get(image_url, timeout=10)
    resp.raise_for_status()
    data = resp.content
    if len(data) > max_bytes:
        raise ValueError("Image too large")
    return data

def suggest_tags_from_image(payload: Dict[str, Any]) -> Dict[str, Any]:
    # Use Featherless (Text-only for now)
    api_key = os.getenv("FEATHERLESS_API_KEY")
    if not api_key:
        raise RuntimeError("Missing FEATHERLESS_API_KEY")

    title = payload.get("title", "")
    story = payload.get("story", "") or ""
    medium = payload.get("medium")
    year = payload.get("year")
    size = payload.get("size") or {}
    
    # NOTE: Qwen/Qwen3-0.6B is text-only, so we ignore imageUrl/base64 for now.
    # We will generate tags based on the metadata.

    size_str = ""
    if isinstance(size, dict) and "width" in size and "height" in size:
        size_str = f'{size.get("width")}×{size.get("height")}{size.get("unit","")}'

    prompt_text = f"""
You are helping an ARTIST list a physical artwork.
Generate relevant tags based on the description below.

Artwork Info:
- Title: {title}
- Year: {year}
- Medium: {medium}
- Size: {size_str}
- Story/Description: {story}

Allowed tags (choose ONLY from these lists):
- Style: {STYLE_TAGS}
- Mood: {MOOD_TAGS}
- Colors: {COLOR_TAGS}
- Themes: {THEME_TAGS}
- Space: {SPACE_TAGS}

Return STRICT JSON only:
{{
  "style": ["1-3 tags"],
  "mood": ["1-3 tags"],
  "colors": ["1-3 tags (infer from medium/title if possible)"],
  "themes": ["1-3 tags"],
  "space": ["1-3 tags"],
  "explanation": "1 short sentence explaining why."
}}

Rules:
- Do not make up random things, stick to the vibe of the title/story.
- If story is empty, infer from title and medium.
"""

    # Featherless client
    from openai import OpenAI
    client = OpenAI(
        base_url="https://api.featherless.ai/v1",
        api_key=api_key
    )

    try:
        resp = client.chat.completions.create(
            model="Qwen/Qwen3-0.6B",
            messages=[
                {"role": "system", "content": "You are a helpful tagging assistant. Output valid JSON."},
                {"role": "user", "content": prompt_text}
            ],
            temperature=0.3,
        )
        out_text = resp.choices[0].message.content
        result = _extract_json(out_text)
    except Exception as e:
        print(f"Tag Suggestion Error: {e}")
        # Return empty structure on failure
        return {
            "style": [], "mood": [], "colors": [], "themes": [], "space": [],
            "explanation": "Could not generate tags (AI Error)."
        }

    # Basic validation
    for k in ["style", "mood", "colors", "themes", "space"]:
        if k not in result or not isinstance(result[k], list):
            result[k] = []
    if "explanation" not in result:
        result["explanation"] = "Generated from metadata."

    return result
