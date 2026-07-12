import { authService } from './services/api';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('error-message');
        
        if (errorMsg) {
            errorMsg.innerText = '';
            errorMsg.style.display = 'none';
        }

        console.log('Attempting to log in with:', { username });

        try {
            await authService.login(username, password);
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Login failed:', error);
            if (errorMsg) {
                errorMsg.innerText = error.message;
                errorMsg.style.display = 'block';
            } else {
                alert(error.message);
            }
        }
    });

    const registerLink = document.querySelector('.auth-footer a');
    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'register.html';
        });
    }
});
