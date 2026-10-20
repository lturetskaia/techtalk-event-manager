import type { Route } from '../+types/main';
import { NavLink } from 'react-router';
import { Form, Col } from 'react-bootstrap';
import EventForm from '../components/eventForm';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'TechTalk | New Event' },
    { name: 'New event page', content: 'Create a new event' },
  ];
}

export default function NewEvent() {
  return (
    <main>
      <NavLink to="/organiser/dashboard" className="btn btn-primary">
        {' '}
        &larr; Back to the dashboard
      </NavLink>
      <div className="main-header">
        <h2>New event</h2>
      </div>

      <EventForm />
    </main>
  );
}
