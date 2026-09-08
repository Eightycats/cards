from PIL import Image
import os

# === CONFIG ===
input_folder = "img_original"
output_folder = "img_resized"
target_width = 256

# === Ensure output folder exists ===
os.makedirs(output_folder, exist_ok=True)

# === Process each image ===
for filename in os.listdir(input_folder):
    if filename.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
        img_path = os.path.join(input_folder, filename)
        img = Image.open(img_path)

        # Maintain aspect ratio
        w_percent = target_width / float(img.size[0])
        target_height = int(float(img.size[1]) * w_percent)
        resized = img.resize((target_width, target_height), Image.LANCZOS)

        output_path = os.path.join(output_folder, filename)
        resized.save(output_path)

        print(f"Resized: {filename} -> {target_width}px wide")

print("✅ All images resized.")

