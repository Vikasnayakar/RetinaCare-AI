from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.report_service import generate_screening_report


router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)


@router.get("/screening/{screening_id}")
def download_screening_report(
    screening_id: int,
    db: Session = Depends(get_db),
):
    try:
        report_path = generate_screening_report(
            db=db,
            screening_id=screening_id,
        )

        return FileResponse(
            path=report_path,
            media_type="application/pdf",
            filename=f"retinascreen_screening_{screening_id}.pdf",
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate report: {str(exc)}",
        )