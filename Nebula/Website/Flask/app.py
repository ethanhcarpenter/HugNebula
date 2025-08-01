from flask import Flask, Response, stream_with_context, request, render_template,jsonify
import os
import sys

api_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../The AI/v0/API'))
if api_path not in sys.path:
    sys.path.insert(0, api_path)

from chatbotHF import HFAIChatbot
from chatbotFile import FileAIChatbot

file=1


if file:
    chatbot = FileAIChatbot(model_path="D:\\WSL\\Ubuntu\\models\\llama2.gguf",n_gpu_layers=0)
else:
    chatbot = HFAIChatbot(
        repo_id="TheBloke/Luna-AI-Llama2-Uncensored-GGUF",
        filename="luna-ai-llama2-uncensored.Q2_K.gguf",
    )






app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/members')
def members():
    return render_template('members.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/nebula-ai')
def nebula_ai():
    return render_template('nebula-ai.html')



@app.route('/chat')
def chat():
    return render_template('chatPage.html')

@app.route("/resetChat", methods=["POST"])
def resetChat():
    chatbot.reset()
    return {"status": "success"}

@app.route("/query", methods=["POST"])
def sendquery():
    data = request.get_json()
    user_input = data.get("query", "")
    
    if not user_input.strip():
        return {"answer": ""}

    def generate():
        yield '{"answer":"'
        for response in chatbot.model.create_completion(
            prompt=chatbot._build_prompt() + user_input,
            max_tokens=128,
            stop=["User:", "AI:"],
            stream=True
        ):
            token = response["choices"][0]["text"]
            yield token.replace("\\", "\\\\").replace('"', '\\"')  # JSON-safe
        yield '"}'

    return Response(stream_with_context(generate()), mimetype='application/json')

@app.route("/history",methods=["Get"])
def getHistory():
    history=chatbot.getHistory()
    return {"history":history}




if __name__ == "__main__":
    app.run()
