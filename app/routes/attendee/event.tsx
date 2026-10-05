import type { Route } from './+types/events';
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

export default function Events() {
  const [eventsData, setEventData] = useState();
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  let eventAltMessage = 'Loading event details...';

  useEffect(() => {
    //fetch events
    async function startFetching() {
      try {
        // const fetchedData = await fetchEvents();
        // setEventData(fetchedData);
        // console.log(fetchedData);
      } catch (err) {
        setIsError(true);
        eventAltMessage = 'The requested event has not been found.';
      }
    }
    startFetching();
    setIsPending(false);
  }, []);

  return (
    <main>
      {!isError || !isPending ? (
        <>
          <h2>Event Title</h2>
          <EventDetails
            date="10 Dec 2026"
            description="Join top cloud architects for a deep dive into Kubernetes, serverless patterns, and mesh networks. Learn to scale microservices reliably without blowing your infrastructure budget."
            location="New event location"
            imagePath="default-img.png"
          />

          <h2>Book tickets</h2>

          <BookingForm />
        </>
      ) : (
        <div className="card" id="description-card">
          <p>{eventAltMessage}</p>
        </div>
      )}
    </main>
  );
}
