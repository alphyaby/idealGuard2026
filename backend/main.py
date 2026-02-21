from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, System, ActionLog
from schemas import SystemOut, ActionLogOut
from scheduler import ai_scheduler
import asyncio

# ------------------ DB INIT ------------------
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Idle Guard Backend")

# ------------------ CORS ------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ DB DEP ------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ------------------ STARTUP ------------------
@app.on_event("startup")
async def startup():
    seed_data()
    asyncio.create_task(ai_scheduler())

# ------------------ SEED DATA ------------------
def seed_data():
    db = SessionLocal()
    try:
        if db.query(System).first():
            return

        labs = [
            "Systems Lab", "CCF Lab", "OS Lab", "CSE Lab",
            "ASAP Lab", "Seminar Hall",
            "Programming Lab 1", "Programming Lab 2",
            "OS Lab 2", "EC Lab"
        ]

        for lab in labs:
            for i in range(1, 6):
                db.add(System(
                    id=f"{lab}-PC-{i}",
                    lab=lab,
                    type="PC"
                ))
            db.add(System(
                id=f"{lab}-SERVER",
                lab=lab,
                type="SERVER",
                hourly_cost=20
            ))

        db.commit()
    finally:
        db.close()

# ------------------ ROUTES ------------------
@app.get("/api/systems", response_model=list[SystemOut])
def get_systems(db: Session = Depends(get_db)):
    return db.query(System).all()

@app.get("/api/idle", response_model=list[SystemOut])
def idle_systems(db: Session = Depends(get_db)):
    return db.query(System).filter(System.cpu < 10).all()

@app.post("/api/systems/{system_id}/power")
def power_control(system_id: str, action: str, db: Session = Depends(get_db)):
    sys = db.get(System, system_id)
    if not sys:
        return {"error": "System not found"}

    sys.state = "ACTIVE" if action == "start" else "AUTO_SHUTDOWN"

    db.add(ActionLog(
        system_id=system_id,
        action=action.upper(),
        trigger="MANUAL",
        savings_rupees=0
    ))
    db.commit()

    return {"status": "ok"}

@app.get("/api/action-log", response_model=list[ActionLogOut])
def get_logs(db: Session = Depends(get_db)):
    return db.query(ActionLog).order_by(ActionLog.timestamp.desc()).all()