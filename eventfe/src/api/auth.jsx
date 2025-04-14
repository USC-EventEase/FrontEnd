const API_BASE_URL = 'http://localhost:3001';

export const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            "email": email, 
            "password": password
        }),
    });

    const data = await response.json();

    return {
        status: response.status,
        ok: response.ok,
        data
    };
};

export const signup = async (name, email, password, type) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "name": name, 
            "email": email, 
            "password": password, 
            "type": type
        }),
    });

    const data = await response.json();

    return {
        status: response.status,
        ok: response.ok,
        data
    };
};