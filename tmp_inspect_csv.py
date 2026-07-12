import csv
from pathlib import Path
path = Path('data/processed/crimes_sample.csv')
print('exists', path.exists())
if path.exists():
    with path.open(newline='', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader, [])
        print('columns=', header)
        for i,row in enumerate(reader):
            if i >= 5:
                break
            print(row)
