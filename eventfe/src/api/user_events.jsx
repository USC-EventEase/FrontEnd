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
};

export const get_event = async(event_id) => {
    const response = await fetch(`${API_BASE_URL}/api/user/events/${event_id}`, {
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
};

export const register_event = async(event_id, vipTickets, vipPrice, generalTickets, generalPrice) => {
    const response = await fetch(`${API_BASE_URL}/api/user/event/register`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${Cookies.get("token")}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            event_id: event_id,
            tickets: {
                VIP: { count: vipTickets, price: vipPrice },
                Regular: { count: generalTickets, price: generalPrice }
            }
        }),
    })

    const data = await response.json();

    return {
        status: response.status,
        ok: response.ok,
        data
    };
}