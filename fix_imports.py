import os

folder = r"E:\AI-Driven Crime Analytics & Visualization Platform\backend"
for root, _, files in os.walk(folder):
    for f in files:
        if f.endswith(".py"):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            if 'backend.app' in content:
                new_content = content.replace('backend.app', 'app')
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                print(f"Updated {path}")
