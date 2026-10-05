import type { Route } from './+types/events';
import EventCard from '../components/eventCard';
import { fetchEvents } from '~/utils/http';
import { useState, useEffect } from 'react';
import type { EventData, OrganiserData } from '../../utils/types';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'TechTalk | Events' },
    { name: 'All events page', content: '' },
  ];
}

interface EventsData {
  events: EventData[];
  organiser: OrganiserData;
}

export default function Events() {
  const [eventsData, setEventsData] = useState<EventsData>();
  const [isPending, setIsPending] = useState(true);
  const [isError, setIsError] = useState(false);
  let altEventsText = 'Loading events...';

  useEffect(() => {
    //fetch events
    async function startFetching() {
      try {
        const fetchedData = await fetchEvents();
        setEventsData(fetchedData);
        console.log(fetchedData);
      } catch (err) {
        setIsError(true);
        altEventsText = 'No upcoming events have been found.';
      }
    }
    startFetching();
    setIsPending(false);
  }, []);

  return (
    <main>
      {isPending || isError || !eventsData ? (
        <div className="card" id="description-card">
          <p>{altEventsText}</p>
        </div>
      ) : (
        <>
          <h2>{eventsData.organiser.name}</h2>
          <div className="card" id="description-card">
            <p>{eventsData.organiser.description}</p>
          </div>

          <h2>Our Events</h2>
          {eventsData.events ? (
            eventsData.events.map((event) => (
              <div className="card-container" key={event.id}>
                <EventCard
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  location={event.address}
                  imagePath={event.image_path}
                ></EventCard>
              </div>
            ))
          ) : (
            <div className="card" id="description-card">
              <p>No upcoming events have been found.</p>
            </div>
          )}
        </>
      )}
    </main>
  );
}
