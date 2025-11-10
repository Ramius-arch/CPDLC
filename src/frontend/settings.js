// Initialize settings when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    initializeSettingsListeners();
});

// Load saved settings
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('cpdlcSettings') || '{}');
    
    // Set volume
    const volumeSlider = document.getElementById('volume');
    if (volumeSlider) {
        volumeSlider.value = settings.volume || 75;
    }
    
    // Set notifications
    const notificationsCheckbox = document.getElementById('notifications');
    if (notificationsCheckbox) {
        notificationsCheckbox.checked = settings.notifications !== false;
    }
    
    // Set theme
    const themeSelect = document.getElementById('theme');
    if (themeSelect) {
        themeSelect.value = settings.theme || 'light';
        applyTheme(themeSelect.value);
    }
}

// Save settings
function saveSettings() {
    const volume = document.getElementById('volume').value;
    const notifications = document.getElementById('notifications').checked;
    const theme = document.getElementById('theme').value;
    
    const settings = {
        volume: volume,
        notifications: notifications,
        theme: theme
    };
    
    localStorage.setItem('cpdlcSettings', JSON.stringify(settings));
    applyTheme(theme);
    showSettingsSaved();
}

// Apply theme
function applyTheme(theme) {
    document.body.classList.remove('light-theme', 'dark-theme', 'sepia-theme');
    document.body.classList.add(`${theme}-theme`);
}

// Show settings saved message
function showSettingsSaved() {
    const message = document.createElement('div');
    message.className = 'alert alert-success';
    message.textContent = 'Settings saved successfully!';
    
    const settingsForm = document.getElementById('settings-form');
    settingsForm.insertBefore(message, settingsForm.firstChild);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Initialize settings event listeners
function initializeSettingsListeners() {
    // Save settings when the save button is clicked
    const saveButton = document.querySelector('#settings-form button');
    if (saveButton) {
        saveButton.addEventListener('click', saveSettings);
    }
    
    // Apply theme immediately when changed
    const themeSelect = document.getElementById('theme');
    if (themeSelect) {
        themeSelect.addEventListener('change', (e) => {
            applyTheme(e.target.value);
        });
    }
}