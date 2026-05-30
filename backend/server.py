from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import logging
from datetime import datetime, timezone, timedelta
from typing import Optional, Annotated, Any

import bcrypt
import jwt
from bson import ObjectId
from fastapi import FastAPI, APIRouter, Request, Response, HTTPException, Depends
from fastapi.responses import FileResponse, RedirectResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, BeforeValidator, EmailStr

import seed_data

# ----------------------------------------------------------------------------
# Setup
# ----------------------------------------------------------------------------
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

MEDIA_DIR = ROOT_DIR / "media"
MEDIA_DIR.mkdir(exist_ok=True)

JWT_ALGORITHM = "HS256"

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("sparsh")

app = FastAPI(title="Sparsh Pehla API")
api_router = APIRouter(prefix="/api")

# ----------------------------------------------------------------------------
# Auth helpers
# ----------------------------------------------------------------------------

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(hours=12), "type": "access"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ----------------------------------------------------------------------------
# Models
# ----------------------------------------------------------------------------
PyObjectId = Annotated[str, BeforeValidator(str)]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class LoginInput(BaseModel):
    email: EmailStr
    password: str


class InquiryInput(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    service: Optional[str] = ""
    message: str


class BookingInput(BaseModel):
    name: str
    email: EmailStr
    phone: str
    service: str
    preferred_date: Optional[str] = ""
    preferred_time: Optional[str] = ""
    message: Optional[str] = ""


class NewsletterInput(BaseModel):
    email: EmailStr


class StatusUpdate(BaseModel):
    status: str


# ----------------------------------------------------------------------------
# Helpers
# ----------------------------------------------------------------------------

def clean(doc: dict) -> dict:
    if not doc:
        return doc
    doc = dict(doc)
    if "_id" in doc:
        doc["id"] = str(doc.pop("_id"))
    return doc


ADMIN_COLLECTIONS = {"services", "blogs", "testimonials", "faqs", "gallery"}


# ----------------------------------------------------------------------------
# Auth routes
# ----------------------------------------------------------------------------
@api_router.post("/auth/login")
async def login(data: LoginInput, response: Response):
    email = data.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(str(user["_id"]), email)
    response.set_cookie("access_token", token, httponly=True, secure=True, samesite="none", max_age=43200, path="/")
    return {"id": str(user["_id"]), "email": user["email"], "name": user.get("name"), "role": user.get("role"), "token": token}


@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"message": "Logged out"}


# ----------------------------------------------------------------------------
# Public content routes
# ----------------------------------------------------------------------------
@api_router.get("/services")
async def list_services():
    docs = await db.services.find().sort("order", 1).to_list(100)
    return [clean(d) for d in docs]


@api_router.get("/services/{slug}")
async def get_service(slug: str):
    doc = await db.services.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Service not found")
    return clean(doc)


@api_router.get("/blogs")
async def list_blogs(category: Optional[str] = None, search: Optional[str] = None, featured: Optional[bool] = None):
    query: dict = {}
    if category and category != "All":
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"excerpt": {"$regex": search, "$options": "i"}},
            {"tags": {"$regex": search, "$options": "i"}},
        ]
    docs = await db.blogs.find(query).sort("created_at", -1).to_list(200)
    return [clean(d) for d in docs]


@api_router.get("/blogs/categories")
async def blog_categories():
    return seed_data.BLOG_CATEGORIES


@api_router.get("/blogs/{slug}")
async def get_blog(slug: str):
    doc = await db.blogs.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Blog not found")
    related = await db.blogs.find({"category": doc["category"], "slug": {"$ne": slug}}).limit(3).to_list(3)
    result = clean(doc)
    result["related"] = [clean(r) for r in related]
    return result


@api_router.get("/testimonials")
async def list_testimonials():
    docs = await db.testimonials.find().sort("created_at", -1).to_list(100)
    return [clean(d) for d in docs]


@api_router.get("/faqs")
async def list_faqs():
    docs = await db.faqs.find().sort("order", 1).to_list(100)
    return [clean(d) for d in docs]


@api_router.get("/gallery")
async def list_gallery(category: Optional[str] = None):
    query = {} if not category or category == "All" else {"category": category}
    docs = await db.gallery.find(query).sort("created_at", -1).to_list(200)
    return [clean(d) for d in docs]


@api_router.post("/inquiries")
async def create_inquiry(data: InquiryInput):
    doc = data.model_dump()
    doc.update({"status": "new", "created_at": now_iso()})
    res = await db.inquiries.insert_one(doc)
    return {"id": str(res.inserted_id), "message": "Thank you! We will reach out to you soon."}


@api_router.post("/bookings")
async def create_booking(data: BookingInput):
    doc = data.model_dump()
    doc.update({"status": "pending", "created_at": now_iso()})
    res = await db.bookings.insert_one(doc)
    return {"id": str(res.inserted_id), "message": "Your consultation request has been received. We'll confirm shortly."}


@api_router.post("/newsletter")
async def subscribe_newsletter(data: NewsletterInput):
    email = data.email.lower()
    existing = await db.newsletter.find_one({"email": email})
    if existing:
        return {"message": "You're already subscribed. Thank you!"}
    await db.newsletter.insert_one({"email": email, "created_at": now_iso()})
    return {"message": "Welcome! You've been subscribed to our newsletter."}


# ----------------------------------------------------------------------------
# Admin routes (protected)
# ----------------------------------------------------------------------------
@api_router.get("/admin/stats")
async def admin_stats(user: dict = Depends(get_current_user)):
    return {
        "inquiries": await db.inquiries.count_documents({}),
        "new_inquiries": await db.inquiries.count_documents({"status": "new"}),
        "bookings": await db.bookings.count_documents({}),
        "pending_bookings": await db.bookings.count_documents({"status": "pending"}),
        "blogs": await db.blogs.count_documents({}),
        "services": await db.services.count_documents({}),
        "testimonials": await db.testimonials.count_documents({}),
        "subscribers": await db.newsletter.count_documents({}),
    }


@api_router.get("/admin/inquiries")
async def admin_inquiries(user: dict = Depends(get_current_user)):
    docs = await db.inquiries.find().sort("created_at", -1).to_list(500)
    return [clean(d) for d in docs]


@api_router.patch("/admin/inquiries/{item_id}")
async def update_inquiry(item_id: str, data: StatusUpdate, user: dict = Depends(get_current_user)):
    await db.inquiries.update_one({"_id": ObjectId(item_id)}, {"$set": {"status": data.status}})
    return {"message": "Updated"}


@api_router.delete("/admin/inquiries/{item_id}")
async def delete_inquiry(item_id: str, user: dict = Depends(get_current_user)):
    await db.inquiries.delete_one({"_id": ObjectId(item_id)})
    return {"message": "Deleted"}


@api_router.get("/admin/bookings")
async def admin_bookings(user: dict = Depends(get_current_user)):
    docs = await db.bookings.find().sort("created_at", -1).to_list(500)
    return [clean(d) for d in docs]


@api_router.patch("/admin/bookings/{item_id}")
async def update_booking(item_id: str, data: StatusUpdate, user: dict = Depends(get_current_user)):
    await db.bookings.update_one({"_id": ObjectId(item_id)}, {"$set": {"status": data.status}})
    return {"message": "Updated"}


@api_router.delete("/admin/bookings/{item_id}")
async def delete_booking(item_id: str, user: dict = Depends(get_current_user)):
    await db.bookings.delete_one({"_id": ObjectId(item_id)})
    return {"message": "Deleted"}


@api_router.get("/admin/newsletter")
async def admin_newsletter(user: dict = Depends(get_current_user)):
    docs = await db.newsletter.find().sort("created_at", -1).to_list(1000)
    return [clean(d) for d in docs]


# Generic CRUD for content collections
@api_router.post("/admin/{collection}")
async def admin_create(collection: str, payload: dict[str, Any], user: dict = Depends(get_current_user)):
    if collection not in ADMIN_COLLECTIONS:
        raise HTTPException(status_code=404, detail="Unknown collection")
    payload.pop("id", None)
    payload.pop("_id", None)
    payload["created_at"] = now_iso()
    res = await db[collection].insert_one(payload)
    doc = await db[collection].find_one({"_id": res.inserted_id})
    return clean(doc)


@api_router.put("/admin/{collection}/{item_id}")
async def admin_update(collection: str, item_id: str, payload: dict[str, Any], user: dict = Depends(get_current_user)):
    if collection not in ADMIN_COLLECTIONS:
        raise HTTPException(status_code=404, detail="Unknown collection")
    payload.pop("id", None)
    payload.pop("_id", None)
    await db[collection].update_one({"_id": ObjectId(item_id)}, {"$set": payload})
    doc = await db[collection].find_one({"_id": ObjectId(item_id)})
    return clean(doc)


@api_router.delete("/admin/{collection}/{item_id}")
async def admin_delete(collection: str, item_id: str, user: dict = Depends(get_current_user)):
    if collection not in ADMIN_COLLECTIONS:
        raise HTTPException(status_code=404, detail="Unknown collection")
    await db[collection].delete_one({"_id": ObjectId(item_id)})
    return {"message": "Deleted"}


# ----------------------------------------------------------------------------
# Media serving (AI generated images with stock fallback)
# ----------------------------------------------------------------------------
@api_router.get("/media/{key}")
async def get_media(key: str):
    key = key.replace(".png", "").replace("/", "")
    file_path = MEDIA_DIR / f"{key}.png"
    if file_path.exists():
        return FileResponse(file_path, media_type="image/png")
    fallback = seed_data.MEDIA_FALLBACKS.get(key)
    if fallback:
        return RedirectResponse(fallback)
    raise HTTPException(status_code=404, detail="Image not found")


@api_router.get("/")
async def root():
    return {"message": "Sparsh Pehla API", "status": "ok"}


# ----------------------------------------------------------------------------
# Seeding
# ----------------------------------------------------------------------------
async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@sparshpehla.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "email": admin_email, "password_hash": hash_password(admin_password),
            "name": "Sparsh Admin", "role": "admin", "created_at": now_iso(),
        })
        logger.info("Admin user seeded")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
        logger.info("Admin password updated")


async def seed_content():
    if await db.services.count_documents({}) == 0:
        for i, s in enumerate(seed_data.SERVICES):
            doc = dict(s)
            doc["order"] = i
            doc["created_at"] = now_iso()
            await db.services.insert_one(doc)
        logger.info("Services seeded")
    if await db.blogs.count_documents({}) == 0:
        for s in seed_data.BLOGS:
            doc = dict(s)
            doc["created_at"] = now_iso()
            await db.blogs.insert_one(doc)
        logger.info("Blogs seeded")
    if await db.testimonials.count_documents({}) == 0:
        for s in seed_data.TESTIMONIALS:
            doc = dict(s)
            doc["created_at"] = now_iso()
            await db.testimonials.insert_one(doc)
        logger.info("Testimonials seeded")
    if await db.faqs.count_documents({}) == 0:
        for i, s in enumerate(seed_data.FAQS):
            doc = dict(s)
            doc["order"] = i
            doc["created_at"] = now_iso()
            await db.faqs.insert_one(doc)
        logger.info("FAQs seeded")
    if await db.gallery.count_documents({}) == 0:
        for s in seed_data.GALLERY:
            doc = dict(s)
            doc["created_at"] = now_iso()
            await db.gallery.insert_one(doc)
        logger.info("Gallery seeded")


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await seed_admin()
    await seed_content()
    try:
        mem = Path("/app/memory")
        mem.mkdir(exist_ok=True)
        (mem / "test_credentials.md").write_text(
            "# Sparsh Pehla - Test Credentials\n\n"
            "## Admin (JWT login)\n"
            f"- Email: {os.environ.get('ADMIN_EMAIL')}\n"
            f"- Password: {os.environ.get('ADMIN_PASSWORD')}\n"
            "- Role: admin\n\n"
            "## Auth Endpoints\n"
            "- POST /api/auth/login\n- GET /api/auth/me\n- POST /api/auth/logout\n\n"
            "## Admin Panel URL\n- /admin/login then /admin\n"
        )
    except Exception as e:
        logger.warning(f"Could not write credentials: {e}")


@app.on_event("shutdown")
async def shutdown():
    client.close()


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
