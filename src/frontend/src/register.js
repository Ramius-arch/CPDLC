import { authService } from './services/api';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
    const roleSelect = document.getElementById('role');
    const modeSGroup = document.getElementById('mode-s-group');
    const facilityGroup = document.getElementById('facility-group');

    roleSelect.addEventListener('change', () => {
        if (roleSelect.value === 'pilot') {
            modeSGroup.style.display = 'block';
            facilityGroup.style.display = 'none';
            document.getElementById('facility_designator').required = false;
        } else {
            modeSGroup.style.display = 'none';
            facilityGroup.style.display = 'block';
            document.getElementById('facility_designator').required = true;
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = roleSelect.value;
        const mode_s_address = document.getElementById('mode_s_address').value;
        const facility_designator = document.getElementById('facility_designator').value;

        const errorMsg = document.getElementById('error-message');
        if (errorMsg) {
            errorMsg.innerText = '';
            errorMsg.style.display = 'none';
        }

        try {
            await authService.register(username, email, password, role, mode_s_address, facility_designator);
            await authService.login(username, password);
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Registration failed:', error);
            if (errorMsg) {
                errorMsg.innerText = error.message;
                errorMsg.style.display = 'block';
            } else {
                alert(error.message);
            }
        }
    });

    const loginLink = document.getElementById('login-link');
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    }
});
