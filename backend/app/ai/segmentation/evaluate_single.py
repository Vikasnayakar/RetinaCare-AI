from pathlib import Path

import cv2
import numpy as np

from app.ai.segmentation.inference import UNetSegmenter


PROJECT_ROOT = Path(r"D:\DR-Screening-AI")

TEST_IMAGE_DIR = (
    PROJECT_ROOT
    / "datasets"
    / "IDRiD"
    / "segmentation"
    / "A. Segmentation"
    / "1. Original Images"
    / "b. Testing Set"
)

TEST_MASK_DIR = (
    PROJECT_ROOT
    / "datasets"
    / "IDRiD"
    / "segmentation"
    / "A. Segmentation"
    / "2. All Segmentation Groundtruths"
    / "b. Testing Set"
)

CLASS_FOLDERS = {
    "MA": "1. Microaneurysms",
    "HE": "2. Haemorrhages",
    "EX": "3. Hard Exudates",
    "SE": "4. Soft Exudates",
    "OD": "5. Optic Disc",
}

MASK_SUFFIXES = {
    "MA": "MA",
    "HE": "HE",
    "EX": "EX",
    "SE": "SE",
    "OD": "OD",
}


def load_ground_truth(image_id, class_name):
    folder = (
        TEST_MASK_DIR
        / CLASS_FOLDERS[class_name]
    )

    mask_path = (
        folder
        / f"{image_id}_{MASK_SUFFIXES[class_name]}.tif"
    )

    if not mask_path.exists():
        return None

    mask = cv2.imread(
        str(mask_path),
        cv2.IMREAD_GRAYSCALE,
    )

    if mask is None:
        raise ValueError(
            f"Unable to read mask: {mask_path}"
        )

    return mask > 0


def calculate_metrics(prediction_mask, ground_truth):

    prediction_mask = prediction_mask.astype(bool)
    ground_truth = ground_truth.astype(bool)

    tp = np.logical_and(
        prediction_mask,
        ground_truth,
    ).sum()

    fp = np.logical_and(
        prediction_mask,
        ~ground_truth,
    ).sum()

    fn = np.logical_and(
        ~prediction_mask,
        ground_truth,
    ).sum()

    predicted_positive = prediction_mask.sum()
    actual_positive = ground_truth.sum()

    if predicted_positive == 0 and actual_positive == 0:
        dice = 1.0
        iou = 1.0
        precision = 1.0
        recall = 1.0

    else:
        dice_denominator = (
            2 * tp + fp + fn
        )

        iou_denominator = (
            tp + fp + fn
        )

        precision_denominator = (
            tp + fp
        )

        recall_denominator = (
            tp + fn
        )

        dice = (
            2 * tp / dice_denominator
            if dice_denominator > 0
            else 0.0
        )

        iou = (
            tp / iou_denominator
            if iou_denominator > 0
            else 0.0
        )

        precision = (
            tp / precision_denominator
            if precision_denominator > 0
            else 0.0
        )

        recall = (
            tp / recall_denominator
            if recall_denominator > 0
            else 0.0
        )

    return {
        "dice": float(dice),
        "iou": float(iou),
        "precision": float(precision),
        "recall": float(recall),
        "tp": int(tp),
        "fp": int(fp),
        "fn": int(fn),
        "predicted_positive": int(
            predicted_positive
        ),
        "actual_positive": int(
            actual_positive
        ),
    }


def main():

    image_path = (
        TEST_IMAGE_DIR
        / "IDRiD_55.jpg"
    )

    if not image_path.exists():
        raise FileNotFoundError(
            f"Test image not found: {image_path}"
        )

    print("=" * 70)
    print("IDRiD SINGLE-IMAGE U-NET EVALUATION")
    print("=" * 70)

    print(f"Image: {image_path}")

    segmenter = UNetSegmenter()

    prediction = segmenter.predict(
        str(image_path)
    )

    print()
    print("Evaluation results:")
    print("-" * 70)

    for class_name in CLASS_FOLDERS:

        ground_truth = load_ground_truth(
            "IDRiD_55",
            class_name,
        )

        if ground_truth is None:
            print(
                f"{class_name}: "
                "GROUND TRUTH MISSING → SKIPPED"
            )
            continue

        predicted = prediction[
            "masks"
        ][class_name]["mask"]

        metrics = calculate_metrics(
            predicted,
            ground_truth,
        )

        print(f"\n{class_name} - {CLASS_FOLDERS[class_name]}")
        print(
            f"  Dice:      {metrics['dice']:.4f}"
        )
        print(
            f"  IoU:       {metrics['iou']:.4f}"
        )
        print(
            f"  Precision: {metrics['precision']:.4f}"
        )
        print(
            f"  Recall:    {metrics['recall']:.4f}"
        )
        print(
            f"  TP:        {metrics['tp']}"
        )
        print(
            f"  FP:        {metrics['fp']}"
        )
        print(
            f"  FN:        {metrics['fn']}"
        )
        print(
            f"  Predicted positive pixels: "
            f"{metrics['predicted_positive']}"
        )
        print(
            f"  Ground-truth positive pixels: "
            f"{metrics['actual_positive']}"
        )

    print()
    print("=" * 70)
    print("EVALUATION COMPLETE")
    print("=" * 70)


if __name__ == "__main__":
    main()