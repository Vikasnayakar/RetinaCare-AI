from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.referral_service import (
    create_referral,
    get_all_referrals,
    get_referral,
    get_patient_referrals,
)

router = APIRouter(
    prefix="/referrals",
    tags=["Referrals"],
)


@router.post("/screenings/{screening_id}")
def create_screening_referral(
    screening_id: int,
    reason: str = "Specialist review recommended based on screening result.",
    priority: str = "routine",
    referred_by: int | None = None,
    db: Session = Depends(get_db),
):
    referral, error = create_referral(
        db=db,
        screening_id=screening_id,
        reason=reason,
        priority=priority,
        referred_by=referred_by,
    )

    if error:
        raise HTTPException(
            status_code=404,
            detail=error,
        )

    return referral


@router.get("/")
def list_referrals(
    status: str | None = None,
    db: Session = Depends(get_db),
):
    return get_all_referrals(
        db=db,
        status=status,
    )


@router.get("/patient/{patient_id}")
def list_patient_referrals(
    patient_id: int,
    db: Session = Depends(get_db),
):
    return get_patient_referrals(
        db=db,
        patient_id=patient_id,
    )


@router.get("/{referral_id}")
def referral_details(
    referral_id: int,
    db: Session = Depends(get_db),
):
    referral = get_referral(
        db=db,
        referral_id=referral_id,
    )

    if not referral:
        raise HTTPException(
            status_code=404,
            detail="Referral not found.",
        )

    return referral