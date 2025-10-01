class MessageHistory {
    constructor() {
        this.container = document.getElementById('message-history');

        this.initialize();
    }

    initialize() {
        this.loadHistory();
    }

    loadHistory() {
        fetch('/api/messages/history')
            .then(response => response.json())
            .then(data => this.displayMessages(data))
            .catch(error => console.error('Error fetching message history:', error));
    }

    displayMessages(messages) {
        const historyItems = document.querySelectorAll('.history-item');
        messages.forEach(message => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.textContent = `${message.sender}: ${message.text}`;
            this.container.appendChild(historyItem);
        });
    }
}

// Initialize the message history when the page loads
window.addEventListener('load', () => {
    new MessageHistory();
});
