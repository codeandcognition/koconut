import os
from app import app

HOST = os.getenv("HOST", "localhost")
PORT = os.getenv("PORT", 8080)

if __name__ == "__main__":
    # Make temp directory
    if not os.path.isdir("temp"):
        os.mkdir("temp")

    app.run(host=HOST, port=PORT)
