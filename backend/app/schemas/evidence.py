from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List

class EvidenceBase(BaseModel):
    title: str
    journal: str
    year: int
    authors: str
    summary: str
    conclusion: str
    keywords: str

class EvidenceCreate(EvidenceBase):
    pass

class EvidenceResponse(EvidenceBase):
    id: str
    url: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
