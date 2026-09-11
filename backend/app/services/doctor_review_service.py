from datetime import datetime

from sqlalchemy.orm import Session

from app.models.doctor_review import DoctorReview
from app.models.referral import Referral
from app.schemas.doctor_review import DoctorReviewCreate


def create_doctor_review(
    db: Session,
    referral_id: int,
    data: DoctorReviewCreate,
):
    referral = (
        db.query(Referral)
        .filter(Referral.id == referral_id)
        .first()
    )

    if not referral:
        return None, "Referral not found."

    existing_review = (
        db.query(DoctorReview)
        .filter(
            DoctorReview.referral_id == referral_id
        )
        .first()
    )

    if existing_review:
        return None, "This referral has already been reviewed."

    review = DoctorReview(
        referral_id=referral_id,
        doctor_id=data.doctor_id,
        decision=data.decision,
        final_grade=data.final_grade,
        clinical_notes=data.clinical_notes,
        reviewed_at=datetime.utcnow(),
    )

    db.add(review)

    referral.reviewed_by = data.doctor_id
    referral.reviewed_at = datetime.utcnow()
    referral.doctor_notes = data.clinical_notes
    referral.status = "completed"

    db.commit()
    db.refresh(review)

    return review, None


def get_doctor_review(
    db: Session,
    referral_id: int,
):
    return (
        db.query(DoctorReview)
        .filter(
            DoctorReview.referral_id == referral_id
        )
        .first()
    )


def get_all_doctor_reviews(
    db: Session,
):
    return (
        db.query(DoctorReview)
        .order_by(
            DoctorReview.reviewed_at.desc()
        )
        .all()
    )