import { messageService } from '../../services/api.js';
import './message_Input.css';

export function initializeMessageInput() {
    const inputContainer = document.querySelector('.message-input');
    inputContainer.innerHTML = `
        <div class="message-form">
            <div class="input-group">
                <label for="receiver">Send To:</label>
                <select id="receiver" required>
                    <option value="">Select Recipient</option>
                    <option value="ATC">Air Traffic Control</option>
                    <option value="PILOT">Pilot</option>
                </select>
            </div>
            <div class="input-group">
                <label for="message-type">Message Type:</label>
                <select id="message-type" required>
                    <option value="clearance">Clearance</option>
                    <option value="request">Request</option>
                    <option value="emergency">Emergency</option>
                    <option value="information">Information</option>
                </select>
            </div>
            <div class="input-group">
                <label for="message-content">Message:</label>
                <textarea id="message-content" placeholder="Type your message..." required></textarea>
            </div>
            <button type="submit" id="send-button">Send Message</button>
        </div>
    `;

    // Add event listeners
    const form = inputContainer.querySelector('.message-form');
    const sendButton = form.querySelector('#send-button');
    const receiverSelect = form.querySelector('#receiver');
    const messageTypeSelect = form.querySelector('#message-type');
    const messageContent = form.querySelector('#message-content');

    // Function to check if form is valid
    function validateForm() {
        const isValid = receiverSelect.value && messageContent.value.trim();
        sendButton.disabled = !isValid;
        return isValid;
    }

    // Add input listeners for validation
    [receiverSelect, messageContent].forEach(element => {
        element.addEventListener('input', validateForm);
    });

    // Initial validation
    validateForm();

    // Handle form submission
    sendButton.addEventListener('click', async () => {
        if (!validateForm()) return;

        try {
            sendButton.disabled = true;
            await messageService.sendMessage(
                receiverSelect.value,
                messageContent.value,
                messageTypeSelect.value
            );

            // Clear form after successful send
            messageContent.value = '';
            validateForm();

            // Trigger message history refresh
            const historyEvent = new CustomEvent('messagesSent');
            document.dispatchEvent(historyEvent);
        } catch (error) {
            console.error('Failed to send message:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            sendButton.disabled = false;
        }
    });
}