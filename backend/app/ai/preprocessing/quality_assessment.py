import cv2
import numpy as np


def assess_quality(image_path: str) -> dict:
    image = cv2.imread(image_path)

    if image is None:
        raise ValueError("Unable to read image.")

    height, width = image.shape[:2]

    if min(height, width) < 512:
        return {
            "quality": "poor",
            "score": 25.0,
            "reason": "Image resolution is too low.",
        }

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    brightness = float(np.mean(gray))
    contrast = float(np.std(gray))
    sharpness = float(cv2.Laplacian(gray, cv2.CV_64F).var())

    # Estimate retinal field coverage.
    non_black = np.mean(gray > 15)

    score = 100.0
    reasons = []

    # Exposure
    if brightness < 35:
        score -= 25
        reasons.append("image is too dark")
    elif brightness > 220:
        score -= 25
        reasons.append("image is overexposed")

    # Contrast
    if contrast < 20:
        score -= 20
        reasons.append("low contrast")

    # Focus
    if sharpness < 8:
        score -= 25
        reasons.append("low image sharpness")
    elif sharpness < 15:
        score -= 10
        reasons.append("moderate image sharpness")

    # Field coverage
    if non_black < 0.25:
        score -= 20
        reasons.append("insufficient retinal field")

    score = max(0.0, min(100.0, score))

    if score >= 70:
        quality = "good"
    elif score >= 50:
        quality = "borderline"
    else:
        quality = "poor"

    return {
        "quality": quality,
        "score": round(score, 2),
        "reason": ", ".join(reasons) if reasons else "image is suitable for screening",
    }