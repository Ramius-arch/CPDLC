import { messageService, authService } from '../../services/api.js';
import './message_History.css';

export function initializeHistory() {
    const historyContainer = document.querySelector('.message-history');
    historyContainer.innerHTML = `
        <div class="history">
            <h2>Message History</h2>
            <div class="history-list"></div>
        </div>
    `;

    // Load message history
    loadMessageHistory();

    // Setup automatic refresh every 30 seconds
    setInterval(loadMessageHistory, 30000);
}

async function loadMessageHistory() {
    try {
        const historyList = document.querySelector('.history-list');
        const messages = await messageService.getHistory();
        const currentUser = authService.getUser();

        historyList.innerHTML = messages.map(message => {
            const isSent = message.sender === currentUser.username;
            const time = new Date(message.timestamp).toLocaleTimeString();
            const date = new Date(message.timestamp).toLocaleDateString();

            return `
                <div class="history-item ${isSent ? 'sent' : 'received'}">
                    <div class="header">
                        <span>${isSent ? 'To: ' + message.receiver : 'From: ' + message.sender}</span>
                        <span>${message.type}</span>
                    </div>
                    <div class="content">${message.content}</div>
                    <div class="footer">
                        <span>${date}</span>
                        <span>${time}</span>
                        <span>Status: ${message.status}</span>
                    </div>
                </div>
            `;
        }).join('');

        // Scroll to bottom
        historyList.scrollTop = historyList.scrollHeight;
    } catch (error) {
        console.error('Failed to load message history:', error);
    }
}