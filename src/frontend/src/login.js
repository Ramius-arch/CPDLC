import { authService } from './services/api';
import '../styles/auth.css';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const bootHud = document.getElementById('boot-hud');
    const bootLines = document.getElementById('boot-lines');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('error-message');
        
        if (errorMsg) {
            errorMsg.innerText = '';
            errorMsg.style.display = 'none';
        }

        // Show avionic linkage HUD
        if (bootHud && bootLines) {
            bootHud.style.display = 'flex';
            bootLines.innerHTML = '';
            
            const writeLine = (text, delay) => new Promise(res => {
                setTimeout(() => {
                    const line = document.createElement('div');
                    line.textContent = `> ${text}`;
                    bootLines.appendChild(line);
                    bootLines.scrollTop = bootLines.scrollHeight;
                    res();
                }, delay);
            });
            
            await writeLine('INITIATING DATALINK DEPLOY...', 100);
            await writeLine(`REQUESTING PAIRING ID: ${username.toUpperCase()}`, 150);
            await writeLine('ENCRYPTING ACCESS SIGNATURE (AES-256)...', 200);
            await writeLine('ESTABLISHING SECURE LINK-16 TUNNEL...', 250);
        }

        try {
            await authService.login(username, password);
            if (bootLines) {
                const line = document.createElement('div');
                line.textContent = '> HANDSHAKE SECURED. REDIRECTING...';
                line.style.color = '#10b981';
                bootLines.appendChild(line);
            }
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 600);
        } catch (error) {
            console.error('Login failed:', error);
            if (bootHud) {
                bootHud.style.display = 'none';
            }
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
