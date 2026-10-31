import os
import math
from PIL import Image, ImageDraw

def create_taskora_icon(size=512):
    # Render at 4x resolution for smooth anti-aliased antialiasing
    scale = 4
    canvas_size = size * scale
    img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Padding
    pad = int(canvas_size * 0.08)
    x0, y0 = pad, pad
    x1, y1 = canvas_size - pad, canvas_size - pad
    radius = int(canvas_size * 0.22)

    # Gradient squircle
    # We create a mask for rounded rectangle
    mask = Image.new("L", (canvas_size, canvas_size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([x0, y0, x1, y1], radius=radius, fill=255)

    # Generate gradient: Indigo (#4f46e5 -> (79, 70, 229)) to Sky (#0284c7 -> (2, 132, 199))
    grad = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    grad_draw = ImageDraw.Draw(grad)
    for y in range(canvas_size):
        ratio = y / canvas_size
        r = int(79 * (1 - ratio) + 2 * ratio)
        g = int(70 * (1 - ratio) + 132 * ratio)
        b = int(229 * (1 - ratio) + 199 * ratio)
        grad_draw.line([(0, y), (canvas_size, y)], fill=(r, g, b, 255))

    # Composite gradient with squircle mask
    img.paste(grad, (0, 0), mask)

    # Draw checkmark
    # Coordinates normalized:
    # Point 1 (start): (0.28, 0.52)
    # Point 2 (bottom corner): (0.43, 0.67)
    # Point 3 (end): (0.74, 0.34)
    p1 = (int(canvas_size * 0.28), int(canvas_size * 0.52))
    p2 = (int(canvas_size * 0.43), int(canvas_size * 0.67))
    p3 = (int(canvas_size * 0.73), int(canvas_size * 0.34))

    stroke_w = int(canvas_size * 0.085)

    # Draw checkmark stroke with rounded ends
    draw.line([p1, p2, p3], fill=(255, 255, 255, 255), width=stroke_w, joint="round")
    draw.ellipse([p1[0] - stroke_w//2, p1[1] - stroke_w//2, p1[0] + stroke_w//2, p1[1] + stroke_w//2], fill=(255, 255, 255, 255))
    draw.ellipse([p3[0] - stroke_w//2, p3[1] - stroke_w//2, p3[0] + stroke_w//2, p3[1] + stroke_w//2], fill=(255, 255, 255, 255))

    # Glowing Cyan spark circle at top of checkmark: #38bdf8 -> (56, 189, 248)
    spark_radius = int(canvas_size * 0.055)
    cx, cy = p3
    draw.ellipse([cx - spark_radius, cy - spark_radius, cx + spark_radius, cy + spark_radius], fill=(56, 189, 248, 255))

    # Downscale with Lanczos filter for crisp anti-aliasing
    final_img = img.resize((size, size), Image.Resampling.LANCZOS)
    return final_img

def main():
    os.makedirs("resources", exist_ok=True)
    os.makedirs("build", exist_ok=True)
    os.makedirs("src/renderer/public", exist_ok=True)

    img_512 = create_taskora_icon(512)
    img_512.save("resources/icon.png", format="PNG")
    img_512.save("build/icon.png", format="PNG")
    img_512.save("src/renderer/public/logo.png", format="PNG")

    # Generate multi-resolution ICO
    ico_sizes = [(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    img_512.save("resources/icon.ico", format="ICO", sizes=ico_sizes)
    img_512.save("build/icon.ico", format="ICO", sizes=ico_sizes)
    img_512.save("src/renderer/public/favicon.ico", format="ICO", sizes=[(16, 16), (32, 32)])

    # Also write logo.svg in public
    svg_content = '''<svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="24" height="24" rx="6" fill="url(#taskora-gradient)"/>
  <path d="M6.5 12.5L10 16L17.5 8" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="17.5" cy="8" r="1.5" fill="#38bdf8"/>
  <defs>
    <linearGradient id="taskora-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
      <stop stop-color="#4f46e5"/>
      <stop offset="1" stop-color="#0284c7"/>
    </linearGradient>
  </defs>
</svg>'''
    with open("src/renderer/public/logo.svg", "w", encoding="utf-8") as f:
        f.write(svg_content)

    print("Taskora icons generated successfully!")

if __name__ == "__main__":
    main()
