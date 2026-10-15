import { toggleLoading } from '../components/loader.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';
import { renderTable } from '../components/table.js';
import { initializeSidebar } from '../components/sidebar.js';
import * as api from '../services/api.js';

export function initPatients() {
    if (!api.isAuthenticated()) {
        window.location.replace('login.html');
        return;
    }
    initializeSidebar();
    const refreshBtn = document.getElementById('refreshBtn');
    const searchInput = document.getElementById('searchPatient');
    const addPatientBtn = document.getElementById('addPatientBtn');
    const patientForm = document.getElementById('patientForm');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const closeModalBtn = document.getElementById('closePatientModalBtn');

    loadPatients();
    refreshBtn?.addEventListener('click', () => loadPatients(searchInput?.value || ''));
    searchInput?.addEventListener('input', () => {
        window.clearTimeout(searchInput._debounceTimer);
        searchInput._debounceTimer = window.setTimeout(() => loadPatients(searchInput.value), 250);
    });
    addPatientBtn?.addEventListener('click', () => {
        patientForm?.reset();
        ensurePatientIdInput().value = '';
        const modalTitle = document.getElementById('modalTitle');
        if (modalTitle) modalTitle.textContent = 'Register New Patient';
        openModal('patientModal');
    });
    cancelModalBtn?.addEventListener('click', () => closeModal('patientModal'));
    closeModalBtn?.addEventListener('click', () => closeModal('patientModal'));

    patientForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const patientData = Object.fromEntries(new FormData(patientForm).entries());
        delete patientData.patientId;
        patientData.age = Number(patientData.age);
        try {
            toggleLoading(true, 'Saving Patient...');
            const patientId = ensurePatientIdInput().value;
            if (patientId) {
                await api.updatePatient(patientId, patientData);
                showToast('success', 'Updated', 'Patient updated successfully.');
            } else {
                await api.createPatient(patientData);
                showToast('success', 'Created', 'Patient registered successfully.');
            }
            closeModal('patientModal');
            await loadPatients(searchInput?.value || '');
        } catch (error) {
            showToast('error', 'Unable to Save Patient', error.message || 'Please check the values and try again.');
        } finally {
            toggleLoading(false);
        }
    });
}

function ensurePatientIdInput() {
    let idInput = document.getElementById('patientId');
    if (!idInput) {
        idInput = document.createElement('input');
        idInput.type = 'hidden';
        idInput.id = 'patientId';
        idInput.name = 'patientId';
        document.getElementById('patientForm')?.appendChild(idInput);
    }
    return idInput;
}

async function loadPatients(query = '') {
    const patientTableBody = document.getElementById('patientTableBody');
    const tableContainer = document.getElementById('tableContainer');
    const emptyState = document.getElementById('emptyState');
    const patientForm = document.getElementById('patientForm');
    if (!patientTableBody || !tableContainer || !emptyState) return;
    try {
        toggleLoading(true, 'Loading Patients...');
        const patients = query ? await api.searchPatients(query) : await api.getPatients();
        renderTable(patientTableBody, tableContainer, emptyState, patients, () => loadPatients(query), patientForm);
        const note = document.querySelector('.page-content .text-center p');
        if (note) note.textContent = `${patients.length} patient record(s) returned by the API. Do not use real patient data in this demo.`;
    } catch (error) {
        tableContainer.style.display = 'none';
        emptyState.style.display = 'block';
        const title = emptyState.querySelector('h3');
        const description = emptyState.querySelector('p');
        if (title) title.textContent = 'Unable to Load Patient Records';
        if (description) description.textContent = error.message || 'Check that the backend is running and try again.';
        showToast('error', 'Patient Load Failed', error.message || 'Could not load patients.');
    } finally {
        toggleLoading(false);
    }
}
