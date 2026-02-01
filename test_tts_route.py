import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_tts():
    print("\n[TEST] Testing /tts/story...")
    payload = {
        "text": "This is a test story for the AI exhibition.",
        "voice": "alloy",
        "speed": 1.0
    }
    try:
        resp = requests.post(f"{BASE_URL}/tts/story", json=payload)
        print(f"Status: {resp.status_code}")
        if resp.status_code == 200:
            print("Response:", json.dumps(resp.json(), indent=2))
        else:
            print("Error:", resp.text)
    except Exception as e:
        print("Exception:", e)

if __name__ == "__main__":
    test_tts()
