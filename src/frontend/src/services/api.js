// API endpoints
const BASE_URL = 'http://localhost:3000/api';

function getMockMessages() {
    let msgs = localStorage.getItem('mock_messages');
    if (!msgs) {
        const initial = [
            {
                '_id': 'mock-msg-1',
                'sender_id': 'mock-atc-id',
                'sender_username': 'atc1',
                'recipient': 'pilot1',
                'content': 'CLIMB TO FL350',
                'msg_code': 'UM19',
                'seq_num': 0,
                'ref_seq_num': null,
                'status': 'delivered',
                'timestamp': new Date(Date.now() - 600000).toISOString()
            },
            {
                '_id': 'mock-msg-2',
                'sender_id': 'mock-pilot-id',
                'sender_username': 'pilot1',
                'recipient': 'atc1',
                'content': 'WILCO',
                'msg_code': 'DM0',
                'seq_num': 0,
                'ref_seq_num': 0,
                'status': 'delivered',
                'timestamp': new Date(Date.now() - 540000).toISOString()
            },
            {
                '_id': 'mock-msg-3',
                'sender_id': 'mock-pilot-id',
                'sender_username': 'pilot1',
                'recipient': 'atc1',
                'content': 'REQUEST FL370 DUE TURBULENCE',
                'msg_code': 'DM6',
                'seq_num': 1,
                'ref_seq_num': null,
                'status': 'delivered',
                'timestamp': new Date(Date.now() - 300000).toISOString()
            },
            {
                '_id': 'mock-msg-4',
                'sender_id': 'mock-atc-id',
                'sender_username': 'atc1',
                'recipient': 'pilot1',
                'content': 'DESCEND TO FL330 DUE TRAFFIC',
                'msg_code': 'UM20',
                'seq_num': 1,
                'ref_seq_num': 1,
                'status': 'delivered',
                'timestamp': new Date(Date.now() - 240000).toISOString()
            },
            {
                '_id': 'mock-msg-5',
                'sender_id': 'mock-pilot-id',
                'sender_username': 'pilot1',
                'recipient': 'atc1',
                'content': 'WILCO',
                'msg_code': 'DM0',
                'seq_num': 2,
                'ref_seq_num': 1,
                'status': 'delivered',
                'timestamp': new Date(Date.now() - 180000).toISOString()
            }
        ];
        localStorage.setItem('mock_messages', JSON.stringify(initial));
        return initial;
    }
    return JSON.parse(msgs);
}

function saveMockMessages(messages) {
    localStorage.setItem('mock_messages', JSON.stringify(messages));
}

// Authentication service
export const authService = {
    isDemoMode() {
        return localStorage.getItem('demo_mode') === 'true';
    },

    loginDemo(role) {
        localStorage.setItem('demo_mode', 'true');
        localStorage.setItem('token', 'mock-demo-jwt-token');
        const user = role === 'controller' ? {
            username: 'atc1',
            role: 'controller',
            mode_s_address: null,
            facility_designator: 'EGTT'
        } : {
            username: 'pilot1',
            role: 'pilot',
            mode_s_address: 'C0A1F2',
            facility_designator: null
        };
        localStorage.setItem('user', JSON.stringify(user));
        return { token: 'mock-demo-jwt-token', user };
    },

    async login(username, password) {
        localStorage.removeItem('demo_mode');
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    },

    async register(username, email, password, role, mode_s_address = '', facility_designator = '') {
        localStorage.removeItem('demo_mode');
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
        localStorage.removeItem('demo_mode');
        localStorage.removeItem('mock_messages');
    },

    getToken() {
        return localStorage.getItem('token');
    },

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};

// Message service
export const messageService = {
    async sendMessage(recipient, content, msgCode = 'UM169', refSeqNum = null) {
        if (authService.isDemoMode()) {
            const messages = getMockMessages();
            const currentUser = authService.getUser();
            
            const lastMsg = [...messages].reverse().find(
                m => (m.sender_username === currentUser.username && m.recipient === recipient) ||
                     (m.sender_username === recipient && m.recipient === currentUser.username)
            );
            const nextSeqNum = lastMsg ? (lastMsg.seq_num + 1) % 64 : 0;

            const newMsg = {
                '_id': `mock-msg-${Date.now()}`,
                'sender_id': 'mock-user-id',
                'sender_username': currentUser.username,
                'recipient': recipient,
                'content': content,
                'msg_code': msgCode,
                'seq_num': nextSeqNum,
                'ref_seq_num': refSeqNum,
                'status': 'sent',
                'timestamp': new Date().toISOString()
            };

            messages.push(newMsg);
            saveMockMessages(messages);

            setTimeout(() => {
                document.dispatchEvent(new CustomEvent('messagesSent'));
            }, 50);

            // Trigger simulated responder telemetry reaction
            setTimeout(() => {
                const updatedMsgs = getMockMessages();
                let replyContent = 'ROGER';
                let replyCode = 'UM227';
                
                if (content.toUpperCase().includes('REQUEST') || msgCode.startsWith('DM')) {
                    if (msgCode === 'DM6') {
                        replyContent = 'CLIMB TO FL370 APPROVED';
                        replyCode = 'UM19';
                    } else if (msgCode === 'DM10') {
                        replyContent = 'PROCEED DIRECT TO GOMUP';
                        replyCode = 'UM74';
                    } else {
                        replyContent = 'WILCO';
                        replyCode = 'UM0';
                    }
                } else if (msgCode.startsWith('UM')) {
                    replyContent = 'WILCO';
                    replyCode = 'DM0';
                }

                const replyMsg = {
                    '_id': `mock-msg-reply-${Date.now()}`,
                    'sender_id': 'mock-recipient-id',
                    'sender_username': recipient,
                    'recipient': currentUser.username,
                    'content': replyContent,
                    'msg_code': replyCode,
                    'seq_num': (nextSeqNum + 1) % 64,
                    'ref_seq_num': nextSeqNum,
                    'status': 'delivered',
                    'timestamp': new Date().toISOString()
                };

                updatedMsgs.push(replyMsg);
                saveMockMessages(updatedMsgs);
                document.dispatchEvent(new CustomEvent('messagesSent'));
            }, 3000);

            return { message: 'Message sent successfully', seq_num: nextSeqNum };
        }

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
        if (response.status === 401 || response.status === 404) {
            authService.logout();
            window.location.href = 'login.html';
            throw new Error('Session expired');
        }
        if (!response.ok) throw new Error(data.error);
        return data;
    },

    async getHistory() {
        if (authService.isDemoMode()) {
            return getMockMessages();
        }

        const token = authService.getToken();
        const response = await fetch(`${BASE_URL}/messages/history`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.status === 401 || response.status === 404) {
            authService.logout();
            window.location.href = 'login.html';
            return [];
        }
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data;
    },

    async getUsers() {
        if (authService.isDemoMode()) {
            const currentUser = authService.getUser();
            const list = [
                { username: 'pilot1', role: 'pilot', mode_s_address: 'C0A1F2', facility_designator: null },
                { username: 'atc1', role: 'controller', mode_s_address: null, facility_designator: 'EGTT' }
            ];
            return list.filter(u => u.username !== currentUser.username);
        }

        const token = authService.getToken();
        const response = await fetch(`${BASE_URL}/messages/users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.status === 401 || response.status === 404) {
            authService.logout();
            window.location.href = 'login.html';
            return [];
        }
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data;
    }
};