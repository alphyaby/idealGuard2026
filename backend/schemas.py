from pydantic import BaseModel
from datetime import datetime

class SystemOut(BaseModel):
    id: str
    lab: str
    type: str
    cpu: float
    network: float
    state: str
    hourly_cost: float

    class Config:
        orm_mode = True

class ActionLogOut(BaseModel):
    timestamp: datetime
    system_id: str
    action: str
    trigger: str
    savings_rupees: float

    class Config:
        orm_mode = True