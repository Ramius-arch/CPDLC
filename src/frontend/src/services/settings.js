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
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-bs-theme', 'dark');
        } else if (theme === 'sepia') {
            document.documentElement.setAttribute('data-bs-theme', 'sepia');
        } else {
            document.documentElement.removeAttribute('data-bs-theme');
        }
    }
}

export const settingsService = new SettingsService();