# schemas.py
from pydantic import BaseModel
from datetime import datetime


class SystemOut(BaseModel):
    id: int
    name: str
    idle_ticks: int
    last_active: datetime

    model_config = {"from_attributes": True}


class ActionLogOut(BaseModel):
    id: int
    action: str
    created_at: datetime

    model_config = {"from_attributes": True}


class AIThoughtOut(BaseModel):
    id: int
    thought: str
    created_at: datetime

    model_config = {"from_attributes": True}