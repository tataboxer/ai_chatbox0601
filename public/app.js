document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.getElementById('messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    let conversationHistory = []; // 用于存储对话历史

    // 加载历史对话
    function loadConversationHistory() {
        const history = localStorage.getItem('conversationHistory');
        if (history) {
            conversationHistory = JSON.parse(history);
            conversationHistory.forEach(msg => {
                addMessage(msg.role, msg.content, msg.timestamp, false); // 不保存到历史，因为已经存在
            });
        }
    }

    // 保存历史对话
    function saveConversationHistory() {
        localStorage.setItem('conversationHistory', JSON.stringify(conversationHistory));
    }

    function addMessage(role, content = '', timestamp = new Date(), save = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;

        const messageContentDiv = document.createElement('div');
        messageContentDiv.className = 'message-content';
        messageContentDiv.textContent = content;
        messageDiv.appendChild(messageContentDiv);

        const timeDiv = document.createElement('div');
        timeDiv.className = 'timestamp';
        timeDiv.textContent = new Date(timestamp).toLocaleString();
        messageDiv.appendChild(timeDiv);

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        if (save) {
            conversationHistory.push({ role, content, timestamp });
            saveConversationHistory();
        }

        return messageContentDiv; // 返回消息内容元素，以便后续更新
    }

    async function sendMessage() {
        const content = userInput.value.trim();
        if (!content) return;

        const userMessageContent = content;
        addMessage('user', userMessageContent);
        userInput.value = '';

        // 将用户消息添加到对话历史，这里不需要再次保存，因为addMessage已经处理了
        // conversationHistory.push({ role: 'user', content: userMessageContent, timestamp: new Date() });
        // saveConversationHistory();

        try {
            const response = await fetch('/server.js', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: '你是一位专业的生活教练，帮助用户解决生活问题。回复内容不超过200字' },
                        { role: 'user', content: content }
                    ]
                })
            });

            // 处理流式响应
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = '';
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value);
                // 流式响应可能包含多行，每行以 data: 开头
                chunk.split('\n').forEach(line => {
                    if (line.startsWith('data: ')) {
                        const jsonStr = line.substring(6).trim();
                        if (jsonStr === '[DONE]') {
                            return; // 流结束
                        }
                        try {
                            const data = JSON.parse(jsonStr);
                            if (data.choices && data.choices[0].delta && data.choices[0].delta.content) {
                                assistantMessage += data.choices[0].delta.content;
                                // 更新消息内容
                                let lastMessageContent = messagesContainer.querySelector('.message.assistant:last-child .message-content');
                                if (!lastMessageContent) {
                                    // 如果是新消息，addMessage会处理保存
                                    lastMessageContent = addMessage('assistant', '', new Date(), true); 
                                } else {
                                    // 如果是更新现有消息，需要更新conversationHistory中的内容
                                    const lastMessageIndex = conversationHistory.length - 1;
                                    if (lastMessageIndex >= 0 && conversationHistory[lastMessageIndex].role === 'assistant') {
                                        conversationHistory[lastMessageIndex].content = assistantMessage;
                                        saveConversationHistory();
                                    }
                                }
                                if (lastMessageContent) {
                                    lastMessageContent.textContent = assistantMessage;
                                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                                }
                            }
                        } catch (e) {
                            console.error('解析错误:', e, '原始数据:', jsonStr);
                        }
                    }
                });
            }
        } catch (error) {
            addMessage('system', '发生错误: ' + error.message);
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // 页面加载时加载历史对话
    loadConversationHistory();
});
