import os
from app import app

HOST = os.getenv("HOST", "localhost")
PORT = os.getenv("PORT", 8080)

if __name__ == "__main__":
    app.run(host=HOST, port=PORT)
