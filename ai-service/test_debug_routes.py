import requests
import json
import random

BASE_URL = "http://127.0.0.1:8000"

user_profile = {
    "style": ["Modern", "Minimalist"],
    "mood": ["Calm"],
    "colors": ["Black", "White"],
    "themes": ["Architecture"],
    "budget": {"min": 100, "max": 1000},
    "space": "office"
}

artA = {
    "id": "a1",
    "title": "Minimalist Lines",
    "artistName": "Line Master",
    "year": 2024,
    "price": 500,
    "currency": "USD",
    "size": {"width": 100, "height": 100, "unit": "cm"},
    "tags": ["Minimalist", "Black", "White"],
    "story": "A study of simple lines.",
    "imageUrl": "http://example.com/a.jpg",
    "audioStoryUrl": ""
}

artB = {
    "id": "b1",
    "title": "Chaos Theory",
    "artistName": "Color Kid",
    "year": 2023,
    "price": 800,
    "currency": "USD",
    "size": {"width": 120, "height": 80, "unit": "cm"},
    "tags": ["Abstract", "Colorful"],
    "story": "Explosion of color.",
    "imageUrl": "http://example.com/b.jpg",
    "audioStoryUrl": ""
}

def test_explain():
    print("\n[TEST] Testing /ai/explain...")
    payload = {
        "userProfile": user_profile,
        "artwork": artA
    }
    try:
        resp = requests.post(f"{BASE_URL}/ai/explain", json=payload)
        print(f"Status: {resp.status_code}")
        if resp.status_code == 200:
            print("Response:", json.dumps(resp.json(), indent=2))
        else:
            print("Error:", resp.text)
    except Exception as e:
        print("Exception:", e)

def test_compare():
    print("\n[TEST] Testing /ai/compare...")
    payload = {
        "userProfile": user_profile,
        "artA": artA,
        "artB": artB
    }
    try:
        resp = requests.post(f"{BASE_URL}/ai/compare", json=payload)
        print(f"Status: {resp.status_code}")
        if resp.status_code == 200:
            print("Response:", json.dumps(resp.json(), indent=2))
        else:
            print("Error:", resp.text)
    except Exception as e:
        print("Exception:", e)

if __name__ == "__main__":
    test_explain()
    test_compare()
