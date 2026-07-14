class SettingsService {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.applyTheme(this.theme);
    }

    setTheme(theme) {
        this.theme = theme;
        localStorage.setItem('theme', theme);
        this.applyTheme(theme);
    }

    getTheme() {
        return this.theme;
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-bs-theme', theme);
        document.body.classList.remove('light-theme', 'dark-theme', 'sepia-theme', 'oceanic-theme');
        document.body.classList.add(`${theme}-theme`);
    }
}

export const settingsService = new SettingsService();