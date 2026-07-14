import { messageService, authService } from '../../services/api.js';

export function initializeChat() {
    const chatContainer = document.getElementById('message-list');
    if (!chatContainer) return;
    
    loadChatMessages();
    
    const intervalId = setInterval(loadChatMessages, 5000);
    if (window.chatIntervalId) {
        clearInterval(window.chatIntervalId);
    }
    window.chatIntervalId = intervalId;
    
    document.addEventListener('messagesSent', loadChatMessages);
}

async function loadChatMessages() {
    try {
        const chatContainer = document.getElementById('message-list');
        if (!chatContainer) return;
        
        const messages = await messageService.getHistory();
        const currentUser = authService.getUser();
        if (!currentUser) return;
        
        chatContainer.innerHTML = messages.map(message => {
            const isSent = message.sender_username === currentUser.username;
            return `
                <li class="list-group-item bg-transparent border-0 d-flex flex-column ${isSent ? 'align-items-end' : 'align-items-start'} mb-3" style="padding: 0;">
                    <div class="small mb-1 font-mono" style="font-size: 10px; color: var(--text-secondary);">
                        ${isSent ? '✈️ Sent To: ' + message.recipient : '📡 From: ' + message.sender_username} 
                        <span class="badge bg-dark ms-1" style="color: var(--text-secondary); border: 1px solid var(--border-color);">${message.msg_code} (Seq #${message.seq_num})</span>
                    </div>
                    <div class="p-3 rounded-3 max-w-75 font-mono text-sm" style="
                        background-color: ${isSent ? 'var(--message-sent-bg)' : 'var(--message-received-bg)'};
                        border: 1px solid ${isSent ? 'var(--message-sent-border)' : 'var(--message-received-border)'};
                        color: var(--text-primary);
                        max-width: 75%;
                        border-radius: 8px;
                    ">
                        ${message.content}
                        ${message.ref_seq_num !== null && message.ref_seq_num !== undefined ? `<div class="smaller mt-1" style="font-size: 9px; opacity: 0.7; color: var(--text-secondary);">Ref parent: #${message.ref_seq_num}</div>` : ''}
                    </div>
                </li>
            `;
        }).join('');
        
        chatContainer.scrollTop = chatContainer.scrollHeight;
    } catch (error) {
        console.error('Failed to load chat messages:', error);
    }
}