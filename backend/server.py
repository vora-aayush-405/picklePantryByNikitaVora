from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import bcrypt


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


class OrderItem(BaseModel):
    name: str
    nameEn: str
    nameGu: str
    quantity: int
    price: int
    total: int


class CustomerInfo(BaseModel):
    name: str
    phone: str
    email: str
    address: str
    pincode: str


class PaymentInfo(BaseModel):
    method: str
    upiTransactionId: str
    amount: int
    status: str
    paymentApp: Optional[str] = None


class PricingInfo(BaseModel):
    subtotal: int
    deliveryCharge: int
    total: int


class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    orderId: str
    receiptId: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    customer: CustomerInfo
    items: List[OrderItem]
    payment: PaymentInfo
    pricing: PricingInfo
    orderStatus: str
    specialInstructions: str


class OrderCreate(BaseModel):
    """
    Shape of the order object sent from the frontend checkout flows.
    Uses a millisecond timestamp from Date.now().
    """

    orderId: str
    receiptId: str
    timestamp: int  # milliseconds since epoch from Date.now()
    customer: CustomerInfo
    items: List[OrderItem]
    payment: PaymentInfo
    pricing: PricingInfo
    orderStatus: str
    specialInstructions: str


class AdminUser(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    passwordHash: str
    role: str = "admin"
    active: bool = True
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AdminLoginInput(BaseModel):
    username: str
    password: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


@api_router.post("/orders", response_model=Order)
async def create_order(order_input: OrderCreate):
    """
    Store a full order/receipt document in MongoDB.
    The frontend sends a millisecond timestamp; we normalize it to UTC datetime.
    """
    # Convert ms timestamp from frontend into a timezone-aware datetime
    try:
        timestamp_dt = datetime.fromtimestamp(order_input.timestamp / 1000, tz=timezone.utc)
    except Exception:
        timestamp_dt = datetime.now(timezone.utc)

    order_obj = Order(
        orderId=order_input.orderId,
        receiptId=order_input.receiptId,
        timestamp=timestamp_dt,
        customer=order_input.customer,
        items=order_input.items,
        payment=order_input.payment,
        pricing=order_input.pricing,
        orderStatus=order_input.orderStatus,
        specialInstructions=order_input.specialInstructions,
    )

    doc = order_obj.model_dump()
    doc["timestamp"] = doc["timestamp"].isoformat()

    await db.orders.insert_one(doc)
    return order_obj


@api_router.get("/orders", response_model=List[Order])
async def get_orders():
    """
    Fetch recent orders stored in MongoDB.
    """
    orders = await db.orders.find({}, {"_id": 0}).sort("timestamp", -1).to_list(1000)

    for order in orders:
        if isinstance(order.get("timestamp"), str):
            order["timestamp"] = datetime.fromisoformat(order["timestamp"])

    return orders


@api_router.post("/admin/login")
async def admin_login(credentials: AdminLoginInput):
    """
    Simple admin login that checks username/password against the admin_users collection.
    Returns success flag; in a real app you'd issue a session or token.
    """
    doc = await db.admin_users.find_one({"username": credentials.username, "active": True})
    if not doc:
        return {"success": False}

    password_hash = doc.get("passwordHash")
    if not password_hash:
        return {"success": False}

    try:
        is_valid = bcrypt.checkpw(
            credentials.password.encode("utf-8"),
            password_hash.encode("utf-8"),
        )
    except Exception:
        return {"success": False}

    return {"success": bool(is_valid)}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()