import base64
from pathlib import Path
from PIL import Image
from io import BytesIO
from docxtpl import DocxTemplate

"./documents/template_contrat.docx"


def base64_png_to_buffer(image: str) -> BytesIO:
    image_data = image.split(",", 1)[1]
    return BytesIO(base64.b64decode(image_data))
    # with BytesIO() as output:
    #     img = Image.open(), kind="bound")
    #     img.save(output, format="PNG")
    #     contents = output.getvalue()
    # return contents


def generate_contract_for_user(
    template_path, user_infos, date, lieu_temoignage, output_path: Path
):
    doc = DocxTemplate(template_path)

    context = {
        "nom_temoin": user_infos.user_name,
        "adresse_temoin": user_infos.user_postal_address,
        "telephone_temoin": user_infos.user_phone,
        "courriel_temoin": user_infos.user_email,
        "lieu_temoignage": lieu_temoignage,
        "date_temoignage": date,
    }
    doc.replace_pic("signature_simple.png", base64_png_to_buffer(user_infos.signature))

    doc.render(context)
    doc.save(output_path)
