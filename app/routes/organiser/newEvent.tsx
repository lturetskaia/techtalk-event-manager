import type { Route } from '../+types/main';
import { NavLink } from 'react-router';
import { useNavigate } from 'react-router';
import EventForm from '../components/eventForm';
import { postMultipartData } from '~/utils/http';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'TechTalk | New Event' },
    { name: 'New event page', content: 'Create a new event' },
  ];
}

export default function NewEvent() {
  const navigate = useNavigate();
  async function handleSaveEvent(formData: FormData) {
    try {
      const response = await postMultipartData(
        '/organiser/events/new-event',
        formData,
      );
      navigate('/organiser/dashboard');
    } catch (err: any) {
      throw Error(err.message);
    }
  }
  return (
    <main>
      <NavLink to="/organiser/dashboard" className="btn btn-primary">
        {' '}
        &larr; Back to the dashboard
      </NavLink>

      <h2>New event</h2>

      <div className="card-container">
        <EventForm handleSaveEvent={handleSaveEvent} eventData={null} />
      </div>
    </main>
  );
}
