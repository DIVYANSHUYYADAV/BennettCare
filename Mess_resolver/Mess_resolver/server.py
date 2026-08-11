#!/usr/bin/env python3
"""
BennettCare – Local Development Server
Run: python3 server.py
Then open: http://localhost:8080
"""
import http.server
import socketserver
import os
import webbrowser
import threading

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        # Clean request log
        print(f"  → {self.address_string()} — {format % args}")

    def end_headers(self):
        # Add CORS and cache headers to prevent browser security blocks
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

def open_browser():
    import time
    time.sleep(0.8)
    webbrowser.open(f"http://localhost:{PORT}")

if __name__ == "__main__":
    os.chdir(DIRECTORY)
    print("\n" + "="*52)
    print("  🏥  BennettCare – Local Development Server")
    print("="*52)
    print(f"  ✅  Server running at: http://localhost:{PORT}")
    print(f"  📁  Serving from:      {DIRECTORY}")
    print("  🛑  Stop server:       Ctrl + C")
    print("="*52 + "\n")

    # Open browser automatically
    threading.Thread(target=open_browser, daemon=True).start()

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        httpd.allow_reuse_address = True
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n  🛑  Server stopped. Goodbye!\n")
