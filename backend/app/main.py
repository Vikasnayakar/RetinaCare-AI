from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine

from app.api.auth import router as auth_router
from app.api.patients import router as patients_router
from app.api.screenings import router as screenings_router
from app.api.referrals import router as referrals_router
from app.api.doctor_reviews import router as doctor_reviews_router
from app.api.reports import router as reports_router

from app.models.user import User
from app.models.patient import Patient
from app.models.screening import Screening
from app.models.referral import Referral
from app.models.doctor_review import DoctorReview


app = FastAPI(
    title="RetinaScreen API",
    description="AI-assisted diabetic retinopathy screening platform",
    version="1.0.0",
)


# Create database tables
Base.metadata.create_all(bind=engine)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Serve uploaded fundus images
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)


# API routes
app.include_router(auth_router)
app.include_router(patients_router)
app.include_router(screenings_router)
app.include_router(referrals_router)
app.include_router(doctor_reviews_router)
app.include_router(reports_router)


@app.get("/")
def root():
    return {
        "name": "RetinaScreen API",
        "status": "running",
        "version": "1.0.0",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }