class MessageInputForm {
    constructor() {
        this.form = document.getElementById('message-input-form');
        this.messageType = document.getElementById('message-type');
        this.recipient = document.getElementById('recipient');
        this.messageContent = document.getElementById('message-content');

        this.initialize();
    }

    initialize() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = {
                type: this.messageType.value,
                recipient: this.recipient.value,
                content: this.messageContent.value
            };

            this.submitMessage(formData);
        });
    }

    submitMessage(data) {
        fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to submit message');
                alert('Message submitted successfully!');
            })
            .catch(error => console.error('Error submitting message:', error));
    }
}

// Initialize the message input form when the page loads
window.addEventListener('load', () => {
    new MessageInputForm();
});
