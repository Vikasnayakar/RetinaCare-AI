from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.patient import Patient

router = APIRouter(prefix="/patients", tags=["Patients"])


class PatientCreate(BaseModel):
    name: str
    age: int
    gender: str
    phone: str
    village: str
    health_worker_id: int


@router.post("")
def create_patient(data: PatientCreate, db: Session = Depends(get_db)):
    patient = Patient(**data.model_dump())

    db.add(patient)
    db.commit()
    db.refresh(patient)

    return patient


@router.get("")
def get_patients(
    health_worker_id: int,
    db: Session = Depends(get_db),
):
    return (
        db.query(Patient)
        .filter(Patient.health_worker_id == health_worker_id)
        .order_by(Patient.created_at.desc())
        .all()
    )


@router.get("/{patient_id}")
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db),
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found",
        )

    return patient