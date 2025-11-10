import { authService } from './services/api';

document.addEventListener('DOMContentLoaded', () => {
    const registerBtn = document.getElementById('register-btn');
    registerBtn.addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        try {
            await authService.register(username, email, password, role);
            await authService.login(username, password);
            window.location.href = 'index.html';
        } catch (error) {
            alert(error.message);
        }
    });

    const loginLink = document.getElementById('login-link');
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'login.html';
    });
});
