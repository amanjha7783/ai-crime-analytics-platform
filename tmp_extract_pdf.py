from pathlib import Path
from PyPDF2 import PdfReader
path = Path(r'D:\Users\aman kumar jha\Downloads\Police_FIR_ER_Diagram.pdf')
print(path.exists())
reader = PdfReader(str(path))
print('pages', len(reader.pages))
for i, page in enumerate(reader.pages):
    text = page.extract_text() or ''
    print('--- PAGE', i+1, '---')
    print(text[:1200])
