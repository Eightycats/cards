from PIL import Image
import os
import shutil

# === CONFIG ===
input_folder = "img_resize"
output_base = "img"
archive_base = "img_original"
target_width = 256

# === Process each image in subfolders ===
processed = 0
for dirpath, dirnames, filenames in os.walk(input_folder):
    rel_dir = os.path.relpath(dirpath, input_folder)
    if rel_dir == ".":
        rel_dir = ""

    for filename in filenames:
        if not filename.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
            continue

        src_path = os.path.join(dirpath, filename)

        # Determine output and archive paths preserving subfolder structure
        output_dir = os.path.join(output_base, rel_dir) if rel_dir else output_base
        archive_dir = os.path.join(archive_base, rel_dir) if rel_dir else archive_base
        os.makedirs(output_dir, exist_ok=True)
        os.makedirs(archive_dir, exist_ok=True)

        output_path = os.path.join(output_dir, filename)
        archive_path = os.path.join(archive_dir, filename)

        # Resize and save
        img = Image.open(src_path)
        w_percent = target_width / float(img.size[0])
        target_height = int(float(img.size[1]) * w_percent)
        resized = img.resize((target_width, target_height), Image.LANCZOS)
        resized.save(output_path)

        # Archive the original
        shutil.copy2(src_path, archive_path)

        # Remove processed source file
        os.remove(src_path)

        print(f"Resized: {os.path.join(rel_dir, filename)} -> {output_path}")
        processed += 1

if processed:
    print(f"\nDone! {processed} image(s) processed.")
else:
    print("No images found to process.")
