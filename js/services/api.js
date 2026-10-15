const API_BASE_URL = (window.ELRICS_API_BASE_URL || "http://127.0.0.1:8000/api").replace(/\/$/, "");
const TOKEN_KEY = "elrics_auth_token";
const USER_KEY = "elrics_auth_user";

function getToken() {
    return window.localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser() {
    try { return JSON.parse(window.localStorage.getItem(USER_KEY) || "null"); }
    catch { return null; }
}

export function isAuthenticated() {
    return Boolean(getToken());
}

export function clearSession() {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
}

async function request(path, options = {}) {
    const headers = new Headers(options.headers || {});
    if (options.body && !(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
    const token = getToken();
    if (token) headers.set("Authorization", `Token ${token}`);

    let response;
    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            ...options,
            headers,
            // Do not send cookies; the API uses explicit token authentication.
            credentials: "omit",
        });
    } catch {
        throw new Error("Cannot reach the API. Start Django on http://127.0.0.1:8000 and check the configured API URL and CORS settings.");
    }

    if (response.status === 204) return null;
    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json") ? await response.json() : null;
    if (!response.ok) {
        const message = payload?.detail ||
            Object.values(payload || {}).flatMap(value => Array.isArray(value) ? value : [value]).find(value => typeof value === "string") ||
            `Request failed (${response.status}).`;
        if (response.status === 401 && path !== "/auth/login/") {
            clearSession();
            if (!window.location.pathname.endsWith("login.html") && !window.location.pathname.endsWith("register.html")) {
                window.location.href = "login.html";
            }
        }
        throw new Error(String(message));
    }
    return payload;
}

function saveSession(payload) {
    window.localStorage.setItem(TOKEN_KEY, payload.token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
}

export async function login(credentials) {
    const payload = await request("/auth/login/", {method:"POST", body:JSON.stringify(credentials)});
    saveSession(payload);
    return payload.user;
}

export async function logout() {
    try { if (getToken()) await request("/auth/logout/", {method:"POST"}); }
    finally { clearSession(); }
}

export async function getPatients() {
    const payload = await request("/patients/");
    return Array.isArray(payload) ? payload : (payload.results || []);
}

export async function getPatient(id) {
    return request(`/patients/${encodeURIComponent(id)}/`);
}

export async function createPatient(patientData) {
    return request("/patients/", {method:"POST", body:JSON.stringify(patientData)});
}

export async function updatePatient(id, patientData) {
    return request(`/patients/${encodeURIComponent(id)}/`, {method:"PATCH", body:JSON.stringify(patientData)});
}

export async function deletePatient(id) {
    return request(`/patients/${encodeURIComponent(id)}/`, {method:"DELETE"});
}

export async function searchPatients(query) {
    const payload = await request(`/patients/?search=${encodeURIComponent(query)}`);
    return Array.isArray(payload) ? payload : (payload.results || []);
}

export async function register(user) {
    return request("/auth/register/", {method:"POST", body:JSON.stringify(user)});
}

export async function getBootstrapStatus() {
    return request("/auth/bootstrap/");
}
