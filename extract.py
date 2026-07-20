import json
with open('C:\\Users\\aman kumar jha\\.gemini\\antigravity\\brain\\95b99d40-c3f1-4c37-8159-b91dfbe8fd77\\.system_generated\\logs\\transcript.jsonl', 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
            if 'tool_calls' in data:
                for tc in data['tool_calls']:
                    if tc['name'] in ['replace_file_content', 'multi_replace_file_content']:
                        print(f"File: {tc['args'].get('TargetFile')} in step {data.get('step_index')}")
        except:
            pass
