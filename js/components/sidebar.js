import * as api from '../services/api.js';
import { showToast } from './toast.js';

export function initializeSidebar() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await api.logout();
            } catch (error) {
                showToast('warning', 'Signed Out Locally', error.message || 'The server could not revoke the token.');
            } finally {
                window.location.replace('login.html');
            }
        });
    }
}
