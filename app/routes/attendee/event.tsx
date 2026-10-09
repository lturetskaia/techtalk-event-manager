import type { Route } from './+types/event';
import { useState, useEffect } from 'react';
import EventDetails from './../components/eventDetails';
import type { EventData, OrganiserData } from '../../utils/types';
import BookingForm from '../components/bookingForm';
import { get } from './../../utils/http';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'TechTalk | Event Details' },
    { name: 'Event Details Page', content: '' },
  ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const eventData = await get(`/attendee/events/${params.eventId}`);
  return eventData;
}

export default function Event({ loaderData }: Route.ComponentProps) {
  const [eventBookingData, setEventData] = useState(loaderData);
  console.log(loaderData);

  return (
    <main>
      <h2>{eventBookingData.event.title}</h2>
      <EventDetails
        event={eventBookingData.event}
        tickets={eventBookingData.tickets}
      />

      <h2>Book tickets</h2>

      <BookingForm
        tickets={eventBookingData.tickets}
        user={eventBookingData.user}
        eventId={eventBookingData.event.id}
      />
    </main>
  );
}
