import { API_BASE_URL } from "../config";
import Cookies from 'js-cookie';

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

export const verify = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify-token`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${Cookies.get("token")}`,
            'Content-Type': 'application/json',
        }
    });

    const data = await response.json();

    return {
        status: response.status,
        ok: response.ok,
        data
    };
};

export const verifyAdmin = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify-token-admin`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${Cookies.get("token")}`,
            'Content-Type': 'application/json',
        }
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