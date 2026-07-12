import { settingsService } from '../../services/settings.js';
import { authService } from '../../services/api.js';
import './Settings_Panel.css';

export function initializeSettings() {
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        themeSelect.value = settingsService.getTheme() || 'dark';
    }

    const user = authService.getUser();
    if (user) {
        const displayEl = document.getElementById('user-display');
        if (displayEl) {
            const detail = user.role === 'pilot' 
                ? `Mode S: ${user.mode_s_address || 'N/A'}` 
                : `Facility: ${user.facility_designator || 'N/A'}`;
            displayEl.innerHTML = `
                <div class="fw-bold text-truncate text-zinc-100" style="color: #f4f4f5;">${user.username.toUpperCase()}</div>
                <div class="text-secondary smaller" style="font-size: 10px; margin-bottom: 4px;">${detail}</div>
                <a href="#" id="sidebar-logout" style="color: #ef4444; font-size: 10px; text-decoration: none;">LOG OUT</a>
            `;
            
            const logoutLink = document.getElementById('sidebar-logout');
            if (logoutLink) {
                logoutLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    authService.logout();
                    window.location.reload();
                });
            }
        }
    }
}