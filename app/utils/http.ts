import type { BookingData, LoginData, UserDetails } from './types';

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

async function post(
  path: string,
  data: LoginData | BookingData | UserDetails | undefined = undefined,
) {
  const url = `http://localhost:3000${path}`;
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

async function postMultipartData(path: string, data: FormData) {
  const url = `http://localhost:3000${path}`;
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: data,
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw Error(responseData.message);
  }

  return responseData;
}

async function deleteEventData(path: string) {
  const url = `http://localhost:3000${path}`;
  const response = await fetch(url, {
    method: 'DELETE',
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

export { get, post, deleteEventData, postMultipartData };
