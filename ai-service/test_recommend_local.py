import requests
import json
import random

# Base URL
url = "http://127.0.0.1:8000/ai/recommend"

# Sample User Profile
user_profile = {
    "style": ["Impressionist", "Abstract"],
    "mood": ["Calm", "Serene"],
    "colors": ["Blue", "Green", "Pastel"],
    "themes": ["Nature", "Landscape"],
    "budget": {"min": 500, "max": 5000},
    "space": "living_room"
}

# Generate some dummy artworks
artworks = []
stories = [
    "A calming view of the ocean at sunset.",
    "A vibrant abstract representation of city life.",
    "A quiet forest path in autumn.",
    "A stormy display of raw emotion and power.",
    "A delicate flower blooming in the desert.",
    "A geometric exploration of shapes and shadows.",
    "A portrait of a mysterious stranger.",
    "A surreal dreamscape with floating islands."
]

for i in range(10):
    artworks.append({
        "id": f"art_{i+1}",
        "title": f"Artwork {i+1}",
        "artistName": f"Artist {i+1}",
        "year": 2020 + i % 5,
        "price": random.randint(300, 6000),
        "currency": "USD",
        "size": {
            "width": random.randint(50, 200),
            "height": random.randint(50, 200),
            "unit": "cm"
        },
        "tags": random.sample(["Impressionist", "Abstract", "Nature", "Blue", "Red", "Modern"], 3),
        "story": stories[i % len(stories)],
        "imageUrl": f"http://example.com/art_{i+1}.jpg",
        "audioStoryUrl": f"http://example.com/audio_{i+1}.mp3"
    })

payload = {
    "userProfile": user_profile,
    "artworks": artworks
}

print(f"Sending request to {url} with {len(artworks)} candidate artworks...")
try:
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        print("\nSuccess! Response:")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"\nError {response.status_code}:")
        print(response.text)
except requests.exceptions.ConnectionError:
    print("\nError: Could not connect to server. Is it running on port 8000?")
except Exception as e:
    print(f"\nAn error occurred: {e}")
