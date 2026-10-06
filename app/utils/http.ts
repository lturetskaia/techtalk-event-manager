import type { BookingData } from './types';

async function fetchEvents() {
  const url = 'http://localhost:3000/attendee/events';
  const response = await fetch(url);

  if (!response.ok) {
    throw Error();
  }

  const eventsData = await response.json();
  return eventsData;
}

async function bookTickets(id: string, bookingData: BookingData) {
  const url = `http://localhost:3000/attendee/events/${id}/book`;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(bookingData),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  const responseData = await response.json();
  console.log(responseData);

  if (!response.ok) {
    throw Error(responseData.message);
  }

  return responseData;
}

export { fetchEvents, bookTickets };
