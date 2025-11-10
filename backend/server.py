from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Security
security = HTTPBearer()

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Models
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    password: Optional[str] = None

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    email: str
    created_at: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class Crypto(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    symbol: str
    price_brl: float
    icon: str

class WalletItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    crypto_id: str
    crypto_name: str
    crypto_symbol: str
    quantity: float
    price_brl: float
    total_brl: float

class TransactionCreate(BaseModel):
    crypto_id: str
    quantity: float
    transaction_type: str  # 'buy' or 'sell'

class Transaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    crypto_id: str
    crypto_name: str
    crypto_symbol: str
    transaction_type: str
    quantity: float
    price_brl: float
    total_brl: float
    timestamp: str

# Crypto data (fixed prices)
CRYPTO_DATA = [
    {"id": "btc", "name": "Bitcoin", "symbol": "BTC", "price_brl": 350000.00, "icon": "₿"},
    {"id": "eth", "name": "Ethereum", "symbol": "ETH", "price_brl": 18500.00, "icon": "Ξ"},
    {"id": "bnb", "name": "Binance Coin", "symbol": "BNB", "price_brl": 2100.00, "icon": "BNB"},
    {"id": "ada", "name": "Cardano", "symbol": "ADA", "price_brl": 3.50, "icon": "ADA"},
    {"id": "sol", "name": "Solana", "symbol": "SOL", "price_brl": 650.00, "icon": "SOL"},
]

# Helper functions
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token inválido")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "hashed_password": 0})
    if user is None:
        raise HTTPException(status_code=401, detail="Usuário não encontrado")
    return user

def get_crypto_by_id(crypto_id: str) -> Optional[dict]:
    for crypto in CRYPTO_DATA:
        if crypto["id"] == crypto_id:
            return crypto
    return None

# Routes
@api_router.get("/")
async def root():
    return {"message": "Crypto Wallet API"}

# Auth routes
@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserRegister):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    # Create user
    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(user_data.password)
    user_doc = {
        "id": user_id,
        "name": user_data.name,
        "email": user_data.email,
        "hashed_password": hashed_password,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user_doc)
    
    # Create token
    access_token = create_access_token(data={"sub": user_id})
    user = User(
        id=user_id,
        name=user_data.name,
        email=user_data.email,
        created_at=user_doc["created_at"]
    )
    return Token(access_token=access_token, token_type="bearer", user=user)

@api_router.post("/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")
    
    access_token = create_access_token(data={"sub": user["id"]})
    user_data = User(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        created_at=user["created_at"]
    )
    return Token(access_token=access_token, token_type="bearer", user=user_data)

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: dict = Depends(get_current_user)):
    return User(**current_user)

@api_router.put("/auth/update", response_model=User)
async def update_user(update_data: UserUpdate, current_user: dict = Depends(get_current_user)):
    update_dict = {}
    if update_data.name:
        update_dict["name"] = update_data.name
    if update_data.password:
        update_dict["hashed_password"] = get_password_hash(update_data.password)
    
    if update_dict:
        await db.users.update_one({"id": current_user["id"]}, {"$set": update_dict})
    
    updated_user = await db.users.find_one({"id": current_user["id"]}, {"_id": 0, "hashed_password": 0})
    return User(**updated_user)

@api_router.delete("/auth/delete")
async def delete_account(current_user: dict = Depends(get_current_user)):
    # Delete user transactions
    await db.transactions.delete_many({"user_id": current_user["id"]})
    # Delete user wallet
    await db.wallets.delete_many({"user_id": current_user["id"]})
    # Delete user
    await db.users.delete_one({"id": current_user["id"]})
    return {"message": "Conta deletada com sucesso"}

# Crypto routes
@api_router.get("/cryptos", response_model=List[Crypto])
async def get_cryptos():
    return [Crypto(**crypto) for crypto in CRYPTO_DATA]

# Wallet routes
@api_router.get("/wallet", response_model=List[WalletItem])
async def get_wallet(current_user: dict = Depends(get_current_user)):
    wallet_items = await db.wallets.find({"user_id": current_user["id"]}, {"_id": 0}).to_list(100)
    
    result = []
    for item in wallet_items:
        crypto = get_crypto_by_id(item["crypto_id"])
        if crypto and item["quantity"] > 0:
            result.append(WalletItem(
                crypto_id=item["crypto_id"],
                crypto_name=crypto["name"],
                crypto_symbol=crypto["symbol"],
                quantity=item["quantity"],
                price_brl=crypto["price_brl"],
                total_brl=item["quantity"] * crypto["price_brl"]
            ))
    return result

@api_router.get("/wallet/balance")
async def get_balance(current_user: dict = Depends(get_current_user)):
    wallet_items = await db.wallets.find({"user_id": current_user["id"]}, {"_id": 0}).to_list(100)
    
    total = 0.0
    for item in wallet_items:
        crypto = get_crypto_by_id(item["crypto_id"])
        if crypto:
            total += item["quantity"] * crypto["price_brl"]
    
    return {"total_brl": round(total, 2)}

# Transaction routes
@api_router.post("/transactions/buy", response_model=Transaction)
async def buy_crypto(transaction_data: TransactionCreate, current_user: dict = Depends(get_current_user)):
    crypto = get_crypto_by_id(transaction_data.crypto_id)
    if not crypto:
        raise HTTPException(status_code=404, detail="Criptomoeda não encontrada")
    
    if transaction_data.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantidade deve ser maior que zero")
    
    # Create transaction
    transaction_id = str(uuid.uuid4())
    total = transaction_data.quantity * crypto["price_brl"]
    transaction_doc = {
        "id": transaction_id,
        "user_id": current_user["id"],
        "crypto_id": crypto["id"],
        "crypto_name": crypto["name"],
        "crypto_symbol": crypto["symbol"],
        "transaction_type": "buy",
        "quantity": transaction_data.quantity,
        "price_brl": crypto["price_brl"],
        "total_brl": total,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    await db.transactions.insert_one(transaction_doc)
    
    # Update wallet
    wallet_item = await db.wallets.find_one({"user_id": current_user["id"], "crypto_id": crypto["id"]})
    if wallet_item:
        new_quantity = wallet_item["quantity"] + transaction_data.quantity
        await db.wallets.update_one(
            {"user_id": current_user["id"], "crypto_id": crypto["id"]},
            {"$set": {"quantity": new_quantity}}
        )
    else:
        await db.wallets.insert_one({
            "user_id": current_user["id"],
            "crypto_id": crypto["id"],
            "quantity": transaction_data.quantity
        })
    
    return Transaction(**transaction_doc)

@api_router.post("/transactions/sell", response_model=Transaction)
async def sell_crypto(transaction_data: TransactionCreate, current_user: dict = Depends(get_current_user)):
    crypto = get_crypto_by_id(transaction_data.crypto_id)
    if not crypto:
        raise HTTPException(status_code=404, detail="Criptomoeda não encontrada")
    
    if transaction_data.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantidade deve ser maior que zero")
    
    # Check wallet
    wallet_item = await db.wallets.find_one({"user_id": current_user["id"], "crypto_id": crypto["id"]})
    if not wallet_item or wallet_item["quantity"] < transaction_data.quantity:
        raise HTTPException(status_code=400, detail="Saldo insuficiente")
    
    # Create transaction
    transaction_id = str(uuid.uuid4())
    total = transaction_data.quantity * crypto["price_brl"]
    transaction_doc = {
        "id": transaction_id,
        "user_id": current_user["id"],
        "crypto_id": crypto["id"],
        "crypto_name": crypto["name"],
        "crypto_symbol": crypto["symbol"],
        "transaction_type": "sell",
        "quantity": transaction_data.quantity,
        "price_brl": crypto["price_brl"],
        "total_brl": total,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    await db.transactions.insert_one(transaction_doc)
    
    # Update wallet
    new_quantity = wallet_item["quantity"] - transaction_data.quantity
    await db.wallets.update_one(
        {"user_id": current_user["id"], "crypto_id": crypto["id"]},
        {"$set": {"quantity": new_quantity}}
    )
    
    return Transaction(**transaction_doc)

@api_router.get("/transactions/history", response_model=List[Transaction])
async def get_transaction_history(current_user: dict = Depends(get_current_user)):
    transactions = await db.transactions.find(
        {"user_id": current_user["id"]},
        {"_id": 0}
    ).sort("timestamp", -1).to_list(1000)
    return [Transaction(**t) for t in transactions]

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