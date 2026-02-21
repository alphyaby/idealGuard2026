# models.py
from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from database import Base


class System(Base):
    __tablename__ = "systems"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="Idle Guardian Core")
    idle_ticks = Column(Integer, default=0)
    last_active = Column(DateTime, default=datetime.utcnow)


class ActionLog(Base):
    __tablename__ = "action_logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class AIThought(Base):
    __tablename__ = "ai_thoughts"

    id = Column(Integer, primary_key=True, index=True)
    thought = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)