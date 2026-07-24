export function validateRequired(value) {
    return value !== undefined && value !== null && value.trim() !== '';
}

export function validateLogin(username, password) {
    const errors = [];
    if (!validateRequired(username)) {
        errors.push({ field: 'username', message: 'Username is required' });
    }
    if (!validateRequired(password)) {
        errors.push({ field: 'password', message: 'Password is required' });
    }
    return errors;
}
