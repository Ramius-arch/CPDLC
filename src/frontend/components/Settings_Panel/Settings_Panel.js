export function initializeSettings() {
    class SettingsPanel {
        constructor() {
            this.panel = document.getElementById('settings-section');
            this.form = document.getElementById('settings-form');
            this.volumeSlider = document.getElementById('volume');
            this.notificationCheckbox = document.getElementById('notifications');
            this.themeSelect = document.getElementById('theme-select');

            if (this.panel && this.form) {
                this.initialize();
            } else {
                console.error('Settings panel elements not found in the DOM');
            }
        }

        initialize() {
            this.loadSettings();
            this.setupEventListeners();
        }

        loadSettings() {
            const settings = localStorage.getItem('cpdlcSettings');
            if (settings) {
                const data = JSON.parse(settings);
                this.volumeSlider.value = data.volume;
                this.notificationCheckbox.checked = data.notificationsEnabled;
                this.themeSelect.value = data.theme;
                this.applyTheme(data.theme);
            }
        }

        setupEventListeners() {
            this.themeSelect.addEventListener('change', (e) => {
                this.applyTheme(e.target.value);
                this.saveSettings();
            });

            this.form.addEventListener('change', () => {
                this.saveSettings();
            });
        }

        applyTheme(theme) {
            document.body.className = '';
            document.body.classList.add(`${theme}-theme`);
        }

        saveSettings() {
            const settings = {
                volume: parseInt(this.volumeSlider.value),
                notificationsEnabled: this.notificationCheckbox.checked,
                theme: this.themeSelect.value
            };
            localStorage.setItem('cpdlcSettings', JSON.stringify(settings));
            this.applyTheme(settings.theme);
        }
    }

    new SettingsPanel();
}
