export function toggleLoading(show, message = 'Loading...') {
    let overlay = document.getElementById('global-loading');
    
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'global-loading';
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="spinner"></div>
            <div class="loading-text font-medium text-main" id="loading-message"></div>
        `;
        document.body.appendChild(overlay);
    }
    
    const messageEl = overlay.querySelector('#loading-message');
    if (messageEl) messageEl.textContent = message;
    
    if (show) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}
