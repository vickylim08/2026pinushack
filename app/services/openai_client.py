import os, json
from dotenv import load_dotenv

load_dotenv()

def extract_json(text: str) -> dict:
    """
    Hackathon-safe JSON extractor:
    - expects the model to return JSON only
    - if it returns extra text, attempts to slice the first {...} block
    - handles markdown code blocks e.g. ```json ... ```
    """
    text = text.strip()
    
    # Try direct parse
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Try regex for markdown code blocks
    import re
    match = re.search(r"```(?:json)?\s*(.*?)\s*```", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            pass

    # Try finding first { and last }
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        try:
            return json.loads(text[start:end+1])
        except json.JSONDecodeError:
            pass

    # Log the failure for debugging
    print(f"FAILED TO PARSE JSON. Content received:\n{text}")
    raise ValueError("Model did not return valid JSON")

def call_llm_json(prompt: str) -> dict:
    """
    Uses OpenAI Chat Completions for simplicity in hackathons.
    NOTE: Keep it server-side only.
    """
    from openai import OpenAI
    
    api_key = os.getenv("FEATHERLESS_API_KEY")
    if not api_key:
        raise RuntimeError("Missing FEATHERLESS_API_KEY in environment")

    client = OpenAI(
        base_url="https://api.featherless.ai/v1",
        api_key=api_key
    )

    try:
        resp = client.chat.completions.create(
            model="Qwen/Qwen3-0.6B",
            messages=[
                {"role": "system", "content": "You must output STRICT JSON only. No extra text."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.4,
        )
        text = resp.choices[0].message.content
        return extract_json(text)
    except Exception as e:
        print(f"ERROR in call_llm_json: {e}")
        import traceback
        traceback.print_exc()
        raise
