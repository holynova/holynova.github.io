#!/usr/bin/env python3
import http.server
import json
import os
import socketserver
import urllib.parse

PORT = 8088
DIRECTORY = "/Users/sym/Code/holynova.github.io"

def update_repos_visibility(liked_list):
    repos_path = os.path.join(DIRECTORY, 'data', 'repos.json')
    store_path = os.path.join(DIRECTORY, 'data', 'repos-store.js')
    
    if not os.path.exists(repos_path):
        return
    
    with open(repos_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    liked_set = set(liked_list)
    visible_count = 0
    hidden_count = 0
    
    for cat in data.get('categories', []):
        for repo in cat.get('repos', []):
            if repo.get('name') in liked_set:
                repo['hidden'] = False
                repo['is_featured'] = True
                visible_count += 1
            else:
                repo['hidden'] = True
                repo['is_featured'] = False
                hidden_count += 1
                
    with open(repos_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    with open(store_path, 'w', encoding='utf-8') as f:
        f.write('(typeof window !== "undefined" ? window : global).store = ' + json.dumps(data) + ';')
        
    print(f"[REPOS UPDATED] Marked {visible_count} projects as VISIBLE (featured) and {hidden_count} as HIDDEN.")

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        if parsed_url.path == '/api/sync-likes':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                liked_repos = json.loads(post_data.decode('utf-8'))
                likes_file = os.path.join(DIRECTORY, 'data', 'user-likes.json')
                with open(likes_file, 'w', encoding='utf-8') as f:
                    json.dump(liked_repos, f, indent=2, ensure_ascii=False)
                print(f"[SYNC] Successfully received {len(liked_repos)} liked repos from browser and saved to {likes_file}")
                
                # Apply hidden flags to data/repos.json
                update_repos_visibility(liked_repos)
                
                # Send JSON response
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "ok", "count": len(liked_repos)}).encode('utf-8'))
                return
            except Exception as e:
                print(f"[SYNC ERROR] {e}")
                self.send_response(500)
                self.end_headers()
                return

        self.send_response(404)
        self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        httpd.serve_forever()
