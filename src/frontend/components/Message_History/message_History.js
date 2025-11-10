export function initializeHistory() {
    class MessageHistory {
        constructor() {
            this.container = document.getElementById('message-history-content');
            if (!this.container) {
                console.error('Message history container not found');
                return;
            }
            this.initialize();
        }

        initialize() {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No authentication token found');
                this.showError('Please log in to view messages');
                return;
            }

            this.loadHistory();

            document.addEventListener('messageSent', (event) => {
                this.loadHistory();
            });

            document.addEventListener('updateMessageHistory', () => {
                this.loadHistory();
            });
        }

        async loadHistory() {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await fetch('http://localhost:3000/api/messages/history', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch message history');
                }

                const data = await response.json();
                this.displayMessages(data);

            } catch (error) {
                console.error('Error loading message history:', error);
                this.showError(error.message || 'Failed to load message history. Please try refreshing the page.');
            }
        }

        displayMessages(messages) {
            this.container.innerHTML = '';

            if (!Array.isArray(messages) || messages.length === 0) {
                const emptyMessage = document.createElement('div');
                emptyMessage.className = 'history-item empty';
                emptyMessage.textContent = 'No messages yet';
                this.container.appendChild(emptyMessage);
                return;
            }

            messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                   .forEach(message => this.addMessageToHistory(message));
        }

        addMessageToHistory(message) {
            const historyItem = document.createElement('div');
            historyItem.className = `history-item ${message.type.toLowerCase()}`;

            const timestamp = new Date(message.timestamp).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            const sanitizeHTML = (str) => {
                const div = document.createElement('div');
                div.textContent = str;
                return div.innerHTML;
            };

            historyItem.innerHTML = `
                <div class="message-header">
                    <span class="message-type">${sanitizeHTML(message.type)}</span>
                    <span class="message-time">${timestamp}</span>
                </div>
                <div class="message-content">${sanitizeHTML(message.content)}</div>
                <div class="message-footer">
                    <span class="message-sender">From: ${sanitizeHTML(message.sender_id || 'System')}</span>
                    <span class="message-recipient">To: ${sanitizeHTML(message.recipient)}</span>
                </div>
            `;

            if (this.container.firstChild) {
                this.container.insertBefore(historyItem, this.container.firstChild);
            } else {
                this.container.appendChild(historyItem);
            }
        }

        showError(message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error';
            errorDiv.textContent = message;
            this.container.innerHTML = '';
            this.container.appendChild(errorDiv);
        }
    }

    new MessageHistory();
}
