import { authService } from './services/api';
import '../styles/auth.css';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
    const btnPilot = document.getElementById('btn-role-pilot');
    const btnController = document.getElementById('btn-role-controller');
    const roleValue = document.getElementById('role-value');
    
    const modeSGroup = document.getElementById('mode-s-group');
    const facilityGroup = document.getElementById('facility-group');
    const facilityInput = document.getElementById('facility_designator');
    const modeSInput = document.getElementById('mode_s_address');

    const bootHud = document.getElementById('boot-hud');
    const bootLines = document.getElementById('boot-lines');

    // Role switcher listeners
    if (btnPilot && btnController && roleValue) {
        btnPilot.addEventListener('click', () => {
            btnPilot.classList.add('active');
            btnController.classList.remove('active');
            roleValue.value = 'pilot';
            modeSGroup.style.display = 'block';
            facilityGroup.style.display = 'none';
            facilityInput.required = false;
        });

        btnController.addEventListener('click', () => {
            btnController.classList.add('active');
            btnPilot.classList.remove('active');
            roleValue.value = 'controller';
            modeSGroup.style.display = 'none';
            facilityGroup.style.display = 'block';
            facilityInput.required = true;
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const role = roleValue.value;
        const mode_s_address = modeSInput.value.trim();
        const facility_designator = facilityInput.value.trim();

        const errorMsg = document.getElementById('error-message');
        if (errorMsg) {
            errorMsg.innerText = '';
            errorMsg.style.display = 'none';
        }

        // Show avionic loader
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
            
            await writeLine('COMPILING TRANSPONDER SIGNATURE...', 100);
            await writeLine(`ROLE DEFINED: ${role.toUpperCase()}`, 150);
            await writeLine('GENERATING LINK-16 DEPLOY KEY...', 200);
            await writeLine('REGISTERING UNIT ID ON SERVER...', 250);
        }

        try {
            await authService.register(username, email, password, role, mode_s_address, facility_designator);
            if (bootLines) {
                const line = document.createElement('div');
                line.textContent = '> UNIT REGISTERED. ESTABLISHING SESSION...';
                line.style.color = '#10b981';
                bootLines.appendChild(line);
            }
            await authService.login(username, password);
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 600);
        } catch (error) {
            console.error('Registration failed:', error);
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
});
