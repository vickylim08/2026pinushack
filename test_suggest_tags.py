import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_suggest_tags():
    print("\n[TEST] Testing /ai/suggest-tags...")
    payload = {
        "title": "Sunset over the ocean",
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Anatomy_of_a_Sunset-2.jpg/1200px-Anatomy_of_a_Sunset-2.jpg",
        "medium": "Oil",
        "size": {"width": 100, "height": 80, "unit": "cm"}
    }
    try:
        resp = requests.post(f"{BASE_URL}/ai/suggest-tags", json=payload)
        print(f"Status: {resp.status_code}")
        if resp.status_code == 200:
            print("Response:", json.dumps(resp.json(), indent=2))
        else:
            print("Error:", resp.text)
    except Exception as e:
        print("Exception:", e)

if __name__ == "__main__":
    test_suggest_tags()
