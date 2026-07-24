export function confirmAction(message, onConfirm) {
    if (window.confirm(message)) {
        if (typeof onConfirm === 'function') {
            onConfirm();
        }
    }
}
