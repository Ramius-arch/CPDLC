class SettingsPanel {
    constructor() {
        this.panel = document.getElementById('settings-panel');
        this.volumeSlider = document.getElementById('volume');
        this.notificationCheckbox = document.getElementById('notifications');
        this.themeSelect = document.getElementById('theme');

        this.initialize();
    }

    initialize() {
        this.loadSettings();
        this.setupEventListeners();
    }

    loadSettings() {
        // Implement loading settings from storage
        const settings = localStorage.getItem('cpdlcSettings');
        if (settings) {
            const data = JSON.parse(settings);
            this.volumeSlider.value = data.volume;
            this.notificationCheckbox.checked = data.notificationsEnabled;
            this.themeSelect.value = data.theme;
        }
    }

    setupEventListeners() {
        document.getElementById('settings-panel').addEventListener('change', () => {
            this.saveSettings();
        });
    }

    saveSettings() {
        const settings = {
            volume: parseInt(this.volumeSlider.value),
            notificationsEnabled: this.notificationCheckbox.checked,
            theme: this.themeSelect.value
        };
        localStorage.setItem('cpdlcSettings', JSON.stringify(settings));
        // Apply theme if necessary
        applyTheme(settings.theme);
    }
}

function saveSettings() {
    new SettingsPanel().saveSettings();
}

// Initialize the settings panel when the page loads
window.addEventListener('load', () => {
    new SettingsPanel();
});
