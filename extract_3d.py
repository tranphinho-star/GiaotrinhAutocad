import sys

input_file = r"D:\BackendFrontend\GiaotrinhAutocad\Giao trinh Autocad 3D.pdf"
output_file = r"D:\BackendFrontend\GiaotrinhAutocad\extracted_3d.txt"

try:
    import fitz # PyMuPDF
    doc = fitz.open(input_file)
    text = ""
    for page in doc:
        text += page.get_text()
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(text)
    print("Extracted using fitz")
except ImportError:
    try:
        import PyPDF2
        with open(input_file, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(text)
        print("Extracted using PyPDF2")
    except Exception as e:
        print(f"Error: {e}")
