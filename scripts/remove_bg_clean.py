import sys
from rembg import remove, new_session
from PIL import Image

def process_image(input_path, output_path):
    try:
        session = new_session("u2net")
        input_image = Image.open(input_path)
        output_image = remove(
            input_image, 
            session=session,
            alpha_matting=True,
            alpha_matting_foreground_threshold=240,
            alpha_matting_background_threshold=10,
            alpha_matting_erode_size=10
        )
        output_image.save(output_path)
        print(f"Successfully processed {input_path} -> {output_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

if __name__ == "__main__":
    process_image(sys.argv[1], sys.argv[2])
