import * as api from '../services/api.js';

export function initializeSidebar() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            api.logout().then(() => {
                window.location.href = 'login.html';
            });
        });
    }
}
