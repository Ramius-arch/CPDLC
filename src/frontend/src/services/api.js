// API endpoints
const BASE_URL = 'http://localhost:3000/api';

// Authentication service
export const authService = {
    async login(username, password) {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        console.log('Login response:', { status: response.status, data });
        if (!response.ok) throw new Error(data.error);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('Token stored:', data.token);
        return data;
    },

    async register(username, email, password, role, mode_s_address = '', facility_designator = '') {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, role, mode_s_address, facility_designator })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getToken() {
        const token = localStorage.getItem('token');
        console.log('Token retrieved:', token);
        return token;
    },

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};

// Message service
export const messageService = {
    async sendMessage(recipient, content, msgCode = 'UM169', refSeqNum = null) {
        const token = authService.getToken();
        const response = await fetch(`${BASE_URL}/messages/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ recipient, content, msg_code: msgCode, ref_seq_num: refSeqNum })
        });
        const data = await response.json();
        if (response.status === 401) {
            authService.logout();
            window.location.href = 'login.html';
            throw new Error('Session expired');
        }
        if (!response.ok) throw new Error(data.error);
        return data;
    },

    async getHistory() {
        const token = authService.getToken();
        const response = await fetch(`${BASE_URL}/messages/history`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.status === 401) {
            authService.logout();
            window.location.href = 'login.html';
            return [];
        }
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data;
    },

    async getUsers() {
        const token = authService.getToken();
        const response = await fetch(`${BASE_URL}/messages/users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.status === 401) {
            authService.logout();
            window.location.href = 'login.html';
            return [];
        }
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data;
    }
};