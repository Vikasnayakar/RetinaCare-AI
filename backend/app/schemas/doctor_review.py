from datetime import datetime

from pydantic import BaseModel, Field


class DoctorReviewCreate(BaseModel):
    doctor_id: int

    decision: str = Field(
        min_length=2,
        max_length=50,
    )

    final_grade: int | None = Field(
        default=None,
        ge=0,
        le=4,
    )

    clinical_notes: str | None = Field(
        default=None,
        max_length=5000,
    )


class DoctorReviewResponse(BaseModel):
    id: int
    referral_id: int
    doctor_id: int
    decision: str
    final_grade: int | None
    clinical_notes: str | None
    reviewed_at: datetime

    class Config:
        from_attributes = True