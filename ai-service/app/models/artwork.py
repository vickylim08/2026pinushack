from pydantic import BaseModel
from typing import List

class Size(BaseModel):
    width: float
    height: float
    unit: str  # "cm"

class Artwork(BaseModel):
    id: str
    title: str
    artistName: str
    year: int
    price: float
    currency: str
    size: Size
    tags: List[str]
    story: str
    imageUrl: str
    audioStoryUrl: str
