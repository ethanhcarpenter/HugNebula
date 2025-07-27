from flask import Flask, request, render_template,jsonify
import os
import sys

api_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../The AI/v0/API'))
if api_path not in sys.path:
    sys.path.insert(0, api_path)

from chatbot import LocalAIChatbot

# chatbot = LocalAIChatbot(
#     repo_id="DavidAU/Llama-3.2-8X3B-MOE-Dark-Champion-Instruct-uncensored-abliterated-18.4B-GGUF",
# 	filename="L3.2-8X3B-MOE-Dark-Champion-Inst-18.4B-uncen-ablit_D_AU-Q4_k_m.gguf",
# )

# chatbot = LocalAIChatbot(
#     repo_id="TheBloke/Luna-AI-Llama2-Uncensored-GGUF",
# 	filename="luna-ai-llama2-uncensored.Q2_K.gguf",
# )
# chatbot = LocalAIChatbot(
#     repo_id="TheBloke/WizardLM-30B-Uncensored-GGUF",
# 	filename="WizardLM-30B-Uncensored.Q6_K.gguf",
# )
chatbot = LocalAIChatbot(
    repo_id="unsloth/Phi-4-reasoning-plus-GGUF",
	filename="Phi-4-reasoning-plus-UD-Q6_K_XL.gguf",
)


# chatbot = LocalAIChatbot(filename="S:\\WSL\\Ubuntu\\models\\llama2.gguf")


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
    answer = None
    if user_input.strip():
        answer = chatbot.chat(user_input)
    return {"answer": answer}

@app.route("/history",methods=["Get"])
def getHistory():
    history=chatbot.getHistory()
    return {"history":history}




if __name__ == "__main__":
    app.run()
