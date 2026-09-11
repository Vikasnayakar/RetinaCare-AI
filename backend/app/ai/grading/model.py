import torch.nn as nn
from torchvision.models import efficientnet_b0


def create_grading_model(num_classes: int = 5):
    model = efficientnet_b0(weights=None)

    model.classifier[1] = nn.Linear(
        model.classifier[1].in_features,
        num_classes,
    )

    return model