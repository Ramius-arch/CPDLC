import { messageService, authService } from '../../services/api.js';

export function initializeHistory() {
    loadMessageHistory();
    const interval = setInterval(loadMessageHistory, 5000);
    if (window.historyIntervalId) {
        clearInterval(window.historyIntervalId);
    }
    window.historyIntervalId = interval;
}

async function loadMessageHistory() {
    try {
        const historyTableBody = document.getElementById('message-history-content');
        if (!historyTableBody) return;
        
        const messages = await messageService.getHistory();
        const currentUser = authService.getUser();
        if (!currentUser) return;

        historyTableBody.innerHTML = messages.map(message => {
            const time = new Date(message.timestamp).toLocaleTimeString();
            const date = new Date(message.timestamp).toLocaleDateString();
            const isResponse = message.ref_seq_num !== null && message.ref_seq_num !== undefined;
            const refText = isResponse ? `<span class="badge bg-secondary ms-1" style="font-size: 10px;">Resp to #${message.ref_seq_num}</span>` : '';

            return `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td class="font-mono text-sm" style="padding: 12px; color: #e4e4e7;">${message.sender_username}</td>
                    <td class="font-mono text-sm" style="padding: 12px; color: #e4e4e7;">${message.recipient}</td>
                    <td class="font-mono text-sm" style="padding: 12px; color: #f4f4f5;">
                        <span class="badge bg-primary me-2" style="font-size: 11px; padding: 4px 8px;">${message.msg_code} (Seq #${message.seq_num})</span>
                        ${message.content} ${refText}
                    </td>
                    <td class="font-mono text-xs text-secondary" style="padding: 12px; color: #71717a;">${date} ${time}</td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Failed to load message history:', error);
    }
}