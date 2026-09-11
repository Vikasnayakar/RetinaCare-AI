from pathlib import Path

from app.ai.preprocessing.quality_assessment import assess_quality


BASE_DIR = Path(__file__).resolve().parents[3]

MODEL_DIR = (
    BASE_DIR
    / "ai-models"
    / "grading"
    / "efficientnet"
)


def find_checkpoint():
    extensions = {".pth", ".pt", ".ckpt"}

    files = [
        file
        for file in MODEL_DIR.rglob("*")
        if file.is_file() and file.suffix.lower() in extensions
    ]

    return files[0] if files else None


def analyze_fundus(image_path: str) -> dict:
    quality_result = assess_quality(image_path)

    base_result = {
        "quality": quality_result["quality"],
        "quality_score": quality_result["score"],
        "quality_reason": quality_result["reason"],
        "dr_grade": None,
        "severity": None,
        "confidence": None,
        "lesions": [],
        "explanation": "",
        "risk": None,
        "referral_required": False,
    }

    if quality_result["quality"] == "poor":
        base_result["explanation"] = (
            "The fundus image requires better image quality "
            "before reliable AI screening."
        )
        return base_result

    checkpoint = find_checkpoint()

    if checkpoint is None:
        base_result["explanation"] = (
            "Image quality is acceptable. "
            "No trained DR grading checkpoint was found."
        )
        return base_result

    try:
        from app.ai.grading.inference import DRGrader

        grader = DRGrader(str(checkpoint))
        grading = grader.predict(image_path)

        base_result["dr_grade"] = grading["grade"]
        base_result["severity"] = grading["severity"]
        base_result["confidence"] = grading["confidence"]

        base_result["explanation"] = (
            "DR severity was estimated using the trained "
            "disease-grading model. Lesion segmentation and "
            "Grad-CAM will be added to the explanation pipeline."
        )

    except Exception as exc:
        base_result["explanation"] = (
            f"Unable to load the grading model: {exc}"
        )

    return base_result