import { toggleLoading } from '../components/loader.js';
import { showToast } from '../components/toast.js';
import { validateRegistration } from '../utils/validation.js';
import * as api from '../services/api.js';

export function initRegister() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
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
            
            if (errors.length > 0) {
                showToast('error', 'Validation Error', errors[0].message);
                const errorField = document.getElementById(errors[0].field);
                if (errorField) errorField.focus();
                return;
            }
            
            try {
                toggleLoading(true, 'Creating Account...');
                
                // Exclude confirmPassword when sending to API
                const { confirmPassword, ...userPayload } = formData;
                await api.register(userPayload);
                
                showToast('success', 'Registration Successful', 'Administrator account created.');
                
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
                
            } catch (error) {
                if (error.message && error.message.includes('Implement')) {
                    showToast('info', 'Backend Not Connected', 'Please implement the register API to continue.');
                } else {
                    showToast('error', 'Registration Failed', error.message || 'An error occurred during registration.');
                }
            } finally {
                toggleLoading(false);
            }
        });
    }
}
