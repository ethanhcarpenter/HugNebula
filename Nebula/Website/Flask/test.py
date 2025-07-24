from flask import Flask, request, render_template,jsonify
import os
import sys

api_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../The AI/v0/API'))
if api_path not in sys.path:
    sys.path.insert(0, api_path)

from chatbot import LocalAIChatbot

model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../The AI/v0/Models/llama2.gguf'))
model_url="https://onedrive.live.com/personal/2642cb790e4d089e/_layouts/15/download.aspx?UniqueId=63ebabb3%2D8a2a%2D4a6c%2D9939%2Dba620551acf8"

chatbot = LocalAIChatbot(model_path=model_path,model_url=model_url)

answer = chatbot.chat("hi im Ethan, how are you?")
print(answer)