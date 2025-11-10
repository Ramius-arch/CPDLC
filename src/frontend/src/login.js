import { authService } from './services/api';

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    loginBtn.addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        console.log('Attempting to log in with:', { username, password });

        try {
            await authService.login(username, password);
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Login failed:', error);
            alert(error.message);
        }
    });

    const registerLink = document.getElementById('register-link');
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'register.html';
    });
});
