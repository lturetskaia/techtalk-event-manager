import type { Route } from './+types/events';
import EventCard from '../components/eventCard';
import { fetchEvents } from '~/utils/http';
import { useState, useEffect } from 'react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'TechTalk | Events' },
    { name: 'All events page', content: '' },
  ];
}

export default function Events() {
  const [eventsData, setEventsData] = useState();
  const [pending, setPending] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    //fetch future events
    async function startFetching() {
      try {
        const fetchedData = await fetchEvents();
        setEventsData(fetchedData);
      } catch (err) {
        setError(true);
      }
    }
    startFetching();
    setPending(false);
  }, []);

  return (
    <main>
      <h2>TechTalk: Tech Events UK</h2>
      <div className="card" id="description-card">
        <p>
          At TechTalk, we believe the next big tech breakthrough starts with a
          conversation. We design and organise premier IT events—from deep-dive
          developer workshops and executive roundtables to large-scale tech
          summits—that bring together the brightest minds in the industry.
          Whether you are a startup looking to pitch a game-changing product, a
          developer aiming to master a new framework, or an enterprise leader
          navigating digital transformation, TechTalk is your platform to
          connect, learn, and grow.
        </p>
      </div>

      <h2>Our Events</h2>
      <div className="card-container">
        <EventCard
          id="1"
          title="Title"
          date="Jul 25, 2026, 11:00 AM"
          location="EICC, 150 Morison Street, Edinburgh, UK"
        ></EventCard>

        <EventCard
          id="2"
          title="Title"
          date="Jul 25, 2026, 11:00 AM"
          location="EICC, 150 Morison Street, Edinburgh, UK"
        ></EventCard>
      </div>
    </main>
  );
}
