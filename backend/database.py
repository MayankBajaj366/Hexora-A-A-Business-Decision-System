from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from datetime import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///./business.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    
    customers = relationship("Customer", back_populates="owner")

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    relationship_score = Column(Float, default=50.0) # 0 to 100
    
    owner = relationship("User", back_populates="customers")
    transactions = relationship("Transaction", back_populates="customer")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    amount = Column(Float)
    type = Column(String) # "purchase" or "refund"
    date = Column(DateTime, default=datetime.utcnow)
    
    customer = relationship("Customer", back_populates="transactions")

# Create tables
Base.metadata.create_all(bind=engine)
