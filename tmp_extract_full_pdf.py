from pathlib import Path
from PyPDF2 import PdfReader
path = Path(r'D:\Users\aman kumar jha\Downloads\Police_FIR_ER_Diagram.pdf')
reader = PdfReader(str(path))
out = Path('erd_full_text.txt')
with out.open('w', encoding='utf-8') as f:
    f.write(f'pages {len(reader.pages)}\n')
    for i, page in enumerate(reader.pages):
        text = page.extract_text() or ''
        f.write('--- PAGE ' + str(i+1) + ' ---\n')
        f.write(text + '\n')
print('wrote', out.resolve())
