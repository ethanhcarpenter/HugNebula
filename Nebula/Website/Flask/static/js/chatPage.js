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
            if (isTyping) return;  // Prevent submit while typing

            const userMsg = chatInput.value.trim();
            if (!userMsg) return;

            isTyping = true;
            chatInput.disabled = true;
            chatForm.querySelector('button[type="submit"]').disabled = true;

            addMessage(userMsg, 'user');
            chatInput.value = '';

            // Show typing indicator
            addMessage('Typing...', 'assistant');

            const removeTyping = () => {
                const lastMsg = chatMessages.lastChild;
                if (lastMsg && lastMsg.textContent === 'Typing...') {
                    chatMessages.removeChild(lastMsg);
                }
            };

            try {
                const response = await fetch('/query', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: userMsg })
                });

                const data = await response.json();
                removeTyping();
                addMessage(data.answer[0] || 'No response', 'assistant');
                addMessage(data.answer[1] || 'No response', 'DEBUG');
            } catch (error) {
                removeTyping();
                addMessage('Error: Could not get response.', 'DEBUG');
            } finally {
                isTyping = false;
                chatInput.disabled = false;
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
        msgDiv.style.background = sender === 'user' ? '#e0e7ef' : '#d6f5e3';
        if (sender === 'DEBUG') {
            msgDiv.style.background = '#e37373ff';
        }
        if (sender === 'user') {
            msgDiv.style.background = '#e0e7ef';
        }
        if (sender === 'assistant') {
            msgDiv.style.background = '#d6f5e3';
        }
        msgDiv.style.alignSelf = sender === 'assistant' ? 'flex-end' : 'flex-start';
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function loadHistory() {
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

});
