from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from datetime import datetime
import random
import time

from database import engine, SessionLocal
from models import Base, System, ActionLog, AIThought
from schemas import SystemOut, ActionLogOut, AIThoughtOut

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Idle Guardian AI",
    description="Live AI Decision Feed – System Idle Optimization",
    version="1.0.0"
)


# -------------------- DB Dependency --------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------- ROOT --------------------
@app.get("/")
def root():
    return {
        "status": "Idle Guardian AI is awake",
        "mode": "observing systems",
        "timestamp": datetime.utcnow()
    }


# -------------------- SYSTEM STATUS --------------------
@app.get("/api/system", response_model=SystemOut)
def get_system(db: Session = Depends(get_db)):
    system = db.query(System).first()

    if not system:
        system = System(
            name="Lab-PC-01",
            idle_ticks=0,
            last_active=datetime.utcnow()
        )
        db.add(system)
        db.commit()
        db.refresh(system)

    return system


# -------------------- ACTION LOGS --------------------
@app.get("/api/actions", response_model=list[ActionLogOut])
def get_actions(db: Session = Depends(get_db)):
    return (
        db.query(ActionLog)
        .order_by(ActionLog.created_at.desc())
        .limit(20)
        .all()
    )


# -------------------- AI THOUGHTS --------------------
@app.get("/api/ai-thoughts", response_model=list[AIThoughtOut])
def get_ai_thoughts(db: Session = Depends(get_db)):
    return (
        db.query(AIThought)
        .order_by(AIThought.created_at.desc())
        .limit(20)
        .all()
    )


# -------------------- LIVE AI DECISION FEED --------------------
@app.post("/api/ai/think")
def ai_think(db: Session = Depends(get_db)):
    thoughts_pool = [
        "CPU usage stable. No action required.",
        "System idle detected. Monitoring closely.",
        "Idle threshold approaching. Preparing optimization.",
        "User inactivity confirmed.",
        "Power-saving action recommended.",
        "System efficiency optimal.",
        "Energy waste minimized.",
        "Learning usage patterns.",
        "Predicting extended idle window.",
        "Decision confidence: HIGH"
    ]

    decision = random.choice(thoughts_pool)

    # Save AI Thought
    thought = AIThought(thought=decision)
    db.add(thought)

    # Optional: log an action when idle-related
    if "idle" in decision.lower() or "power" in decision.lower():
        action = ActionLog(action="AI evaluated idle state")
        db.add(action)

    db.commit()

    return {
        "ai_thought": decision,
        "confidence": f"{random.randint(85, 99)}%",
        "timestamp": datetime.utcnow()
    }


# -------------------- SIMULATED HEARTBEAT --------------------
@app.get("/api/ai/heartbeat")
def ai_heartbeat():
    time.sleep(0.5)
    return {
        "ai_state": "thinking",
        "pulse": "steady",
        "timestamp": datetime.utcnow()
    }