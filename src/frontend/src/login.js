import { authService } from './services/api';
import '../styles/auth.css';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const bootHud = document.getElementById('boot-hud');
    const bootLines = document.getElementById('boot-lines');
    
    const btnPilot = document.getElementById('btn-role-pilot');
    const btnController = document.getElementById('btn-role-controller');
    const roleValue = document.getElementById('role-value');
    const demoBtn = document.getElementById('login-demo-btn');

    // Role switch listeners
    if (btnPilot && btnController && roleValue) {
        btnPilot.addEventListener('click', () => {
            btnPilot.classList.add('active');
            btnController.classList.remove('active');
            roleValue.value = 'pilot';
        });

        btnController.addEventListener('click', () => {
            btnController.classList.add('active');
            btnPilot.classList.remove('active');
            roleValue.value = 'controller';
        });
    }

    const runAvionicBootLogs = async (userTitle) => {
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
            await writeLine(`REQUESTING PAIRING ID: ${userTitle.toUpperCase()}`, 150);
            await writeLine('ENCRYPTING ACCESS SIGNATURE (AES-256)...', 200);
            await writeLine('ESTABLISHING SECURE LINK-16 TUNNEL...', 250);
        }
    };
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('error-message');
        
        if (errorMsg) {
            errorMsg.innerText = '';
            errorMsg.style.display = 'none';
        }

        await runAvionicBootLogs(username);

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

    if (demoBtn) {
        demoBtn.addEventListener('click', async () => {
            const role = roleValue ? roleValue.value : 'pilot';
            const guestName = role === 'controller' ? 'GUEST_ATC' : 'GUEST_PILOT';
            
            await runAvionicBootLogs(guestName);
            
            if (bootLines) {
                const line1 = document.createElement('div');
                line1.textContent = '> OFFLINE MODE INITIATED...';
                line1.style.color = '#f59e0b';
                bootLines.appendChild(line1);
                
                const line2 = document.createElement('div');
                line2.textContent = '> DEPLOYING SIMULATED ATC RADAR CORRIDOR...';
                bootLines.appendChild(line2);
            }
            
            authService.loginDemo(role);
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1200);
        });
    }

    const registerLink = document.querySelector('.auth-footer a');
    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'register.html';
        });
    }
});
