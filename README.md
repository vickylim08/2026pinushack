# MUSE - AI-Powered Virtual Art Gallery

**MUSE** is an immersive 3D immersive art gallery experience powered by generative AI. It allows users to explore a virtual museum, upload their own physical artworks, and interact with an "AI Buddy" curator that provides personalized art tours, storytelling, and advice.

## 🌟 Key Features

*   **Virtual 3D Gallery:** Walk through a realistic, procedurally generated 3D gallery using First-Person controls (WASD). built with React Three Fiber.
*   **AI Curator Buddy:** A conversational AI (powered by LLMs) that acts as your personal museum guide, explaining artworks and offering buying advice based on your preferences.
*   **Smart Uploads:** Upload your own art (images) and get automatic AI-generated tags (Style, Mood, Theme) for better discoverability.
*   **Real-time Persistence:** Artworks are stored in a database (Firebase Firestore) and persist across sessions.
*   **Local & Cloud Storage:** Supports hybrid storage for art images (currently configured for Local Storage for ease of development).

## 🛠️ Technology Stack

### Frontend
*   **React 19** (Vite)
*   **Three.js / React Three Fiber** (3D Rendering)
*   **Zustand** (State Management)
*   **Framer Motion** (UI Animations)
*   **Firebase SDK** (Auth & Firestore Database)

### Backend (AI Service)
*   **Python 3.10+**
*   **FastAPI** (High-performance API)
*   **Featherless.ai / OpenAI** (LLM Integration)
*   **Uvicorn** (ASGI Server)

---

## 🚀 Getting Started

### Prerequisites
*   **Node.js** (v18+)
*   **Python** (v3.10+)
*   **Google Firebase Account** (for Firestore)

### 1. Setup the Backend (AI Service)

The backend handles AI processing, tagging, and local file storage.

```bash
# Navigate to the service directory
cd ai-service

# Create a virtual environment
python -m venv venv

# Activate it
# Windows:
..\venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create the .env file
# (Ask the developer for the FEATHERLESS_API_KEY)
```

**Run the Backend:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
*The server will start at `http://localhost:8000`*

### 2. Setup the Frontend

The frontend is the visual 3D experience.

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```
*The app will start at `http://localhost:5173`*

---

## 📂 Project Structure

```text
├── ai-service/             # Python FastAPI Backend
│   ├── app/
│   │   ├── main.py         # Entry point & CORS config
│   │   ├── routes/         # API Endpoints (explain, upload, tags)
│   │   ├── services/       # AI Logic (LLM calls)
│   │   └── static/uploads/ # Local image storage
│
├── frontend/               # React Application
│   ├── src/
│   │   ├── canvas/         # 3D Scene Components (GalleryScene.jsx)
│   │   ├── pages/          # UI Pages (Gallery.jsx, Upload.jsx)
│   │   ├── services/       # API Integration (api.js)
│   │   ├── store/          # Global State (useStore.js)
│   │   └── firebase-config.js
```

## ⚠️ Important Notes

### Local Storage Mode
Due to cloud permission restrictions (CORS) on Google Cloud Storage, this project is currently configured to use **Local Storage** for image uploads.
*   Images are saved to `ai-service/app/static/uploads`.
*   They are served via the Python backend (`localhost:8000`).
*   **Do not stop the Python backend**, or images in the gallery will not load.

### Firebase
The project utilizes Firebase **Firestore** for storing metadata (titles, descriptions, prices) and **Anonymous Auth** for security. Ensure your `firebase-config.js` is correctly set up.
