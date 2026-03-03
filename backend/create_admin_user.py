# create_admin_user.py
import os
from datetime import datetime, timezone

import bcrypt
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]

USERNAME = "admin"          # change if you like
PASSWORD = "admin123"       # set your desired password here


async def main():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    password_hash = bcrypt.hashpw(PASSWORD.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    doc = {
        "username": USERNAME,
        "passwordHash": password_hash,
        "role": "admin",
        "active": True,
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }

    # Upsert by username so you can re-run safely
    await db.admin_users.update_one(
        {"username": USERNAME},
        {"$set": doc},
        upsert=True,
    )

    print(f"Admin user '{USERNAME}' created/updated.")
    client.close()


if __name__ == "__main__":
    asyncio.run(main())