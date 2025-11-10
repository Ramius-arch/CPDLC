import { initializeAirspace } from './components/airspace_display/Airspace.js';

// Global Components
const components = {
    messageInput: null,
    messageHistory: null,
    settingsPanel: null,
    cpdlcChat: null,
    airspace: null
};

// Main initialization
async function initializeApp() {
    try {
        console.log('Starting application initialization...');
        
        // Check if we're on the login or register page
        const isAuthPage = window.location.pathname.endsWith('login.html') || 
                          window.location.pathname.endsWith('register.html');
        
        if (isAuthPage) {
            console.log('On auth page, skipping initialization');
            return;
        }

        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        // Verify token with server
        const verifyResponse = await fetch('http://localhost:3000/api/auth/verify', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
                });
                
                if (!verifyResponse.ok) {
                    throw new Error('Token verification failed');
                }

                const userData = await verifyResponse.json();
                if (!userData.valid) {
                    throw new Error('Invalid token');
                }        console.log('User authenticated, initializing components...');
        await initializeComponents();
        setupNavigation();
        loadTheme();
        attachEventListeners();
        console.log('Application initialization completed successfully');
    } catch (error) {
        console.error('Initialization error:', error);
        localStorage.clear();
        sessionStorage.clear();
        window.location.replace('login.html');
    }
}

// Component initialization
async function initializeComponents() {
    try {
        components.messageInput = new MessageInputForm();
        components.messageHistory = new MessageHistory();
        components.settingsPanel = new SettingsPanel();
        components.cpdlcChat = new ChatComponent();
        components.airspace = initializeAirspace();
        await loadMessages();
    } catch (error) {
        console.error('Error initializing components:', error);
    }
}

// Event listeners setup
function attachEventListeners() {
    // Message form submission
    const messageForm = document.getElementById('message-input-form');
    if (messageForm) {
        messageForm.addEventListener('submit', handleMessageSubmit);
    }

    // Theme selector
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        themeSelect.addEventListener('change', (e) => setTheme(e.target.value));
        themeSelect.value = localStorage.getItem('theme') || 'light';
    }

    // Settings form
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveSettings();
        });
    }
}

// Authentication check
async function checkAuth() {
    const token = localStorage.getItem('token');
    let user;
    
    try {
        user = JSON.parse(localStorage.getItem('user') || '{}');
    } catch (e) {
        console.error('Failed to parse user data:', e);
        localStorage.clear();
        return false;
    }
    
    if (!token || !user.username) {
        console.log('No token or user data found');
        localStorage.clear();
        return false;
    }
    
    try {
        console.log('Verifying token...');
        const response = await fetch('http://localhost:3000/api/auth/verify', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            console.log('Token verification failed:', response.status);
            localStorage.clear();
            return false;
        }

        const data = await response.json();
        if (!data.valid) {
            console.log('Token invalid according to server');
            localStorage.clear();
            return false;
        }

        // Add user info to page
        const header = document.querySelector('.cpdlc-header');
        const existingUserInfo = header?.querySelector('.user-info');
        
        if (existingUserInfo) {
            existingUserInfo.remove();
        }
        
        if (header) {
            const userInfoDiv = document.createElement('div');
            userInfoDiv.className = 'user-info';
            userInfoDiv.innerHTML = `
                <span>Logged in as: ${user.username}</span>
                <button onclick="logout()">Logout</button>
            `;
            header.appendChild(userInfoDiv);
        }
        
        console.log('Authentication successful');
        return true;
    } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return false;
    }
}

// Navigation setup
function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });
    
    // Show default section
    showSection('messages');
}

// Section display
function showSection(sectionId) {
    const sections = document.querySelectorAll('main section');
    const navLinks = document.querySelectorAll('nav a');

    sections.forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active-section');
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    const selectedSection = document.getElementById(sectionId);
    const selectedLink = document.querySelector(`nav a[href="#${sectionId}"]`);

    if (selectedSection) {
        selectedSection.style.display = 'block';
        selectedSection.classList.add('active-section');
    }
    
    if (selectedLink) {
        selectedLink.classList.add('active');
    }
}

// Message handling
async function handleMessageSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const messageType = form.querySelector('#message-type').value;
    const content = form.querySelector('#message-content').value;
    const recipient = form.querySelector('#recipient').value;

    if (!content.trim() || !recipient.trim()) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }

    try {
        await sendMessage(messageType, recipient, content);
        form.reset();
        showAlert('Message sent successfully!', 'success');
        await loadMessages();
    } catch (error) {
        console.error('Error sending message:', error);
        showAlert(error.message || 'Failed to send message', 'error');
    }
}

async function sendMessage(type, recipient, content) {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Not authenticated');
    }
    
    const response = await fetch('http://localhost:3000/api/messages/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            type,
            recipient,
            content
        })
    });
    
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send message');
    }
    
    return response.json();
}

async function loadMessages() {
    try {
        const messages = await fetchMessages();
        displayMessages(messages);
    } catch (error) {
        console.error('Error loading messages:', error);
        showAlert('Failed to load messages', 'error');
    }
}

async function fetchMessages() {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Not authenticated');
    }
    
    const response = await fetch('http://localhost:3000/api/messages/history', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch messages');
    }
    
    return response.json();
}

function displayMessages(messages) {
    const messageList = document.querySelector('.message-list');
    const historyList = document.querySelector('.history-list');
    
    if (!messageList || !historyList) return;

    messageList.innerHTML = '';
    historyList.innerHTML = '';
    
    if (messages.length === 0) {
        const emptyMessage = '<div class="empty-message">No messages yet</div>';
        messageList.innerHTML = emptyMessage;
        historyList.innerHTML = emptyMessage;
        return;
    }

    messages.forEach(msg => {
        const messageElement = createMessageElement(msg);
        
        // Add to current messages if recent (24 hours)
        const isRecent = (new Date() - new Date(msg.timestamp)) < 24 * 60 * 60 * 1000;
        if (isRecent) {
            messageList.appendChild(messageElement.cloneNode(true));
        }
        
        // Add to history
        historyList.appendChild(messageElement);
    });
}

function createMessageElement(msg) {
    const element = document.createElement('div');
    element.classList.add('message', msg.type.toLowerCase());
    
    element.innerHTML = `
        <div class="message-header">
            <span class="sender">${msg.sender || 'Unknown'}</span>
            <span class="timestamp">${new Date(msg.timestamp).toLocaleString()}</span>
        </div>
        <div class="message-content">${msg.content}</div>
        <div class="message-footer">
            <span class="type">${msg.type}</span>
            <span class="recipient">To: ${msg.recipient}</span>
            <span class="status">${msg.status || 'sent'}</span>
        </div>
    `;
    
    return element;
}

// UI feedback
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const container = document.querySelector('.alert-container') || document.body;
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => alertDiv.remove(), 3000);
}

// Theme management
function setTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        themeSelect.value = savedTheme;
    }
}

// Settings management
function saveSettings() {
    const settings = {
        theme: document.getElementById('theme')?.value || 'light',
        volume: document.getElementById('volume')?.value || '50',
        notifications: document.getElementById('notifications')?.checked || false
    };
    
    setTheme(settings.theme);
    localStorage.setItem('settings', JSON.stringify(settings));
    showAlert('Settings saved successfully!', 'success');
}

function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');
    
    if (document.getElementById('theme')) {
        document.getElementById('theme').value = settings.theme || 'light';
        setTheme(settings.theme || 'light');
    }
    
    if (document.getElementById('volume')) {
        document.getElementById('volume').value = settings.volume || '50';
    }
    
    if (document.getElementById('notifications')) {
        document.getElementById('notifications').checked = settings.notifications || false;
    }
}

// Utility functions
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Make functions globally available
window.logout = logout;
window.setTheme = setTheme;
window.saveSettings = saveSettings;