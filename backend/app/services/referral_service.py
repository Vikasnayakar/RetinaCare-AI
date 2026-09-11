from sqlalchemy.orm import Session

from app.models.patient import Patient
from app.models.referral import Referral
from app.models.screening import Screening


def create_referral(
    db: Session,
    screening_id: int,
    reason: str,
    priority: str = "routine",
    referred_by: int | None = None,
):
    screening = (
        db.query(Screening)
        .filter(Screening.id == screening_id)
        .first()
    )

    if not screening:
        return None, "Screening not found."

    patient = (
        db.query(Patient)
        .filter(Patient.id == screening.patient_id)
        .first()
    )

    if not patient:
        return None, "Patient not found."

    existing = (
        db.query(Referral)
        .filter(
            Referral.screening_id == screening_id,
            Referral.is_active == True,
        )
        .first()
    )

    if existing:
        return existing, None

    referral = Referral(
        patient_id=patient.id,
        screening_id=screening.id,
        referred_by=referred_by,
        reason=reason,
        priority=priority,
        status="pending",
        is_active=True,
    )

    db.add(referral)
    db.commit()
    db.refresh(referral)

    return referral, None


def get_all_referrals(
    db: Session,
    status: str | None = None,
):
    query = (
        db.query(Referral)
        .filter(Referral.is_active == True)
    )

    if status:
        query = query.filter(
            Referral.status == status
        )

    return (
        query
        .order_by(Referral.created_at.desc())
        .all()
    )


def get_referral(
    db: Session,
    referral_id: int,
):
    return (
        db.query(Referral)
        .filter(Referral.id == referral_id)
        .first()
    )


def get_patient_referrals(
    db: Session,
    patient_id: int,
):
    return (
        db.query(Referral)
        .filter(
            Referral.patient_id == patient_id,
            Referral.is_active == True,
        )
        .order_by(Referral.created_at.desc())
        .all()
    )