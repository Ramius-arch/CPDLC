import { messageService, authService } from '../../services/api.js';
import './message_Input.css';

export function initializeMessageInput() {
    const inputContainer = document.querySelector('#messages-section .col-lg-5 .card-body');
    const currentUser = authService.getUser();
    
    if (!currentUser || !inputContainer) return;
    
    const isController = currentUser.role === 'controller';
    
    const templates = isController ? [
        { code: 'UM19', label: 'UM19: CLIMB TO [Altitude]', template: 'CLIMB TO FL' },
        { code: 'UM20', label: 'UM20: DESCEND TO [Altitude]', template: 'DESCEND TO FL' },
        { code: 'UM74', label: 'UM74: PROCEED DIRECT TO [Position]', template: 'PROCEED DIRECT TO ' },
        { code: 'UM117', label: 'UM117: CONTACT [Facility] [Frequency]', template: 'CONTACT ' },
        { code: 'UM169', label: 'UM169: Free Text', template: '' }
    ] : [
        { code: 'DM6', label: 'DM6: REQUEST [Altitude]', template: 'REQUEST FL' },
        { code: 'DM22', label: 'DM22: REQUEST DIRECT TO [Position]', template: 'REQUEST DIRECT TO ' },
        { code: 'DM0', label: 'DM0: WILCO', template: 'WILCO' },
        { code: 'DM1', label: 'DM1: UNABLE', template: 'UNABLE' },
        { code: 'DM2', label: 'DM2: STANDBY', template: 'STANDBY' }
    ];

    inputContainer.innerHTML = `
        <div class="message-form glass-card p-6 rounded-xl border border-zinc-800 bg-zinc-900 bg-opacity-70">
            <div class="input-group mb-4">
                <label for="receiver" class="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Recipient:</label>
                <select id="receiver" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-100" required>
                    <option value="">Loading recipients...</option>
                </select>
            </div>
            <div class="input-group mb-4">
                <label for="message-code" class="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">ICAO Message Code:</label>
                <select id="message-code" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-100" required>
                    ${templates.map(t => `<option value="${t.code}" data-template="${t.template}">${t.label}</option>`).join('')}
                </select>
            </div>
            
            <div id="response-ref-group" class="input-group mb-4 hidden">
                <label for="ref-seq-num" class="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">In Response To Message Seq #:</label>
                <input type="number" id="ref-seq-num" min="0" max="63" placeholder="Sequence number (0-63)" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-100">
            </div>

            <div class="input-group mb-4">
                <label for="message-content" class="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Message Content:</label>
                <textarea id="message-content" placeholder="Enter flight parameters..." class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-100 h-24" required></textarea>
            </div>
            <button type="submit" id="send-button" class="w-full font-semibold text-sm rounded-lg p-3 mt-2">Send CPDLC Message</button>
        </div>
    `;

    const form = inputContainer.querySelector('.message-form');
    const sendButton = form.querySelector('#send-button');
    const receiverSelect = form.querySelector('#receiver');
    const messageCodeSelect = form.querySelector('#message-code');
    const responseRefGroup = form.querySelector('#response-ref-group');
    const refSeqNumInput = form.querySelector('#ref-seq-num');
    const messageContent = form.querySelector('#message-content');

    // Load recipients dynamically
    messageService.getUsers().then(users => {
        const otherUsers = users.filter(u => u.username !== currentUser.username);
        receiverSelect.innerHTML = '<option value="">Select Recipient</option>';
        if (otherUsers.length === 0) {
            receiverSelect.innerHTML += '<option value="" disabled>No other online facilities/aircraft</option>';
        } else {
            otherUsers.forEach(u => {
                const label = u.role === 'pilot' 
                    ? `${u.username} (Aircraft Callsign - Mode S: ${u.mode_s_address || 'N/A'})`
                    : `${u.username} (ATC Facility Designator: ${u.facility_designator || 'N/A'})`;
                receiverSelect.innerHTML += `<option value="${u.username}">${label}</option>`;
            });
        }
    }).catch(err => {
        console.error('Failed to fetch users:', err);
        receiverSelect.innerHTML = '<option value="">Error loading recipients</option>';
    });

    // Handle template autofill
    function applyTemplate() {
        const selectedOption = messageCodeSelect.options[messageCodeSelect.selectedIndex];
        const templateText = selectedOption.getAttribute('data-template');
        messageContent.value = templateText;
        messageContent.focus();
        
        const code = messageCodeSelect.value;
        const requiresRef = ['DM0', 'DM1', 'DM2'].includes(code);
        if (requiresRef) {
            responseRefGroup.classList.remove('hidden');
        } else {
            responseRefGroup.classList.add('hidden');
            refSeqNumInput.value = '';
        }
        validateForm();
    }

    messageCodeSelect.addEventListener('change', applyTemplate);
    
    applyTemplate();

    function validateForm() {
        const isValid = receiverSelect.value && messageContent.value.trim();
        sendButton.disabled = !isValid;
        return isValid;
    }

    [receiverSelect, messageContent].forEach(element => {
        element.addEventListener('input', validateForm);
    });

    sendButton.addEventListener('click', async () => {
        if (!validateForm()) return;

        try {
            sendButton.disabled = true;
            const refVal = refSeqNumInput.value ? parseInt(refSeqNumInput.value, 10) : null;
            await messageService.sendMessage(
                receiverSelect.value,
                messageContent.value,
                messageCodeSelect.value,
                refVal
            );

            // Clear input and re-apply current template
            messageContent.value = '';
            applyTemplate();
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