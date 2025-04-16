import { API_BASE_URL } from "../config";
import Cookies from 'js-cookie';

export const all_events = async () => {
    const response = await fetch(`${API_BASE_URL}/api/user/events`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${Cookies.get("token")}`,
            'Content-Type': 'application/json',
        },
    })

    const data = await response.json();

    return {
        status: response.status,
        ok: response.ok,
        data
    };
}