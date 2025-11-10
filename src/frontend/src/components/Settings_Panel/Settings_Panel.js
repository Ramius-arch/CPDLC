import { settingsService, Themes } from '../../services/settings.js';
import { authService } from '../../services/api.js';
import './Settings_Panel.css';

export function initializeSettings() {
    const settingsContainer = document.querySelector('.settings-panel');
    settingsContainer.innerHTML = `
        <div class="settings">
            <h2>Settings</h2>
            <div class="settings-controls">
                <div class="settings-group">
                    <label>Theme</label>
                    <div class="theme-buttons">
                        <button class="theme-button light" data-theme="light">Light</button>
                        <button class="theme-button dark" data-theme="dark">Dark</button>
                        <button class="theme-button sepia" data-theme="sepia">Sepia</button>
                    </div>
                </div>
                <div class="settings-group">
                    <label>Role</label>
                    <select id="role">
                        <option value="pilot">Pilot</option>
                        <option value="controller">Controller</option>
                    </select>
                </div>
                <div class="settings-group">
                    <button id="logout">Logout</button>
                </div>
            </div>
        </div>
    `;

    // Setup theme buttons
    const themeButtons = settingsContainer.querySelectorAll('.theme-button');
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.dataset.theme;
            settingsService.setTheme(theme);
            updateThemeButtons();
        });
    });

    // Setup logout button
    const logoutButton = settingsContainer.querySelector('#logout');
    logoutButton.addEventListener('click', () => {
        authService.logout();
        window.location.reload();
    });

    // Update initial theme button states
    updateThemeButtons();

    function updateThemeButtons() {
        const currentTheme = settingsService.getTheme();
        themeButtons.forEach(button => {
            button.style.opacity = button.dataset.theme === currentTheme ? '1' : '0.6';
        });
    }
}