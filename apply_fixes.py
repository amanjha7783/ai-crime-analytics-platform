import json
import os

transcript_path = 'C:\\Users\\aman kumar jha\\.gemini\\antigravity\\brain\\95b99d40-c3f1-4c37-8159-b91dfbe8fd77\\.system_generated\\logs\\transcript.jsonl'

def apply_edit(step_num):
    with open(transcript_path, 'r') as f:
        for line in f:
            try:
                data = json.loads(line)
                if data.get('step_index') == step_num:
                    for tc in data['tool_calls']:
                        args = tc['args']
                        target_file = args.get('TargetFile')
                        
                        if tc['name'] == 'replace_file_content':
                            with open(target_file, 'r', encoding='utf-8') as tf:
                                content = tf.read()
                            
                            start = int(args['StartLine'])
                            end = int(args['EndLine'])
                            target = args['TargetContent']
                            replacement = args['ReplacementContent']
                            
                            lines = content.split('\n')
                            before = '\n'.join(lines[:start-1])
                            after = '\n'.join(lines[end:])
                            
                            new_content = (before + '\n' + replacement + '\n' + after).strip()
                            with open(target_file, 'w', encoding='utf-8') as tf:
                                tf.write(new_content)
                            print(f"Applied single replace to {target_file}")
                            
                        elif tc['name'] == 'multi_replace_file_content':
                            with open(target_file, 'r', encoding='utf-8') as tf:
                                content = tf.read()
                            
                            chunks = args['ReplacementChunks']
                            # Sort chunks in reverse to avoid offset issues
                            chunks.sort(key=lambda x: int(x['StartLine']), reverse=True)
                            
                            lines = content.split('\n')
                            for chunk in chunks:
                                start = int(chunk['StartLine'])
                                end = int(chunk['EndLine'])
                                replacement = chunk['ReplacementContent']
                                
                                before = '\n'.join(lines[:start-1])
                                after = '\n'.join(lines[end:])
                                lines = (before + '\n' + replacement + '\n' + after).split('\n')
                                
                            new_content = '\n'.join(lines)
                            with open(target_file, 'w', encoding='utf-8') as tf:
                                tf.write(new_content)
                            print(f"Applied multi replace to {target_file}")
            except Exception as e:
                pass

apply_edit(251)
apply_edit(254)
apply_edit(257)

