import { API_BASE_URL, AI_BASE_URL } from "../config";
import Cookies from 'js-cookie';
 
export const get_event = async (event_id) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/event/${event_id}`, {
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

export const get_all_events = async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/events`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${Cookies.get("token")}`,
            'Content-Type': 'application/json',
        }
    })

    const data = await response.json();

    return {
        status: response.status,
        ok: response.ok,
        data
    }
};

export const update_event = async (event_id, eventName, eventDescription, eventDate, eventTime, eventGenre, uploadedUrl, eventLocation, vipTickets, vipPrice, vipCurrPrice, vipAvailableTickets, vipTotalTickets, generalTickets, generalPrice, genCurrPrice, genAvailableTickets, genTotalTickets) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/event/${event_id}`, {
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${Cookies.get("token")}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            event_name: eventName,
          event_description: eventDescription,
          event_date: eventDate,
          event_time: eventTime,
          event_genre: eventGenre,
          event_image: uploadedUrl,
          event_location: eventLocation,
          tickets: {
            VIP: {
              total_tickets: vipTickets,
              original_price: vipPrice,
              current_price: vipCurrPrice,
              available_tickets: vipTickets > vipAvailableTickets 
                                  ? vipAvailableTickets + (vipTickets - vipTotalTickets)
                                  : vipTickets,
            },
            Regular: {
              total_tickets: generalTickets,
              original_price: generalPrice,
              current_price: genCurrPrice,
              available_tickets: generalTickets > genAvailableTickets
                                  ? genAvailableTickets + (generalTickets - genTotalTickets)
                                  : generalTickets,
            },
          },
        }),
    })

    const data = await response.json();

    return {
        status: response.status,
        ok: response.ok,
        data
    };

};

export const create_event = async (eventName, eventDescription, eventDate, eventTime, eventGenre, uploadedUrl, eventLocation, vipTickets, vipPrice, generalTickets, generalPrice) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/event`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${Cookies.get("token")}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            event_name: eventName,
            event_description: eventDescription,
            event_date: eventDate,
            event_time: eventTime,
            event_genre: eventGenre,
            event_image: uploadedUrl,
            event_location: eventLocation,
            tickets: {
              VIP: {
                total_tickets: vipTickets,
                original_price: vipPrice,
                current_price: vipPrice,
                available_tickets: vipTickets,
              },
              Regular: {
                total_tickets: generalTickets,
                original_price: generalPrice,
                current_price: generalPrice,
                available_tickets: generalTickets,
              },
            },
          }),
    })

    const data = await response.json();

    return {
        status: response.status,
        ok: response.ok,
        data
    }
};

export const get_chart_data = async() => {
    const response = await fetch(`${API_BASE_URL}/api/analytics/getanalytics/${Cookies.get("userId")}`, {
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

export const delete_event = async(event_id) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/event/${event_id}`, {
        method: "DELETE",
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

export const crowd_prediction = async(genre, date, capacity, price, location) => {
    const response = await fetch(`${AI_BASE_URL}/api/get_crowd_predictions`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventDetails: {
            type: genre,
            date: date,
            capacity: capacity,
            ticket_price: price,
            location: location
          }
        })
      });
      

    const data = await response.json();

    return {
        status: response.status,
        ok: response.ok,
        data
    };
};