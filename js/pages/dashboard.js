import { initializeSidebar } from '../components/sidebar.js';
import * as api from '../services/api.js';
import { showToast } from '../components/toast.js';

export async function initDashboard() {
    if (!api.isAuthenticated()) {
        window.location.replace('login.html');
        return;
    }

    initializeSidebar();
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        dateElement.textContent = new Date().toLocaleDateString('en-US', {weekday:'short', year:'numeric', month:'short', day:'numeric'});
    }

    const user = api.getCurrentUser();
    const name = user?.fullName || user?.username || 'Administrator';
    const welcome = document.querySelector('.page-content h1');
    if (welcome) welcome.textContent = `Welcome back, ${name}`;
    const userName = document.querySelector('.header-user .font-semibold');
    if (userName) userName.textContent = name;

    try {
        const patients = await api.getPatients();
        // Dashboard KPIs should reflect the database, not hard-coded demo figures.
        const values = document.querySelectorAll('.stat-card .value');
        if (values[0]) values[0].textContent = String(patients.length);
        if (values[1]) values[1].textContent = String(patients.filter(p => {
            const created = p.createdAt ? new Date(p.createdAt) : null;
            return created && created.toDateString() === new Date().toDateString();
        }).length);
        if (values[2]) values[2].textContent = String(patients.filter(p => p.status === 'Pending' || p.status === 'Under Review').length);
        if (values[3]) values[3].textContent = String(patients.filter(p => p.status === 'Discharged' && p.updatedAt && new Date(p.updatedAt).toDateString() === new Date().toDateString()).length);
        const activity = document.querySelector('.activity-list');
        if (activity) {
            activity.replaceChildren();
            const recent = patients.slice(0, 5);
            if (!recent.length) {
                const message = document.createElement('p');
                message.className = 'text-muted';
                message.textContent = 'No patient activity yet. Add the first patient from the Patient Directory.';
                activity.append(message);
            } else {
                recent.forEach(patient => {
                    const item = document.createElement('div');
                    item.className = 'activity-item';
                    const bullet = document.createElement('div');
                    bullet.className = 'activity-bullet';
                    const content = document.createElement('div');
                    content.className = 'activity-content';
                    const p = document.createElement('p');
                    const strong = document.createElement('strong');
                    strong.textContent = patient.fullName || 'Patient';
                    p.append(strong, document.createTextNode(` • Status: ${patient.status}`));
                    const time = document.createElement('span');
                    time.textContent = patient.createdAt ? new Date(patient.createdAt).toLocaleString() : 'Recently added';
                    content.append(p, time);
                    item.append(bullet, content);
                    activity.append(item);
                });
            }
        }
    } catch (error) {
        showToast('error', 'Dashboard Unavailable', error.message);
    }
}
