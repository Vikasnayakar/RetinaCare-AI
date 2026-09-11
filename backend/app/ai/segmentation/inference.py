from pathlib import Path

import cv2
import numpy as np
import torch
from PIL import Image

from app.ai.segmentation.model import UNet


CLASS_NAMES = [
    "MA",
    "HE",
    "EX",
    "SE",
    "OD",
]

CLASS_LABELS = {
    "MA": "Microaneurysms",
    "HE": "Haemorrhages",
    "EX": "Hard Exudates",
    "SE": "Soft Exudates",
    "OD": "Optic Disc",
}


PROJECT_ROOT = Path(__file__).resolve().parents[4]

CHECKPOINT_PATH = (
    PROJECT_ROOT
    / "ai-models"
    / "segmentation"
    / "unet"
    / "best_unet.pth"
)


class UNetSegmenter:

    def __init__(
        self,
        checkpoint_path: str | Path = CHECKPOINT_PATH,
        image_size: int = 512,
        threshold: float = 0.5,
    ):
        self.device = torch.device(
            "cuda" if torch.cuda.is_available() else "cpu"
        )

        self.image_size = image_size
        self.threshold = threshold

        checkpoint_path = Path(checkpoint_path)

        if not checkpoint_path.exists():
            raise FileNotFoundError(
                f"U-Net checkpoint not found: {checkpoint_path}"
            )

        print(f"Loading U-Net checkpoint: {checkpoint_path}")
        print(f"Device: {self.device}")

        self.model = UNet(
            in_channels=3,
            out_channels=5,
        )

        checkpoint = torch.load(
            checkpoint_path,
            map_location=self.device,
        )

        if isinstance(checkpoint, dict):

            if "model_state_dict" in checkpoint:
                state_dict = checkpoint["model_state_dict"]

            elif "state_dict" in checkpoint:
                state_dict = checkpoint["state_dict"]

            else:
                state_dict = checkpoint

        else:
            state_dict = checkpoint

        cleaned_state_dict = {}

        for key, value in state_dict.items():
            cleaned_key = key.replace("module.", "")
            cleaned_state_dict[cleaned_key] = value

        self.model.load_state_dict(
            cleaned_state_dict,
            strict=True,
        )

        self.model.to(self.device)
        self.model.eval()

        print("U-Net checkpoint loaded successfully.")

    def _preprocess(self, image_path: str):

        image = Image.open(image_path).convert("RGB")

        original_width, original_height = image.size

        resized = image.resize(
            (self.image_size, self.image_size),
            Image.Resampling.BILINEAR,
        )

        image_array = np.asarray(
            resized,
            dtype=np.float32,
        ) / 255.0

        tensor = torch.from_numpy(
            image_array.transpose(2, 0, 1)
        ).float()

        tensor = tensor.unsqueeze(0)

        return (
            tensor.to(self.device),
            (original_width, original_height),
        )

    @torch.no_grad()
    def predict(self, image_path: str):

        image_path = str(image_path)

        tensor, original_size = self._preprocess(
            image_path
        )

        logits = self.model(tensor)

        probabilities = torch.sigmoid(logits)

        probabilities = probabilities[0].cpu().numpy()

        masks = {}

        for index, class_name in enumerate(CLASS_NAMES):

            probability_map = probabilities[index]

            binary_mask = (
                probability_map >= self.threshold
            ).astype(np.uint8)

            original_width, original_height = original_size

            binary_mask = cv2.resize(
                binary_mask,
                (original_width, original_height),
                interpolation=cv2.INTER_NEAREST,
            )

            probability_map = cv2.resize(
                probability_map,
                (original_width, original_height),
                interpolation=cv2.INTER_LINEAR,
            )

            masks[class_name] = {
                "label": CLASS_LABELS[class_name],
                "mask": binary_mask,
                "probability": probability_map,
            }

        return {
            "image_path": image_path,
            "original_size": original_size,
            "masks": masks,
        }

    def summarize(self, prediction):

        results = []

        for class_name in CLASS_NAMES:

            item = prediction["masks"][class_name]

            mask = item["mask"]

            positive_pixels = int(
                np.count_nonzero(mask)
            )

            total_pixels = int(mask.size)

            percentage = (
                positive_pixels / total_pixels * 100.0
            )

            results.append(
                {
                    "class": class_name,
                    "label": item["label"],
                    "positive_pixels": positive_pixels,
                    "percentage": round(
                        percentage,
                        4,
                    ),
                }
            )

        return results