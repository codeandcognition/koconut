import os
from app import app

HOST = os.getenv("HOST", "localhost")
PORT = os.getenv("PORT", 8000)
CERT = os.getenv("CERT", "")
KEY = os.getenv("KEY", "")

if __name__ == "__main__":
    # Make temp directory
    if not os.path.isdir("temp"):
        os.mkdir("temp")

    app.run(host=HOST, port=PORT)
    # app.run(ssl_context=(CERT, KEY), host=HOST, port=PORT)
