from PIL import Image
import sys
import io
import base64
import json

def trim_image(base64_image: str) -> str:
    bytes_image = base64.b64decode(base64_image)
    image = Image.open(io.BytesIO(bytes_image)).convert("RGBA")

    bbox = image.getbbox()
    if bbox:
        trimmed_image = image.crop(bbox)
    else:
        trimmed_image = image  # Se não houver conteúdo visível, mantém como está

    buffered = io.BytesIO()
    trimmed_image.save(buffered, format="PNG")
    base64_trimmed_image = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return base64_trimmed_image

if __name__ == "__main__":
    base64_image = sys.stdin.read().strip()
    base64_trimmed_image = trim_image(base64_image)

    print(json.dumps({
        "image": base64_trimmed_image
    }))
