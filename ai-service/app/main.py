from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.routes.recommend import router as recommend_router
from app.routes.explain import router as explain_router
from app.routes.compare import router as compare_router
from app.routes.tts import router as tts_router
from app.routes.suggest_tags import router as suggest_tags_router
from app.routes.buyer_session import router as buyer_session_router  # NEW

app = FastAPI(title="MyArtWorld AI Service")

@app.get("/")
def root():
    return {"message": "AI Service is Running"}

# Enable CORS for Frontend
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # DEBUG: Allow all origins to fix CORS error
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.include_router(recommend_router)
app.include_router(explain_router)
app.include_router(compare_router)
app.include_router(tts_router)
app.include_router(suggest_tags_router)
app.include_router(buyer_session_router)

from app.routes.upload import router as upload_router
app.include_router(upload_router)
