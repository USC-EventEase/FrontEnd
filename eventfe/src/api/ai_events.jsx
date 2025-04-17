import { AI_BASE_URL } from "../config";

export const get_recommendations = async (event_id) => {
    const response = await fetch(`${AI_BASE_URL}/api/get_recommendations?eventId=${event_id}`, {
        method: "GET",
    })

    const data = await response.json();

    return {
        status: response.status,
        ok: response.ok,
        data
    };
}