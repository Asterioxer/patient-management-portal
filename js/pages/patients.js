import { toggleLoading } from '../components/loader.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';
import { renderTable } from '../components/table.js';
import { initializeSidebar } from '../components/sidebar.js';
import * as api from '../services/api.js';

// No fallback arrays used
export function initPatients() {
    initializeSidebar();
    
    const refreshBtn = document.getElementById('refreshBtn');
    const searchInput = document.getElementById('searchPatient');
    const addPatientBtn = document.getElementById('addPatientBtn');
    const patientForm = document.getElementById('patientForm');
    const cancelModalBtn = document.getElementById('cancelModalBtn');

    loadPatients();
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadPatients);
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            // Search functionality can be hooked here
        });
    }

    if (addPatientBtn) {
        addPatientBtn.addEventListener('click', () => {
            if (patientForm) patientForm.reset();
            const modalTitle = document.getElementById('modalTitle');
            if (modalTitle) modalTitle.textContent = 'Register New Patient';
            const patientIdInput = document.getElementById('patientId');
            if(patientIdInput) patientIdInput.value = '';
            openModal('patientModal');
        });
    }

    if (cancelModalBtn) {
        cancelModalBtn.addEventListener('click', () => {
            closeModal('patientModal');
        });
    }

    if (patientForm) {
        patientForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(patientForm);
            const patientData = Object.fromEntries(formData.entries());
            
            try {
                toggleLoading(true, 'Saving Patient...');
                const patientIdInput = document.getElementById('patientId');
                const patientId = patientIdInput ? patientIdInput.value : '';
                
                if (patientId) {
                    await api.updatePatient(patientId, patientData);
                    showToast('success', 'Success', 'Patient updated successfully');
                } else {
                    await api.createPatient(patientData);
                    showToast('success', 'Success', 'Patient registered successfully');
                }
                
                closeModal('patientModal');
                await loadPatients();
            } catch (error) {
                showToast('error', 'Error', 'Failed to save patient. Please try again.');
            } finally {
                toggleLoading(false);
            }
        });
    }
}

async function loadPatients() {
    const patientTableBody = document.getElementById('patientTableBody');
    const tableContainer = document.getElementById('tableContainer');
    const emptyState = document.getElementById('emptyState');
    const patientForm = document.getElementById('patientForm');
    
    try {
        toggleLoading(true, 'Loading Patients...');
        const patients = await api.getPatients();
        renderTable(patientTableBody, tableContainer, emptyState, patients, loadPatients, patientForm);
    } catch (error) {
        tableContainer.style.display = 'none';
        emptyState.style.display = 'block';
        
        if (!error.message || !error.message.includes('Implement')) {
            showToast('error', 'Error', error.message || 'Failed to load patients.');
        }
    } finally {
        toggleLoading(false);
    }
}
