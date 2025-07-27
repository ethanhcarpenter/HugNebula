document.addEventListener('DOMContentLoaded', () => {
    const heading = document.getElementById('heading');
    if (heading) {
        const fullText = heading.textContent;
        heading.textContent = '';
        let i = 0;
        function typeChar() {
            if (i <= fullText.length) {
                heading.textContent = fullText.slice(0, i);
                i++;
                setTimeout(typeChar, 55);
            }
        }
        setTimeout(typeChar, 300);
    }

    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    let isTyping = false;

    if (chatForm) {
        chatForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            if (isTyping) return;

            const userMsg = chatInput.value.trim();
            if (!userMsg) return;

            isTyping = true;
            chatForm.querySelector('button[type="submit"]').disabled = true;

            addMessage(userMsg, 'user');
            chatInput.value = '';

            // Add an empty assistant message to stream into with initial "Thinking"
            addMessage('Thinking', 'assistant');
            const assistantMsg = chatMessages.lastChild;

            // Start thinking animation
            let dots = 0;
            let thinkingInterval = setInterval(() => {
                dots = (dots + 1) % 4; // 0 to 3 dots
                assistantMsg.textContent = 'Thinking' + '.'.repeat(dots);
            }, 500);

            try {
                const response = await fetch('/query', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: userMsg })
                });

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let fullText = '';
                let isFirst = true;
                let lastChunkTime = performance.now();

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const now = performance.now();
                    const delta = now - lastChunkTime;
                    lastChunkTime = now;

                    let chunk = decoder.decode(value, { stream: true });

                    if (isFirst) {
                        clearInterval(thinkingInterval);  // Stop thinking animation on first token
                        chunk = chunk.replace(/^{"answer":"?/, '');
                        isFirst = false;
                    }

                    // Adaptive delay per character based on chunk time
                    const baseDelay = Math.min(100, Math.max(5, delta / (chunk.length || 1)));

                    for (let char of chunk) {
                        fullText += char;
                        assistantMsg.textContent = fullText.replace(/"?\}$/, '');
                        await new Promise(r => setTimeout(r, baseDelay));
                    }
                }
            } catch (error) {
                clearInterval(thinkingInterval);
                assistantMsg.textContent = 'Error: Could not get response.';
                assistantMsg.style.background = '#ef4444';
            } finally {
                clearInterval(thinkingInterval);
                isTyping = false;
                chatForm.querySelector('button[type="submit"]').disabled = false;
            }
        });
    }




    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.textContent = text;
        msgDiv.style.margin = '6px 0';
        msgDiv.style.padding = '8px 12px';
        msgDiv.style.borderRadius = '6px';
        msgDiv.style.maxWidth = '80%';
        msgDiv.style.wordBreak = 'break-word';

        if (sender === 'user') {
            msgDiv.style.background = '#3b82f6';  // strong blue
            msgDiv.style.color = '#fff';          // white text
            msgDiv.style.alignSelf = 'flex-start';
        } else if (sender === 'assistant') {
            msgDiv.style.background = '#10b981';  // strong green
            msgDiv.style.color = '#fff';           // white text
            msgDiv.style.alignSelf = 'flex-end';
        } else if (sender === 'DEBUG') {
            msgDiv.style.background = '#ef4444';  // bright red
            msgDiv.style.color = '#fff';           // white text
            msgDiv.style.alignSelf = 'center';
        } else {
            msgDiv.style.background = '#cccccc';  // fallback grey
            msgDiv.style.color = '#000';
            msgDiv.style.alignSelf = 'flex-start';
        }

        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    function clearChatMessages() {
        while (chatMessages.firstChild) {
            chatMessages.removeChild(chatMessages.firstChild);
        }
    }

    document.getElementById('resetChat').addEventListener('click', async () => {
        await fetch('/resetChat', { method: 'POST' });
        loadHistory();
    });



    async function loadHistory() {
        clearChatMessages();
        try {
            const response = await fetch('/history');
            const data = await response.json();
            if (Array.isArray(data.history)) {
                data.history.forEach(entry => {
                    addMessage(entry.content, entry.role);
                });
            }
        } catch (error) {
            console.error('Failed to load history:', error);
        }
    }
    loadHistory();
});
