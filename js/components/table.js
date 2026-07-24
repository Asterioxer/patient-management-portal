import { showToast } from './toast.js';
import { openModal } from './modal.js';
import { toggleLoading } from './loader.js';
import { confirmAction } from '../utils/helpers.js';
import * as api from '../services/api.js';

export function renderTable(patientTableBody, tableContainer, emptyState, currentPatients, onPatientsUpdated, patientForm) {
    if (!patientTableBody) return;
    
    patientTableBody.innerHTML = '';
    
    if (currentPatients.length === 0) {
        tableContainer.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    tableContainer.style.display = 'block';
    emptyState.style.display = 'none';

    currentPatients.forEach(patient => {
        const tr = document.createElement('tr');
        
        let statusBadgeClass = 'badge-info';
        if (patient.status === 'Admitted') statusBadgeClass = 'badge-danger';
        if (patient.status === 'Discharged') statusBadgeClass = 'badge-success';
        if (patient.status === 'Under Review') statusBadgeClass = 'badge-warning';

        tr.innerHTML = `
            <td><span class="font-medium text-main">${patient.id}</span></td>
            <td>${patient.name}</td>
            <td>${patient.age}</td>
            <td>${patient.gender}</td>
            <td>${patient.phone}</td>
            <td><span class="font-medium">${patient.bloodGroup}</span></td>
            <td><span class="badge ${statusBadgeClass}">${patient.status}</span></td>
            <td>
                <div class="flex gap-2">
                    <button class="btn btn-secondary btn-sm action-view" data-id="${patient.id}" title="View">👁️</button>
                    <button class="btn btn-secondary btn-sm action-edit" data-id="${patient.id}" title="Edit">✏️</button>
                    <button class="btn btn-danger-outline btn-sm action-delete" data-id="${patient.id}" title="Delete">🗑️</button>
                </div>
            </td>
        `;
        
        patientTableBody.appendChild(tr);
    });

    attachTableActions(currentPatients, onPatientsUpdated, patientForm);
}

function attachTableActions(currentPatients, onPatientsUpdated, patientForm) {
    document.querySelectorAll('.action-view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            showToast('info', 'View', `View patient details for ${id}`);
        });
    });

    document.querySelectorAll('.action-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            
            document.getElementById('modalTitle').textContent = 'Edit Patient';
            let idInput = document.getElementById('patientId');
            if(!idInput) {
                idInput = document.createElement('input');
                idInput.type = 'hidden';
                idInput.id = 'patientId';
                patientForm.appendChild(idInput);
            }
            idInput.value = id;
            
            const patient = currentPatients.find(p => p.id === id);
            if (patient) {
                const formElements = patientForm.elements;
                if(formElements['fullName']) formElements['fullName'].value = patient.name;
                if(formElements['age']) formElements['age'].value = patient.age;
                if(formElements['gender']) formElements['gender'].value = patient.gender;
                if(formElements['phone']) formElements['phone'].value = patient.phone;
                if(formElements['bloodGroup']) formElements['bloodGroup'].value = patient.bloodGroup;
                if(formElements['status']) formElements['status'].value = patient.status;
            }
            
            openModal('patientModal');
        });
    });

    document.querySelectorAll('.action-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            
            confirmAction('Are you sure you want to delete this patient record? This action cannot be undone.', async () => {
                try {
                    toggleLoading(true, 'Deleting...');
                    await api.deletePatient(id);
                    showToast('success', 'Deleted', `Patient record ${id} has been deleted.`);
                    if (typeof onPatientsUpdated === 'function') {
                        await onPatientsUpdated();
                    }
                } catch (error) {
                    showToast('error', 'Error', 'Failed to delete patient.');
                } finally {
                    toggleLoading(false);
                }
            });
        });
    });
}
