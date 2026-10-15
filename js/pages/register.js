import { toggleLoading } from '../components/loader.js';
import { showToast } from '../components/toast.js';
import { validateRegistration } from '../utils/validation.js';
import * as api from '../services/api.js';

export function initRegister() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;

    const submitButton = registerForm.querySelector('button[type="submit"]');
    api.getBootstrapStatus().then(({registration_open: open}) => {
        if (!open) {
            submitButton.disabled = true;
            showToast('warning', 'Registration Closed', 'An administrator already exists. Contact the system administrator.');
        }
    }).catch(error => showToast('error', 'API Unavailable', error.message));

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            username: document.getElementById('username').value.trim(),
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value
        };
        const errors = validateRegistration(formData);
        if (errors.length) {
            showToast('error', 'Validation Error', errors[0].message);
            document.getElementById(errors[0].field)?.focus();
            return;
        }

        try {
            toggleLoading(true, 'Creating Account...');
            const {confirmPassword, ...userPayload} = formData;
            await api.register(userPayload);
            showToast('success', 'Registration Successful', 'Administrator account created.');
            window.location.replace('login.html');
        } catch (error) {
            showToast('error', 'Registration Failed', error.message || 'Could not create account.');
        } finally {
            toggleLoading(false);
        }
    });
}
