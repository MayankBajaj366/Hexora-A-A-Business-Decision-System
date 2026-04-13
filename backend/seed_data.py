import database
from datetime import datetime, timedelta
import random

def seed():
    db = database.SessionLocal()
    
    # Create the user "A" with password "A"
    user_a = db.query(database.User).filter_by(username="A").first()
    if not user_a:
        user_a = database.User(username="A", password="A")
        db.add(user_a)
        db.commit()
        db.refresh(user_a)
        print("Created User A.")

    if db.query(database.Customer).count() == 0:
        customers = [
            database.Customer(owner_id=user_a.id, name="ACME Corp", email="contact@acme.com", phone="555-0101", relationship_score=85.0),
            database.Customer(owner_id=user_a.id, name="Global Tech", email="info@globaltech.com", phone="555-0102", relationship_score=60.0),
            database.Customer(owner_id=user_a.id, name="Stark Industries", email="tony@stark.com", phone="555-0103", relationship_score=95.0),
            database.Customer(owner_id=user_a.id, name="Wayne Enterprises", email="bruce@wayne.com", phone="555-0104", relationship_score=40.0),
        ]
        db.add_all(customers)
        db.commit()

        print("Created customers for User A.")
        for c in db.query(database.Customer).all():
            for _ in range(random.randint(2, 6)):
                days_ago = random.randint(1, 90)
                tx = database.Transaction(
                    customer_id=c.id,
                    amount=round(random.uniform(100.0, 5000.0), 2),
                    type="purchase",
                    date=datetime.utcnow() - timedelta(days=days_ago)
                )
                db.add(tx)
        db.commit()
    db.close()

if __name__ == "__main__":
    seed()
    print("Database seeded with sample data.")
