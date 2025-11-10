export function initializeChat() {
    class ChatComponent {
        constructor() {
            this.container = document.getElementById('messages-section');
            this.messageList = document.getElementById('message-list');
            this.form = document.getElementById('message-input-form');

            if (!this.container || !this.messageList || !this.form) {
                console.error('Chat component elements not found');
                return;
            }

            this.messageInput = this.form.querySelector('#message-content');

            this.setupEventListeners();
            this.loadInitialMessages();
        }

        setupEventListeners() {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                const message = this.messageInput.value.trim();
                if (message) {
                    this.sendMessage(message);
                    this.messageInput.value = '';
                }
            });
        }

        async loadInitialMessages() {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.warn('No authentication token found');
                    return;
                }

                const response = await fetch('http://localhost:3000/api/messages/history', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const messages = await response.json();
                this.displayMessages(messages);
            } catch (error) {
                console.error('Failed to load initial messages:', error);
                if (this.messageList) {
                    this.messageList.innerHTML = '<li class="error">Failed to load messages</li>';
                }
            }
        }

        displayMessages(messages) {
            if (!this.messageList) return;

            this.messageList.innerHTML = '';

            messages.forEach(message => {
                const messageItem = document.createElement('li');
                messageItem.className = 'message-item';
                messageItem.innerHTML = `
                    <div class="message-header">
                        <span class="message-sender">${message.sender}</span>
                        <span class="message-timestamp">${new Date(message.timestamp).toLocaleString()}</span>
                    </div>
                    <div class="message-content">${message.content}</div>
                `;
                this.messageList.appendChild(messageItem);
            });
        }

        async sendMessage(message) {
            try {
                const token = localStorage.getItem('token');
                const recipient = this.form.querySelector('#recipient').value;
                const messageType = this.form.querySelector('#message-type').value;

                const response = await fetch('http://localhost:3000/api/messages/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        recipient: recipient,
                        content: message,
                        type: messageType
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to send message');
                }

                // Reload messages after sending
                this.loadInitialMessages();
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    }

    new ChatComponent();
}
