from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class DoctorReview(Base):
    __tablename__ = "doctor_reviews"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    referral_id: Mapped[int] = mapped_column(
        ForeignKey("referrals.id"),
        index=True,
    )

    doctor_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        index=True,
    )

    decision: Mapped[str] = mapped_column(
        Text,
    )

    final_grade: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    clinical_notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    reviewed_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )