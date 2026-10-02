async function fetchEvents() {
  console.log('Fetch events');
  const url = 'http://localhost:3000/attendee/events';
  const response = await fetch(url);

  if (!response.ok) {
    throw Error();
  }

  const eventsData = await response.json();
  return eventsData;
}

export { fetchEvents };
