import random
from sqlalchemy.orm import Session
from models import System, ActionLog

def ai_tick(db: Session):
    systems = db.query(System).all()

    for sys in systems:
        if sys.state == "AUTO_SHUTDOWN":
            continue

        sys.cpu = random.uniform(0, 100)
        sys.network = random.uniform(0, 50)

        idle = False

        if sys.type == "PC":
            idle = sys.cpu < 10
            threshold = 3
        else:
            idle = sys.cpu < 5 and sys.network < 10
            threshold = 5

        if idle:
            sys.idle_ticks += 1
        else:
            sys.idle_ticks = 0

        if sys.idle_ticks >= threshold:
            sys.state = "AUTO_SHUTDOWN"
            log = ActionLog(
                system_id=sys.id,
                action="AUTO_SHUTDOWN",
                trigger="AI",
                savings_rupees=sys.hourly_cost * 12
            )
            db.add(log)

    db.commit()