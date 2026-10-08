import type { Route } from './+types/event';
import { useState, useEffect } from 'react';
import EventDetails from './../components/eventDetails';
import type { EventData, OrganiserData } from '../../utils/types';
import BookingForm from '../components/bookingForm';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'TechTalk | Event Details' },
    { name: 'Event Details Page', content: '' },
  ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const url = `http://localhost:3000/attendee/events/${params.eventId}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw Error('The page you are looking for does not exist.');
  }

  const eventData = await response.json();
  return eventData;
}

export default function Event({ loaderData }: Route.ComponentProps) {
  const [eventsData, setEventData] = useState(loaderData);
  console.log(loaderData);

  return (
    <main>
      <h2>{eventsData.event.title}</h2>
      <EventDetails event={eventsData.event} tickets={eventsData.tickets} />

      <h2>Book tickets</h2>

      <BookingForm
        tickets={eventsData.tickets}
        user={eventsData.user}
        eventId={eventsData.event.id}
      />
    </main>
  );
}
