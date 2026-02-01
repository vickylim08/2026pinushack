from pydantic import BaseModel
from typing import List

class Budget(BaseModel):
    min: float
    max: float

class UserProfile(BaseModel):
    style: List[str]
    mood: List[str]
    colors: List[str]
    themes: List[str]
    budget: Budget
    space: str  # bedroom | living_room | study
