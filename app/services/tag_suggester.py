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
    api_key = os.getenv("FEATHERLESS_API_KEY")
    if not api_key:
        raise RuntimeError("Missing FEATHERLESS_API_KEY")

    title = payload.get("title", "")
    story = payload.get("story", "") or ""
    medium = payload.get("medium")
    year = payload.get("year")
    size = payload.get("size") or {}

    size_str = ""
    if isinstance(size, dict) and "width" in size and "height" in size:
        size_str = f'{size.get("width")}×{size.get("height")}{size.get("unit","")}'

    prompt_text = f"""
You are a Metadata Standardization Assistant.
Your job is to classify this artwork into our database's STRICT taxonomy.

Artwork Info:
- Title: {title}
- Year: {year}
- Medium: {medium}
- Size: {size_str}
- Story/Description: {story}

DATABASE TAXONOMY (You command STRICTLY select from these lists):
- Style Options: {json.dumps(STYLE_TAGS)}
- Mood Options: {json.dumps(MOOD_TAGS)}
- Color Options: {json.dumps(COLOR_TAGS)}
- Theme Options: {json.dumps(THEME_TAGS)}
- Space Options: {json.dumps(SPACE_TAGS)}

Instructions:
1. Analyze the artwork info.
2. Select the most relevant tags from the lists above.
3. DO NOT invent new tags. If "Ocean" is not in the list, look for "Nature" or similar.
4. If no tag fits perfectly, pick the closest one.

Return STRICT JSON:
{{
  "style": ["..."],
  "mood": ["..."],
  "colors": ["..."],
  "themes": ["..."],
  "space": ["..."],
  "explanation": "Why these standard tags match."
}}
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
                {"role": "system", "content": "You are a strict data classifier. Output valid JSON."},
                {"role": "user", "content": prompt_text}
            ],
            temperature=0.1,  # Lower temperature for stricter adherence
        )
        out_text = resp.choices[0].message.content
        result = _extract_json(out_text)
    except Exception as e:
        print(f"Tag Suggestion Error: {e}")
        return {
            "style": [], "mood": [], "colors": [], "themes": [], "space": [],
            "explanation": "Could not generate tags (AI Error)."
        }

    # STRICT VALIDATION: Filter out any hallucinated tags
    def filter_tags(generated_list, allowed_list):
        if not isinstance(generated_list, list):
            return []
        # Case-insensitive match, return the official casing
        allowed_lower = {t.lower(): t for t in allowed_list}
        valid = []
        for item in generated_list:
            if isinstance(item, str) and item.lower() in allowed_lower:
                valid.append(allowed_lower[item.lower()])
        return valid

    result["style"] = filter_tags(result.get("style"), STYLE_TAGS)
    result["mood"] = filter_tags(result.get("mood"), MOOD_TAGS)
    result["colors"] = filter_tags(result.get("colors"), COLOR_TAGS)
    result["themes"] = filter_tags(result.get("themes"), THEME_TAGS)
    result["space"] = filter_tags(result.get("space"), SPACE_TAGS)

    if "explanation" not in result:
        result["explanation"] = "Mapped to database standards."

    return result
