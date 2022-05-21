import base64
from PIL import Image
from io import BytesIO
from reportlab.pdfgen import canvas
from PyPDF2 import PdfFileWriter, PdfFileReader

# Create the watermark from an image


def generate_image_from_base64(image: BytesIO):
    img = Image(Image.open(BytesIO(base64.b64decode(image)), kind="bound"))
    return img


def generate_first_reportlab_page(name, address, phone, email):
    c = canvas.Canvas("page1.pdf")
    c.drawString(15, 720, name)
    c.drawString(25, 720, address)
    c.drawString(35, 720, phone)
    c.drawString(45, 720, email)
    c.save()


def generate_second_reportlab_page(date, location, name, signature):
    c = canvas.Canvas("page2.pdf")
    c.drawImage(signature, 15, 720)
    c.save()
