from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class CustomHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        print(f"Requested path: {self.path}")
        return super().do_GET()

os.chdir(os.path.dirname(os.path.abspath(__file__)))
print(f"Serving from directory: {os.getcwd()}")
print("Available files:")
for file in os.listdir('.'):
    print(f" - {file}")

server = HTTPServer(('127.0.0.1', 8000), CustomHandler)
print("\nServer started at http://127.0.0.1:8000")
print("Try accessing:")
print(" - http://127.0.0.1:8000/login.html")
print(" - http://127.0.0.1:8000/index.html")
server.serve_forever()