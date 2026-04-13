from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from contextlib import asynccontextmanager
import database
import models
import seed_data

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-seed the database with default user on every startup
    seed_data.seed()
    yield

app = FastAPI(title="Hexora A&A Business Decision System API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user_id(x_user_id: str = Header(None)):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        return int(x_user_id)
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.post("/login", response_model=models.Token)
def login(creds: models.UserLogin, db: Session = Depends(get_db)):
    user = db.query(database.User).filter_by(username=creds.username, password=creds.password).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    # For MVP we are giving the user ID out as the secure bearer token
    return {"access_token": str(user.id), "token_type": "bearer"}

@app.get("/")
def read_root():
    return {"status": "System Online", "version": "1.1"}

@app.get("/accounts", response_model=List[models.CustomerResponse])
def get_accounts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    customers = db.query(database.Customer).filter_by(owner_id=user_id).offset(skip).limit(limit).all()
    return customers

@app.get("/analytics")
def get_analytics(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    customers = db.query(database.Customer).filter_by(owner_id=user_id).all()
    customer_ids = [c.id for c in customers]
    
    transactions = db.query(database.Transaction).filter(database.Transaction.customer_id.in_(customer_ids)).all()
    
    total_sales = len([t for t in transactions if t.type == "purchase"])
    revenue = sum(t.amount for t in transactions if t.type == "purchase")
    
    return {
        "total_sales": total_sales,
        "revenue": revenue,
        "active_alerts": [
            {"id": 1, "type": "warning", "message": f"Notice: One of your {len(customers)} clients shows declining engagement."},
            {"id": 2, "type": "info", "message": "Suggest offering a personalized retention discount."}
        ]
    }
