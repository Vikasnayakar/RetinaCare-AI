from pathlib import Path

import torch
from PIL import Image
from torchvision import transforms

from app.ai.grading.model import create_grading_model


SEVERITY = {
    0: "No DR",
    1: "Mild",
    2: "Moderate",
    3: "Severe",
    4: "Proliferative DR",
}


class DRGrader:
    def __init__(self, checkpoint: str):
        self.device = torch.device(
            "cuda" if torch.cuda.is_available() else "cpu"
        )

        checkpoint_path = Path(checkpoint)

        if not checkpoint_path.exists():
            raise FileNotFoundError(
                f"Model checkpoint not found: {checkpoint_path}"
            )

        self.model = create_grading_model(5)

        checkpoint_data = torch.load(
            checkpoint_path,
            map_location=self.device,
        )

        if isinstance(checkpoint_data, dict):
            if "model_state_dict" in checkpoint_data:
                checkpoint_data = checkpoint_data["model_state_dict"]
            elif "state_dict" in checkpoint_data:
                checkpoint_data = checkpoint_data["state_dict"]

        cleaned_state = {}

        for key, value in checkpoint_data.items():
            cleaned_state[key.replace("module.", "")] = value

        self.model.load_state_dict(cleaned_state)

        self.model.to(self.device)
        self.model.eval()

        self.transform = transforms.Compose(
            [
                transforms.Resize((224, 224)),
                transforms.ToTensor(),
                transforms.Normalize(
                    mean=[0.485, 0.456, 0.406],
                    std=[0.229, 0.224, 0.225],
                ),
            ]
        )

    def predict(self, image_path: str):
        image = Image.open(image_path).convert("RGB")

        tensor = self.transform(image).unsqueeze(0)
        tensor = tensor.to(self.device)

        with torch.no_grad():
            output = self.model(tensor)
            probabilities = torch.softmax(output, dim=1)

        confidence, prediction = torch.max(
            probabilities,
            dim=1,
        )

        grade = int(prediction.item())

        return {
            "grade": grade,
            "severity": SEVERITY[grade],
            "confidence": round(
                float(confidence.item()),
                4,
            ),
        }