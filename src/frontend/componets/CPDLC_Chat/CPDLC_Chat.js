class ChatComponent {
    constructor() {
        this.container = document.getElementById('chat-container');
        this.messagesContainer = document.getElementById('chat-messages');
        this.messageInput = document.getElementById('message-input');
        this.form = document.getElementById('message-form');

        this.initialize();
    }

    initialize() {
        this.setupEventListeners();
        this.connectToBackend();
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

    connectToBackend() {
        // Implement WebSocket or API call to receive messages
        // Example using WebSocket:
        const ws = new WebSocket('ws://localhost:8080/chat');

        ws.onmessage = (event) => {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message';
            messageDiv.textContent = event.data;
            this.messagesContainer.appendChild(messageDiv);
        };
    }

    sendMessage(message) {
        // Implement sending message to backend
        fetch('/api/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        }).then((response) => {
            if (!response.ok) throw new Error('Failed to send message');
        });
    }
}

// Initialize the chat component when the page loads
window.addEventListener('load', () => {
    new ChatComponent();
});
