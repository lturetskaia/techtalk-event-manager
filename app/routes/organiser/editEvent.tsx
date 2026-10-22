import type { Route } from './+types/editEvent';
import { NavLink } from 'react-router';
import { useNavigate } from 'react-router';
import EventForm from '../components/eventForm';
import { postMultipartData, get } from '~/utils/http';
import type { OrganiserRawEventData } from '../../utils/types';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'TechTalk | Edit Event' },
    { name: 'Edit event page', content: 'Edit the event' },
  ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const eventData: OrganiserRawEventData = await get(
    `/organiser/events/${params.eventId}`,
  );
  return eventData;
}

export default function EditEvent({
  loaderData,
}: {
  loaderData: OrganiserRawEventData;
}) {
  const navigate = useNavigate();
  async function handleSaveEvent(formData: FormData) {
    try {
      const response = await postMultipartData(
        '/organiser/events/eventId',
        formData,
      );
      navigate('/organiser/dashboard');
    } catch (e) {
      //show error message
    }
  }
  return (
    <main>
      <NavLink to="/organiser/dashboard" className="btn btn-primary">
        {' '}
        &larr; Back to the dashboard
      </NavLink>

      <h2>{loaderData.title}</h2>

      <div className="card-container">
        <EventForm handleSaveEvent={handleSaveEvent} eventData={loaderData} />
      </div>
    </main>
  );
}
