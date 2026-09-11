from pathlib import Path
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Image,
)

from sqlalchemy.orm import Session

from app.models.patient import Patient
from app.models.screening import Screening
from app.models.referral import Referral
from app.models.doctor_review import DoctorReview
from app.models.user import User


BASE_DIR = Path(__file__).resolve().parents[2]

REPORT_DIR = BASE_DIR / "reports"
REPORT_DIR.mkdir(parents=True, exist_ok=True)


def _get_user(db: Session, user_id: int | None):
    if not user_id:
        return None

    return (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )


def _grade_label(grade):
    labels = {
        0: "Grade 0 — No Diabetic Retinopathy",
        1: "Grade 1 — Mild NPDR",
        2: "Grade 2 — Moderate NPDR",
        3: "Grade 3 — Severe NPDR",
        4: "Grade 4 — Proliferative DR",
    }

    return labels.get(grade, "Not available")


def _format_date(value):
    if not value:
        return "Not available"

    return value.strftime("%d %b %Y, %I:%M %p")


def _build_table(rows, col_widths):
    table = Table(
        rows,
        colWidths=col_widths,
        repeatRows=1,
    )

    table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#0f172a"),
                ),
                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, 0),
                    colors.white,
                ),
                (
                    "FONTNAME",
                    (0, 0),
                    (-1, 0),
                    "Helvetica-Bold",
                ),
                (
                    "FONTNAME",
                    (0, 1),
                    (-1, -1),
                    "Helvetica",
                ),
                (
                    "FONTSIZE",
                    (0, 0),
                    (-1, -1),
                    9,
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.HexColor("#cbd5e1"),
                ),
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "TOP",
                ),
                (
                    "LEFTPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
                (
                    "RIGHTPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
            ]
        )
    )

    return table


def generate_screening_report(
    db: Session,
    screening_id: int,
):
    screening = (
        db.query(Screening)
        .filter(Screening.id == screening_id)
        .first()
    )

    # FIX: Raise ValueError instead of returning a tuple
    if not screening:
        raise ValueError("Screening not found.")

    patient = (
        db.query(Patient)
        .filter(Patient.id == screening.patient_id)
        .first()
    )

    # FIX: Raise ValueError instead of returning a tuple
    if not patient:
        raise ValueError("Patient not found.")

    referral = (
        db.query(Referral)
        .filter(
            Referral.screening_id == screening_id,
            Referral.is_active == True,
        )
        .order_by(Referral.created_at.desc())
        .first()
    )

    doctor_review = None

    if referral:
        doctor_review = (
            db.query(DoctorReview)
            .filter(
                DoctorReview.referral_id == referral.id
            )
            .first()
        )

    health_worker = None

    if referral and referral.referred_by:
        health_worker = _get_user(
            db,
            referral.referred_by,
        )

    doctor = None

    if doctor_review:
        doctor = _get_user(
            db,
            doctor_review.doctor_id,
        )

    file_name = (
        f"retinascreen_screening_{screening.id}.pdf"
    )

    file_path = REPORT_DIR / file_name

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=24,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#0f172a"),
        spaceAfter=5,
    )

    subtitle_style = ParagraphStyle(
        "ReportSubtitle",
        parent=styles["Normal"],
        fontSize=10,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#64748b"),
        spaceAfter=15,
    )

    section_style = ParagraphStyle(
        "Section",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=15,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=12,
        spaceAfter=7,
    )

    normal_style = ParagraphStyle(
        "NormalReport",
        parent=styles["Normal"],
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#334155"),
    )

    notice_style = ParagraphStyle(
        "Notice",
        parent=styles["Normal"],
        fontSize=8,
        leading=12,
        textColor=colors.HexColor("#475569"),
    )

    story = []

    # --------------------------------------------------
    # HEADER
    # --------------------------------------------------

    story.append(
        Paragraph(
            "RetinaScreen",
            title_style,
        )
    )

    story.append(
        Paragraph(
            "AI-Assisted Diabetic Retinopathy Screening Report",
            subtitle_style,
        )
    )

    story.append(
        Paragraph(
            f"<b>Screening Report #{screening.id}</b>",
            normal_style,
        )
    )

    story.append(
        Paragraph(
            f"Generated: {_format_date(datetime.utcnow())}",
            normal_style,
        )
    )

    story.append(Spacer(1, 8))

    # --------------------------------------------------
    # PATIENT DETAILS
    # --------------------------------------------------

    story.append(
        Paragraph(
            "1. Patient Details",
            section_style,
        )
    )

    patient_rows = [
        ["Field", "Details"],
        ["Patient Name", patient.name],
        ["Patient ID", f"#{patient.id}"],
        ["Age", f"{patient.age} years"],
        ["Gender", patient.gender],
        ["Phone", patient.phone],
        ["Village / Location", patient.village],
    ]

    story.append(
        _build_table(
            patient_rows,
            [55 * mm, 125 * mm],
        )
    )

    # --------------------------------------------------
    # PHC / ORGANISATION
    # --------------------------------------------------

    story.append(
        Paragraph(
            "2. PHC / Organisation",
            section_style,
        )
    )

    organisation = (
        health_worker.organization
        if health_worker
        and getattr(
            health_worker,
            "organization",
            None,
        )
        else "Not available"
    )

    health_worker_name = (
        health_worker.name
        if health_worker
        else "Not available"
    )

    organisation_rows = [
        ["Field", "Details"],
        ["PHC / Organisation", organisation],
        ["Health Worker", health_worker_name],
        [
            "Health Worker ID",
            (
                f"#{health_worker.id}"
                if health_worker
                else "Not available"
            ),
        ],
    ]

    story.append(
        _build_table(
            organisation_rows,
            [55 * mm, 125 * mm],
        )
    )

    # --------------------------------------------------
    # SCREENING DETAILS
    # --------------------------------------------------

    story.append(
        Paragraph(
            "3. Screening Details",
            section_style,
        )
    )

    confidence = (
        f"{screening.confidence * 100:.1f}%"
        if screening.confidence is not None
        else "Pending"
    )

    lesions = screening.lesions

    if not lesions:
        lesions_text = "No lesion segmentation result available."

    elif isinstance(lesions, str):
        lesions_text = lesions

    else:
        lesions_text = str(lesions)

    quality_score = (
        f"{screening.quality_score:.1f}%"
        if screening.quality_score is not None
        else "Not available"
    )

    screening_rows = [
        ["Field", "Details"],
        ["Screening ID", f"#{screening.id}"],
        [
            "Screening Date",
            _format_date(screening.created_at),
        ],
        [
            "Image Quality",
            f"{screening.quality} · {quality_score}",
        ],
        [
            "DR Grade",
            (
                _grade_label(screening.dr_grade)
                if screening.dr_grade is not None
                else "Pending"
            ),
        ],
        [
            "Severity",
            screening.severity or "Pending",
        ],
        [
            "AI Confidence",
            confidence,
        ],
        [
            "Detected Lesions",
            lesions_text,
        ],
        [
            "Risk",
            screening.risk or "Pending",
        ],
        [
            "Referral Required",
            "Yes"
            if screening.referral_required
            else "No",
        ],
    ]

    story.append(
        _build_table(
            screening_rows,
            [55 * mm, 125 * mm],
        )
    )

    # --------------------------------------------------
    # FUNDUS IMAGE
    # --------------------------------------------------

    story.append(
        Paragraph(
            "4. Fundus Image",
            section_style,
        )
    )

    image_path = BASE_DIR / screening.image_path

    if image_path.exists():
        try:
            fundus_image = Image(
                str(image_path),
                width=115 * mm,
                height=85 * mm,
            )

            fundus_image.hAlign = "CENTER"

            story.append(fundus_image)

        except Exception:
            story.append(
                Paragraph(
                    "Fundus image could not be embedded.",
                    normal_style,
                )
            )
    else:
        story.append(
            Paragraph(
                "Fundus image file is not available.",
                normal_style,
            )
        )

    # --------------------------------------------------
    # AI EXPLANATION
    # --------------------------------------------------

    story.append(
        Paragraph(
            "5. AI Screening Explanation",
            section_style,
        )
    )

    explanation = (
        screening.explanation
        or "No AI explanation is currently available."
    )

    story.append(
        Paragraph(
            explanation,
            normal_style,
        )
    )

    # --------------------------------------------------
    # REFERRAL
    # --------------------------------------------------

    story.append(
        Paragraph(
            "6. Specialist Referral",
            section_style,
        )
    )

    if referral:
        referral_rows = [
            ["Field", "Details"],
            [
                "Referral ID",
                f"#{referral.id}",
            ],
            [
                "Status",
                referral.status.capitalize(),
            ],
            [
                "Priority",
                referral.priority.capitalize(),
            ],
            [
                "Reason",
                referral.reason,
            ],
            [
                "Referred On",
                _format_date(referral.created_at),
            ],
        ]

        story.append(
            _build_table(
                referral_rows,
                [55 * mm, 125 * mm],
            )
        )

    else:
        story.append(
            Paragraph(
                "No specialist referral was created for this screening.",
                normal_style,
            )
        )

    # --------------------------------------------------
    # DOCTOR REVIEW
    # --------------------------------------------------

    story.append(
        Paragraph(
            "7. Specialist / Doctor Review",
            section_style,
        )
    )

    if doctor_review:
        doctor_name = (
            doctor.name
            if doctor
            else f"Doctor #{doctor_review.doctor_id}"
        )

        doctor_organisation = (
            doctor.organization
            if doctor
            and getattr(
                doctor,
                "organization",
                None,
            )
            else organisation
        )

        review_rows = [
            ["Field", "Details"],
            [
                "Doctor",
                doctor_name,
            ],
            [
                "Doctor ID",
                f"#{doctor_review.doctor_id}",
            ],
            [
                "Organisation",
                doctor_organisation,
            ],
            [
                "Clinical Decision",
                doctor_review.decision.capitalize(),
            ],
            [
                "Final DR Grade",
                (
                    _grade_label(
                        doctor_review.final_grade
                    )
                    if doctor_review.final_grade
                    is not None
                    else "Not recorded"
                ),
            ],
            [
                "Clinical Notes",
                (
                    doctor_review.clinical_notes
                    or "No clinical notes recorded."
                ),
            ],
            [
                "Reviewed On",
                _format_date(
                    doctor_review.reviewed_at
                ),
            ],
        ]

        story.append(
            _build_table(
                review_rows,
                [55 * mm, 125 * mm],
            )
        )

    else:
        story.append(
            Paragraph(
                "Specialist clinical review has not yet been completed.",
                normal_style,
            )
        )

    # --------------------------------------------------
    # CLINICAL NOTICE
    # --------------------------------------------------

    story.append(
        Paragraph(
            "8. Clinical Notice",
            section_style,
        )
    )

    notice = (
        "<b>Important:</b> RetinaScreen provides AI-assisted "
        "screening support and does not provide a definitive "
        "medical diagnosis. AI-generated results should be "
        "reviewed by a qualified healthcare professional. "
        "The final clinical assessment and patient management "
        "decision remain the responsibility of the treating "
        "healthcare professional."
    )

    notice_table = Table(
        [
            [
                Paragraph(
                    notice,
                    notice_style,
                )
            ]
        ],
        colWidths=[180 * mm],
    )

    notice_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, -1),
                    colors.HexColor("#f1f5f9"),
                ),
                (
                    "BOX",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.HexColor("#cbd5e1"),
                ),
                (
                    "LEFTPADDING",
                    (0, 0),
                    (-1, -1),
                    10,
                ),
                (
                    "RIGHTPADDING",
                    (0, 0),
                    (-1, -1),
                    10,
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    10,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    10,
                ),
            ]
        )
    )

    story.append(notice_table)

    # --------------------------------------------------
    # BUILD PDF
    # --------------------------------------------------

    document = SimpleDocTemplate(
        str(file_path),
        pagesize=A4,
        rightMargin=15 * mm,
        leftMargin=15 * mm,
        topMargin=15 * mm,
        bottomMargin=15 * mm,
        title=f"RetinaScreen Screening Report #{screening.id}",
        author="RetinaScreen",
    )

    document.build(story)

    # FIX: Return ONLY the Path object.
    # FileResponse expects a file path, not a tuple.
    return file_path