import random
from sqlalchemy.orm import Session
from models import System, ActionLog, AIThought


def ai_tick(db: Session):
    systems = db.query(System).all()

    for sys in systems:
        if sys.state == "AUTO_SHUTDOWN":
            continue

        sys.cpu = random.uniform(0, 100)
        sys.network = random.uniform(0, 50)

        if sys.type == "PC":
            idle = sys.cpu < 10
            threshold = 3
        else:
            idle = sys.cpu < 5 and sys.network < 10
            threshold = 5

        if idle:
            sys.idle_ticks += 1
            db.add(AIThought(
                system_id=sys.id,
                thought=f"CPU at {sys.cpu:.1f}%. System appears idle.",
                decision="MONITOR"
            ))
        else:
            sys.idle_ticks = 0
            db.add(AIThought(
                system_id=sys.id,
                thought=f"Activity detected (CPU {sys.cpu:.1f}%). Keeping active.",
                decision="KEEP_RUNNING"
            ))

        if sys.idle_ticks >= threshold:
            sys.state = "AUTO_SHUTDOWN"

            db.add(AIThought(
                system_id=sys.id,
                thought=f"Idle for {sys.idle_ticks} cycles. Auto shutdown for cost saving.",
                decision="AUTO_SHUTDOWN"
            ))

            db.add(ActionLog(
                system_id=sys.id,
                action="AUTO_SHUTDOWN",
                trigger="AI",
                savings_rupees=sys.hourly_cost * 12
            ))

    db.commit()