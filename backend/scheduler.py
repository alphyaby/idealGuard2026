import asyncio
from database import SessionLocal
from ai_engine import ai_tick


async def ai_scheduler():
    while True:
        db = SessionLocal()
        ai_tick(db)
        db.close()
        await asyncio.sleep(5)