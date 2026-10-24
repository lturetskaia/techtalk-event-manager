import type { BookingData, LoginData, UserDetails, SignupData } from './types';

async function getData(path: string) {
  const url = import.meta.env.VITE_API_URL + path;
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

async function postData(
  path: string,
  data:
    LoginData | BookingData | UserDetails | SignupData | undefined = undefined,
) {
  const url = import.meta.env.VITE_API_URL + path;
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
  const url = import.meta.env.VITE_API_URL + path;
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
  const url = import.meta.env.VITE_API_URL + path;
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

export { getData, postData, deleteEventData, postMultipartData };
