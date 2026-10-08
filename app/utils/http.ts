import type { BookingData, LoginData } from './types';

// async function bookTickets(id: string, bookingData: BookingData) {
//   const url = `http://localhost:3000/attendee/events/${id}/book`;
//   const response = await fetch(url, {
//     method: 'POST',
//     credentials: 'include',
//     body: JSON.stringify(bookingData),
//     headers: {
//       'Content-type': 'application/json; charset=UTF-8',
//     },
//   });

//   const responseData = await response.json();
//   console.log(responseData);

//   if (!response.ok) {
//     throw Error(responseData.message);
//   }

//   return responseData;
// }

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
  data: LoginData | BookingData | undefined = undefined,
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

export { get, post };
