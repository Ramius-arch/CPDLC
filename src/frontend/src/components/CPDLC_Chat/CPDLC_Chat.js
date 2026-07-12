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
                    <div class="small text-secondary mb-1 font-mono" style="font-size: 10px;">
                        ${isSent ? '✈️ Sent To: ' + message.recipient : '📡 From: ' + message.sender_username} 
                        <span class="badge bg-dark text-zinc-400 ms-1">${message.msg_code} (Seq #${message.seq_num})</span>
                    </div>
                    <div class="p-3 rounded-3 max-w-75 font-mono text-sm" style="
                        background-color: ${isSent ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
                        border: 1px solid ${isSent ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
                        color: #f4f4f5;
                        max-width: 75%;
                        border-radius: 8px;
                    ">
                        ${message.content}
                        ${message.ref_seq_num !== null && message.ref_seq_num !== undefined ? `<div class="smaller text-secondary mt-1" style="font-size: 9px; opacity: 0.7;">Ref parent: #${message.ref_seq_num}</div>` : ''}
                    </div>
                </li>
            `;
        }).join('');
        
        chatContainer.scrollTop = chatContainer.scrollHeight;
    } catch (error) {
        console.error('Failed to load chat messages:', error);
    }
}