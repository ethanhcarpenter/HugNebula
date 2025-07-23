import os
import requests
from llama_cpp import Llama

class LocalAIChatbot:
    def __init__(self, model_path="", model_url=None, n_ctx=2048, n_gpu_layers=-1):
        if not model_path:
            raise ValueError("A valid model_path must be provided.")

        # Ensure model is present
        if not os.path.isfile(model_path):
            if not model_url:
                raise FileNotFoundError(f"Model not found at {model_path} and no URL provided.")
            self._download_model(model_url, model_path)

        # Initialize model only after it is confirmed to exist
        self.model = Llama(
            model_path=model_path,
            n_ctx=n_ctx,
            n_gpu_layers=n_gpu_layers,
            n_threads=os.cpu_count(),
            n_batch=512
        )
        self.chat_history = []

    def _download_model(self, url, path):
        print(f"Downloading model from {url}...")
        response = requests.get(url, stream=True)
        # Fail fast on HTTP errors
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        print("Model download complete.")

    def chat(self, user_message, max_tokens=128):
        self.chat_history.append({"role": "user", "content": user_message})
        prompt = self._build_prompt()
        response = self.model(prompt, max_tokens=max_tokens, stop=["User:", "AI:"])
        ai_response = response["choices"][0]["text"].strip()
        if ai_response.lower().startswith("ai:"):
            ai_response = ai_response[3:].strip()
        self.chat_history.append({"role": "assistant", "content": ai_response})
        return ai_response, prompt

    def _build_prompt(self, history_limit=30):
        prompt = "The following is a conversation between a helpful AI assistant and a user.\n"
        for entry in self.chat_history[-history_limit * 2:]:
            role = "AI" if entry["role"] == "assistant" else "User"
            prompt += f"{role}: {entry['content']}\n"
        prompt += "AI:"
        return prompt

    def reset(self):
        self.chat_history = []
