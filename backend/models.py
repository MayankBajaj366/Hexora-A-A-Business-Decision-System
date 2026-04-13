from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

# --- Auth Models ---
class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# --- Transaction Models ---
class TransactionBase(BaseModel):
    amount: float
    type: str

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: int
    customer_id: int
    date: datetime

    model_config = ConfigDict(from_attributes=True)

# --- Customer Models ---
class CustomerBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    relationship_score: float = 50.0

class CustomerCreate(CustomerBase):
    pass

class CustomerResponse(CustomerBase):
    id: int
    owner_id: int
    transactions: List[TransactionResponse] = []

    model_config = ConfigDict(from_attributes=True)
