import { toggleLoading } from '../components/loader.js';
import { showToast } from '../components/toast.js';
import { validateLogin } from '../utils/validation.js';
import * as api from '../services/api.js';

export function initLogin() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    if (api.isAuthenticated()) {
        window.location.replace('dashboard.html');
        return;
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const errors = validateLogin(username, password);

        if (errors.length) {
            showToast('error', 'Validation Error', errors[0].message);
            (errors[0].field === 'username' ? usernameInput : passwordInput).focus();
            return;
        }

        try {
            toggleLoading(true, 'Authenticating...');
            await api.login({username, password});
            showToast('success', 'Login Successful', 'Welcome back.');
            window.location.replace('dashboard.html');
        } catch (error) {
            showToast('error', 'Login Failed', error.message || 'Invalid credentials. Please try again.');
        } finally {
            toggleLoading(false);
        }
    });
}
