"""Privacy processing: face detection + blur (privacy-by-design, safety measure only).

Automated redaction is a safety measure, NOT a mathematical guarantee.
Do not claim 100% privacy protection from automated detection.
"""
import io
import cv2
import numpy as np
from PIL import Image


def _load_cascade():
    # Bundled Haar cascade; acceptable for MVP face detection.
    path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    return cv2.CascadeClassifier(path)


def redact_faces(image_bytes: bytes, blur_kernel: int = 31) -> tuple[bytes, int]:
    """Return (redacted_image_bytes, number_of_faces_detected)."""
    cascade = _load_cascade()
    arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not decode image for privacy processing")

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(40, 40))

    for (x, y, w, h) in faces:
        face = img[y:y + h, x:x + w]
        # pixelate + gaussian blur for stronger obscuring
        small = cv2.resize(face, (max(8, w // 10), max(8, h // 10)),
                           interpolation=cv2.INTER_LINEAR)
        blurred = cv2.GaussianBlur(small, (5, 5), 0)
        blurred = cv2.resize(blurred, (w, h), interpolation=cv2.INTER_NEAREST)
        img[y:y + h, x:x + w] = blurred

    ok, buf = cv2.imencode(".jpg", img, [int(cv2.IMWRITE_JPEG_QUALITY), 85])
    if not ok:
        raise ValueError("Failed to encode redacted image")
    return buf.tobytes(), int(len(faces))
