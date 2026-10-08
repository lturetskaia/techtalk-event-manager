import type { BookingData, LoginData } from './types';

async function fetchEvents() {
  const url = 'http://localhost:3000/attendee/events';
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include', //Required to send session cookies on page reload!
    headers: {
      'Content-Type': 'application/json',
    },
  });

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
    credentials: 'include',
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

async function logIn(loginData: LoginData) {
  const url = `http://localhost:3000/login`;
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(loginData),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw Error(responseData.message);
  }

  return responseData;
}

async function get(path: string) {
  const url = `http://localhost:3000${path}`;
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include', //Required to send session cookies on page reload!
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw Error(responseData.message);
  }

  return responseData;
}

async function post(path: string, data: LoginData | null = null) {
  const url = `http://localhost:3000/login`;
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw Error(responseData.message);
  }

  return responseData;
}

export { fetchEvents, get, post, bookTickets, logIn };
