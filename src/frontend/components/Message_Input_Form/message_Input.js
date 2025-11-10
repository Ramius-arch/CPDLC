import { messageService } from '../../src/services/api';

export function initializeMessageInput() {
    class MessageInputForm {
        constructor() {
            this.form = document.getElementById('message-input-form');
            if (!this.form) {
                console.error('Message input form not found');
                return;
            }
            this.messageType = this.form.querySelector('#message-type');
            this.messageText = this.form.querySelector('#message-content');
            this.recipientInput = this.form.querySelector('#recipient');

            this.initialize();
        }

        initialize() {
            this.setupEventListeners();
            this.loadMessageTypes();
        }

        loadMessageTypes() {
            const messageTypes = [
                'CLEARANCE',
                'INFORMATION',
                'REQUEST',
                'RESPONSE'
            ];

            messageTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                this.messageType.appendChild(option);
            });
        }

        setupEventListeners() {
            this.form.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (!this.validateForm()) {
                    return;
                }

                const formData = {
                    recipient: this.recipientInput.value,
                    message_type: this.messageType.value,
                    content: this.messageText.value
                };

                await this.submitMessage(formData);
            });
        }

        validateForm() {
            if (!this.messageText.value.trim()) {
                this.showError('Message content is required');
                return false;
            }
            if (!this.recipientInput.value.trim()) {
                this.showError('Recipient is required');
                return false;
            }
            return true;
        }

        showError(message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            this.form.insertBefore(errorDiv, this.form.firstChild);

            setTimeout(() => {
                errorDiv.remove();
            }, 3000);
        }

        async submitMessage(data) {
            try {
                const result = await messageService.sendMessage(data.recipient, data.content, data.message_type);

                this.form.reset();

                document.dispatchEvent(new CustomEvent('messageSent', {
                    detail: {
                        message: result,
                        type: data.message_type,
                        recipient: data.recipient,
                        content: data.content,
                        timestamp: new Date().toISOString()
                    }
                }));

            } catch (error) {
                console.error('Error sending message:', error);
                this.showError(error.message || 'Failed to send message. Please try again.');
            }
        }
    }

    new MessageInputForm();
}
