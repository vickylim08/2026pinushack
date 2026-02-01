from pydantic import BaseModel
from typing import List, Dict

class ExplainOutput(BaseModel):
    summary: str
    bullets: List[str]
    placement: str
    buyer_questions: List[str]

class CompareDifference(BaseModel):
    aspect: str
    A: str
    B: str

class CompareOutput(BaseModel):
    verdict: str  # "A" | "B" | "depends"
    why: str
    differences: List[CompareDifference]
    confidence_tip: str
