from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.doctor_review import (
    DoctorReviewCreate,
    DoctorReviewResponse,
)
from app.services.doctor_review_service import (
    create_doctor_review,
    get_doctor_review,
    get_all_doctor_reviews,
)

router = APIRouter(
    prefix="/doctor-reviews",
    tags=["Doctor Reviews"],
)


@router.post(
    "/referrals/{referral_id}",
    response_model=DoctorReviewResponse,
)
def submit_doctor_review(
    referral_id: int,
    data: DoctorReviewCreate,
    db: Session = Depends(get_db),
):
    review, error = create_doctor_review(
        db=db,
        referral_id=referral_id,
        data=data,
    )

    if error:
        status_code = (
            404
            if error == "Referral not found."
            else 400
        )

        raise HTTPException(
            status_code=status_code,
            detail=error,
        )

    return review


@router.get(
    "/referrals/{referral_id}",
    response_model=DoctorReviewResponse,
)
def get_referral_review(
    referral_id: int,
    db: Session = Depends(get_db),
):
    review = get_doctor_review(
        db=db,
        referral_id=referral_id,
    )

    if not review:
        raise HTTPException(
            status_code=404,
            detail="Doctor review not found.",
        )

    return review


@router.get(
    "/",
    response_model=list[DoctorReviewResponse],
)
def list_doctor_reviews(
    db: Session = Depends(get_db),
):
    return get_all_doctor_reviews(db=db)