from fastapi import APIRouter
from typing import Dict, Any, List

from app.models.user_profile import UserProfile
from app.models.artwork import Artwork

from app.services.recommendation import rank_artworks
from app.services.ai_curation import ai_curate_top_4
from app.services.cache import make_cache_key, cache_get, cache_set

# Optional: if you want to pre-generate audio for curator welcome
from app.services.tts_service import synthesize_story_to_mp3

router = APIRouter()

@router.post("/ai/buyer-session")
def buyer_session(payload: Dict[str, Any]):
    """
    Input:
      {
        "userProfile": {...},
        "artworks": [...],
        "options": { "use_ai": true, "pre_tts": false }
      }

    Output:
      {
        "sessionKey": "...",
        "recommendedArtworks": ["id1","id2","id3","id4"],
        "curator_welcome": "...",
        "reasons": { "id1": ["..."] },
        "audio": { "curator_welcome_url": "/static/tts/..." }   # optional
      }
    """
    options = payload.get("options", {}) or {}
    use_ai = bool(options.get("use_ai", True))
    pre_tts = bool(options.get("pre_tts", False))

    user = UserProfile(**payload["userProfile"])
    artworks = [Artwork(**a) for a in payload["artworks"]]

    # ---- Cache key should depend on user profile + artworks "fingerprint" ----
    # To keep hash stable but not huge, we only include essential art fields.
    art_fingerprint = [{
        "id": a.id,
        "price": a.price,
        "currency": a.currency,
        "year": a.year,
        "size": {"w": a.size.width, "h": a.size.height, "u": a.size.unit},
        "tags": sorted(a.tags),
        # story affects curator reasoning; include a small prefix to avoid huge keys
        "story": (a.story or "")[:120]
    } for a in artworks]

    cache_payload = {
        "userProfile": user.model_dump(),
        "artFingerprint": art_fingerprint,
        "use_ai": use_ai,
        "pre_tts": pre_tts
    }
    key = make_cache_key("buyer_session", cache_payload)

    cached = cache_get(key, ttl_seconds=60 * 60 * 6)  # 6 hours
    if cached:
        cached["sessionKey"] = key
        return cached

    # ---- Retrieval layer (deterministic shortlist) ----
    ranked = rank_artworks(artworks, user)
    candidates = [item["artwork"] for item in ranked[:20]]

    # fallback deterministic top 4 ids
    fallback_ids = [c.id for c in candidates[:4]]

    result = {
        "recommendedArtworks": fallback_ids,
        "curator_welcome": "Here are artworks selected based on your preferences.",
        "reasons": {aid: ["Matches your preferences."] for aid in fallback_ids},
        "audio": {}
    }

    # ---- AI curation layer ----
    if use_ai and candidates:
        try:
            ai = ai_curate_top_4(user, candidates)

            top_ids = ai.get("top_artwork_ids") or []
            # Ensure ids are valid and exist in candidates
            candidate_ids = {c.id for c in candidates}
            top_ids = [i for i in top_ids if i in candidate_ids]

            if len(top_ids) == 0:
                top_ids = fallback_ids

            result["recommendedArtworks"] = top_ids
            result["curator_welcome"] = ai.get("curator_welcome") or result["curator_welcome"]
            result["reasons"] = ai.get("reasons") or result["reasons"]

        except Exception:
            # keep fallback
            pass

    # ---- Optional: pre-generate TTS for curator welcome (demo wow) ----
    if pre_tts:
        try:
            rel = synthesize_story_to_mp3(result["curator_welcome"], voice="alloy", speed=1.0)
            result["audio"]["curator_welcome_url"] = f"/static/{rel}"
        except Exception:
            result["audio"]["curator_welcome_url"] = None

    # Cache it
    cache_set(key, result)

    # Attach session key
    result["sessionKey"] = key
    return result
