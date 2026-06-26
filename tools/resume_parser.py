import fitz


def load_resume(path):

    doc = fitz.open(path)

    text = ""

    for page in doc:
        text += page.get_text()

    doc.close()

    return text.strip()
