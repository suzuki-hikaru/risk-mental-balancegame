from PIL import Image

img_name="enemypicto.png"
rate = 2

img = Image.open(img_name)

img_resize = img.resize((int(img.width / rate), int(img.height / rate)))
img_resize.save(img_name)