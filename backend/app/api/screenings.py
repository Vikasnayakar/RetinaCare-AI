import json
import shutil
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.ai.pipeline import analyze_fundus
from app.database import get_db
from app.models.patient import Patient
from app.models.screening import Screening

router = APIRouter(prefix="/screenings", tags=["Screenings"])

UPLOAD_DIR = Path("uploads/fundus")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/{patient_id}")
async def create_screening(
    patient_id: int,
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found.",
        )

    allowed = {".jpg", ".jpeg", ".png", ".webp"}
    extension = Path(image.filename or "").suffix.lower()

    if extension not in allowed:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, JPEG, PNG and WEBP images are supported.",
        )

    filename = f"patient_{patient_id}_{Path(image.filename).stem}{extension}"
    image_path = UPLOAD_DIR / filename

    with image_path.open("wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    try:
        result = analyze_fundus(str(image_path))
    except ValueError as exc:
        image_path.unlink(missing_ok=True)
        raise HTTPException(status_code=400, detail=str(exc))

    screening = Screening(
        patient_id=patient_id,
        image_path=str(image_path),
        quality=result["quality"],
        quality_score=result["quality_score"],
        dr_grade=result["dr_grade"],
        severity=result["severity"],
        confidence=result["confidence"],
        lesions=json.dumps(result["lesions"]),
        explanation=result["explanation"],
        risk=result["risk"],
        referral_required=result["referral_required"],
    )

    db.add(screening)
    db.commit()
    db.refresh(screening)

    return {
        "id": screening.id,
        "patient_id": patient_id,
        **result,
    }


@router.get("/patient/{patient_id}")
def get_patient_screenings(
    patient_id: int,
    db: Session = Depends(get_db),
):
    return (
        db.query(Screening)
        .filter(Screening.patient_id == patient_id)
        .order_by(Screening.created_at.desc())
        .all()
    )