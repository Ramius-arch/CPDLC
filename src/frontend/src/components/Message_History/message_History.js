import { messageService, authService } from '../../services/api.js';
import './message_History.css';

export function initializeHistory() {
    const historyContainer = document.querySelector('.message-history');
    historyContainer.innerHTML = `
        <div class="history">
            <h2>Message History</h2>
            <div class="history-list" style="height: 400px; overflow-y: auto; padding-right: 8px;"></div>
        </div>
    `;

    loadMessageHistory();

    const intervalId = setInterval(loadMessageHistory, 5000);
    
    if (window.historyIntervalId) {
        clearInterval(window.historyIntervalId);
    }
    window.historyIntervalId = intervalId;
}

async function loadMessageHistory() {
    try {
        const historyList = document.querySelector('.history-list');
        if (!historyList) return;
        
        const messages = await messageService.getHistory();
        const currentUser = authService.getUser();
        if (!currentUser) return;

        historyList.innerHTML = messages.map(message => {
            const isSent = message.sender_username === currentUser.username;
            const time = new Date(message.timestamp).toLocaleTimeString();
            const date = new Date(message.timestamp).toLocaleDateString();

            const isResponse = message.ref_seq_num !== null && message.ref_seq_num !== undefined;
            const responseText = isResponse ? `<span class="ref-badge" style="background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px; font-size: 10px; color: #a1a1aa; margin-left: 8px;">Resp to #${message.ref_seq_num}</span>` : '';

            return `
                <div class="history-item ${isSent ? 'sent' : 'received'}" style="margin-bottom: 12px; padding: 12px; border-radius: 8px; background: rgba(30,41,59,0.3); border: 1px solid rgba(255,255,255,0.05);">
                    <div class="header" style="display: flex; justify-content: space-between; font-size: 11px; color: #71717a; margin-bottom: 6px; font-family: monospace;">
                        <span>${isSent ? '✈️ Sent To: ' + message.recipient : '📡 From: ' + message.sender_username}</span>
                        <span>[${message.msg_code}] (Seq #${message.seq_num})${responseText}</span>
                    </div>
                    <div class="content" style="font-family: monospace; font-size: 13px; color: #f4f4f5; margin-bottom: 6px;">${message.content}</div>
                    <div class="footer" style="display: flex; justify-content: space-between; font-size: 9px; color: #52525b; font-family: monospace;">
                        <span>${date} @ ${time}</span>
                        <span>Status: ${message.status}</span>
                    </div>
                </div>
            `;
        }).join('');

        historyList.scrollTop = historyList.scrollHeight;
    } catch (error) {
        console.error('Failed to load message history:', error);
    }
}