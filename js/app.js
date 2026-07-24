import { initLogin } from './pages/login.js';
import { initRegister } from './pages/register.js';
import { initDashboard } from './pages/dashboard.js';
import { initPatients } from './pages/patients.js';

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.includes('login.html') || path.endsWith('/')) {
        initLogin();
    } else if (path.includes('register.html')) {
        initRegister();
    } else if (path.includes('dashboard.html')) {
        initDashboard();
    } else if (path.includes('patients.html')) {
        initPatients();
    }
});
