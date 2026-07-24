import { initializeSidebar } from '../components/sidebar.js';

export function initDashboard() {
    initializeSidebar();
    
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        dateElement.textContent = new Date().toLocaleDateString('en-US', dateOptions);
    }
}
