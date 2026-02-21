from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from database import Base

class System(Base):
    __tablename__ = "systems"

    id = Column(String, primary_key=True)
    lab = Column(String)
    type = Column(String)  # PC | SERVER
    cpu = Column(Float, default=0)
    network = Column(Float, default=0)
    state = Column(String, default="ACTIVE")
    hourly_cost = Column(Float, default=6.5)
    idle_ticks = Column(Integer, default=0)

class ActionLog(Base):
    __tablename__ = "action_log"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    system_id = Column(String)
    action = Column(String)
    trigger = Column(String)
    savings_rupees = Column(Float)