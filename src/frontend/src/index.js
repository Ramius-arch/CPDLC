import '../styles/main.css';
import { initializeAirspace } from './components/Airspace_Display/Airspace';
import { initializeChat } from './components/CPDLC_Chat/CPDLC_Chat';
import { initializeHistory } from './components/Message_History/message_History';
import { initializeMessageInput } from './components/Message_Input_Form/message_Input';
import { initializeSettings } from './components/Settings_Panel/Settings_Panel';
import { settingsService } from './services/settings';
import { authService } from './services/api';

document.addEventListener('DOMContentLoaded', () => {
    const token = authService.getToken();
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    initializeApp();
});

function initializeApp() {
    const theme = settingsService.getTheme();
    applyTheme(theme);

    const airspaceDisplayInstance = initializeAirspace();
    initializeChat();
    initializeHistory();
    initializeMessageInput();
    initializeSettings();

    document.addEventListener('messagesSent', () => {
        initializeHistory();
    });

    setupNavigation();

    const themeSelect = document.getElementById('theme-select');
    themeSelect.addEventListener('change', (e) => {
        const newTheme = e.target.value;
        settingsService.setTheme(newTheme);
        applyTheme(newTheme);
    });
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-bs-theme');
    }
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-nav-link');
    const sections = document.querySelectorAll('main section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetLink = e.currentTarget;

            navLinks.forEach(l => l.classList.remove('active'));
            targetLink.classList.add('active');

            const targetId = targetLink.getAttribute('href').substring(1);
            sections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.add('active-section');
                } else {
                    section.classList.remove('active-section');
                }
            });
        });
    });
}