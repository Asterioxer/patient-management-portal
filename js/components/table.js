import { showToast } from './toast.js';
import { openModal } from './modal.js';
import { toggleLoading } from './loader.js';
import { confirmAction } from '../utils/helpers.js';
import * as api from '../services/api.js';

function makeCell(text) {
    const td = document.createElement('td');
    td.textContent = text == null ? '' : String(text);
    return td;
}

export function renderTable(patientTableBody, tableContainer, emptyState, currentPatients, onPatientsUpdated, patientForm) {
    if (!patientTableBody || !tableContainer || !emptyState) return;
    patientTableBody.replaceChildren();

    if (!currentPatients.length) {
        tableContainer.style.display = 'none';
        emptyState.style.display = 'block';
        const title = emptyState.querySelector('h3');
        const description = emptyState.querySelector('p');
        if (title) title.textContent = 'No Patient Records Found';
        if (description) description.textContent = 'There are no patients matching your current search.';
        return;
    }
    tableContainer.style.display = 'block';
    emptyState.style.display = 'none';

    currentPatients.forEach(patient => {
        const tr = document.createElement('tr');
        const id = String(patient.id);
        const name = patient.fullName ?? patient.name ?? '';
        tr.append(makeCell(id), makeCell(name), makeCell(patient.age), makeCell(patient.gender), makeCell(patient.phone));
        const bloodCell = makeCell(patient.bloodGroup ?? patient.blood_group ?? '');
        bloodCell.className = 'font-medium';
        tr.append(bloodCell);

        const statusCell = document.createElement('td');
        const badge = document.createElement('span');
        badge.className = 'badge ' + ({
            'Admitted':'badge-danger', 'Discharged':'badge-success',
            'Under Review':'badge-warning', 'Pending':'badge-info'
        }[patient.status] || 'badge-info');
        badge.textContent = patient.status || 'Pending';
        statusCell.append(badge);
        tr.append(statusCell);

        const actionCell = document.createElement('td');
        const actions = document.createElement('div');
        actions.className = 'flex gap-2';
        for (const [label, cls, glyph] of [
            ['View', 'action-view', '👁️'], ['Edit', 'action-edit', '✏️'], ['Delete', 'action-delete', '🗑️']
        ]) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn ' + (cls === 'action-delete' ? 'btn-danger-outline' : 'btn-secondary') + ' btn-sm ' + cls;
            button.dataset.id = id;
            button.title = label;
            button.setAttribute('aria-label', `${label} patient ${name}`);
            button.textContent = glyph;
            actions.append(button);
        }
        actionCell.append(actions);
        tr.append(actionCell);
        patientTableBody.append(tr);
    });

    patientTableBody.querySelectorAll('.action-view').forEach(button => {
        button.addEventListener('click', () => {
            const patient = currentPatients.find(item => String(item.id) === button.dataset.id);
            if (!patient) return;
            showToast('info', patient.fullName || patient.name, `Age ${patient.age} • ${patient.gender} • ${patient.status} • ${patient.phone}`);
        });
    });

    patientTableBody.querySelectorAll('.action-edit').forEach(button => {
        button.addEventListener('click', () => {
            const patient = currentPatients.find(item => String(item.id) === button.dataset.id);
            if (!patient || !patientForm) return;
            document.getElementById('modalTitle').textContent = 'Edit Patient';
            let idInput = document.getElementById('patientId');
            if (!idInput) {
                idInput = document.createElement('input');
                idInput.type = 'hidden';
                idInput.id = 'patientId';
                idInput.name = 'patientId';
                patientForm.append(idInput);
            }
            idInput.value = patient.id;
            const fields = patientForm.elements;
            if (fields.fullName) fields.fullName.value = patient.fullName ?? patient.name ?? '';
            if (fields.age) fields.age.value = patient.age ?? '';
            if (fields.gender) fields.gender.value = patient.gender ?? '';
            if (fields.phone) fields.phone.value = patient.phone ?? '';
            if (fields.email) fields.email.value = patient.email ?? '';
            if (fields.bloodGroup) fields.bloodGroup.value = patient.bloodGroup ?? patient.blood_group ?? '';
            if (fields.status) fields.status.value = patient.status ?? 'Pending';
            if (fields.address) fields.address.value = patient.address ?? '';
            if (fields.emergencyContact) fields.emergencyContact.value = patient.emergencyContact ?? patient.emergency_contact ?? '';
            openModal('patientModal');
        });
    });

    patientTableBody.querySelectorAll('.action-delete').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            confirmAction('Are you sure you want to delete this patient record? This action cannot be undone.', async () => {
                try {
                    toggleLoading(true, 'Deleting...');
                    await api.deletePatient(id);
                    showToast('success', 'Deleted', `Patient record ${id} has been deleted.`);
                    if (typeof onPatientsUpdated === 'function') await onPatientsUpdated();
                } catch (error) {
                    showToast('error', 'Delete Failed', error.message || 'Failed to delete patient.');
                } finally {
                    toggleLoading(false);
                }
            });
        });
    });
}
