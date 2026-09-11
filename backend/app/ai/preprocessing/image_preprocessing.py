from pathlib import Path

import cv2
import numpy as np


def load_image(image_path: str) -> np.ndarray:
    """
    Load a fundus image from disk.

    Returns:
        RGB image as a NumPy array.
    """
    image = cv2.imread(image_path)

    if image is None:
        raise ValueError(f"Unable to read image: {image_path}")

    return cv2.cvtColor(image, cv2.COLOR_BGR2RGB)


def resize_image(
    image: np.ndarray,
    size: tuple[int, int] = (512, 512),
) -> np.ndarray:
    """
    Resize image to the requested dimensions.
    """
    width, height = size

    return cv2.resize(
        image,
        (width, height),
        interpolation=cv2.INTER_AREA,
    )


def crop_black_borders(
    image: np.ndarray,
    threshold: int = 10,
) -> np.ndarray:
    """
    Remove excessive black borders around a fundus image.
    """

    gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)

    mask = gray > threshold

    coordinates = np.argwhere(mask)

    if coordinates.size == 0:
        return image

    y_min, x_min = coordinates.min(axis=0)
    y_max, x_max = coordinates.max(axis=0)

    return image[
        y_min:y_max + 1,
        x_min:x_max + 1,
    ]


def normalize_image(image: np.ndarray) -> np.ndarray:
    """
    Normalize pixel values from [0, 255] to [0, 1].
    """

    return image.astype(np.float32) / 255.0


def preprocess_fundus_image(
    image_path: str,
    size: tuple[int, int] = (512, 512),
) -> np.ndarray:
    """
    Complete preprocessing pipeline for a fundus image.

    Steps:
        1. Load image
        2. Convert BGR → RGB
        3. Remove black borders
        4. Resize
        5. Normalize pixels

    Returns:
        Float32 RGB image with values between 0 and 1.
    """

    image = load_image(image_path)

    image = crop_black_borders(image)

    image = resize_image(
        image,
        size=size,
    )

    image = normalize_image(image)

    return image


def save_preprocessed_image(
    image: np.ndarray,
    output_path: str,
) -> str:
    """
    Save a preprocessed image to disk.

    The input image is expected to contain
    normalized values in the range [0, 1].
    """

    output = np.clip(
        image * 255.0,
        0,
        255,
    ).astype(np.uint8)

    output = cv2.cvtColor(
        output,
        cv2.COLOR_RGB2BGR,
    )

    output_path = str(Path(output_path))

    success = cv2.imwrite(
        output_path,
        output,
    )

    if not success:
        raise ValueError(
            f"Unable to save preprocessed image: {output_path}"
        )

    return output_path