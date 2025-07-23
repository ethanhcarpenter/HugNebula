from flask import Flask, request, render_template,jsonify
import os
import sys

api_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../The AI/v0/API'))
if api_path not in sys.path:
    sys.path.insert(0, api_path)

from chatbot import LocalAIChatbot

model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../The AI/v0/Models/llama2.gguf'))
if not os.path.isfile(model_path):
    raise FileNotFoundError(f"Model file not found: {model_path}")

model_url="https://onedrive.live.com/personal/2642cb790e4d089e/_layouts/15/download.aspx?UniqueId=63ebabb3%2D8a2a%2D4a6c%2D9939%2Dba620551acf8"

chatbot = LocalAIChatbot(model_path=model_path, model_url=model_url)
app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def home():
    return render_template("index.html")

@app.route('/chat')
def chat():
    return render_template('chatPage.html')

@app.route("/query", methods=["POST"])
def sendquery():
    data = request.get_json()
    user_input = data.get("query", "")
    answer = None
    if user_input.strip():
        answer = chatbot.chat(user_input)
    return {"answer": answer}



if __name__ == "__main__":
    app.run(debug=True)
