export function initializeChat() {
    const chatContainer = document.querySelector('.cpdlc-chat');
    chatContainer.innerHTML = `
        <div class="chat-window">
            <h2>CPDLC Messages</h2>
            <div class="messages"></div>
        </div>
    `;
}