import type { Route } from './+types/dashboard';
import { NavLink } from 'react-router';
import { Card, ListGroup, Tab, Tabs } from 'react-bootstrap';
import { useState } from 'react';
import OrganiserEventCard from '../components/organiserEventCard';
import { getData, postData, deleteEventData } from './../../utils/http';
import type { OrganiserData, OrganiserEventData } from '~/utils/types';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'TechTalk || Organiser Dashboard' },
    { name: 'Organiser Dashboard', content: '' },
  ];
}

export async function clientLoader() {
  const data = await getData('/organiser/dashboard');
  return data;
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const [organiser] = useState<OrganiserData>(loaderData.organiser);
  const [events, setEvents] = useState<OrganiserEventData[]>(loaderData.events);

  const hasPublishedEvents = events.find((event) => event.is_published);
  const hasDraftEvents = events.find((event) => !event.is_published);

  async function handlePublishEvent(eventId: number) {
    const path = `/organiser/events/${eventId}/publish`;
    try {
      await postData(path);
      const newData = await getData('/organiser/dashboard');
      setEvents(newData.events);
    } catch (e) {
      //error message
    }
  }

  async function handleDeleteEvent(eventId: number) {
    const path = `/organiser/events/${eventId}`;
    try {
      await deleteEventData(path);
      const newData = await getData('/organiser/dashboard');
      setEvents(newData.events);
    } catch (e) {
      //error message
    }
  }

  return (
    <main>
      <NavLink to="/organiser/events/new-event" className="btn btn-primary">
        + Create new event
      </NavLink>
      <h2>Organiser information</h2>
      <Card>
        <ListGroup className="list-group-flush organiser-info">
          <ListGroup.Item>
            <div className="description">
              <b>Company name:</b>
            </div>
            <div className="info">{organiser.name}</div>
          </ListGroup.Item>
          <ListGroup.Item>
            <div className="description">
              <b>Description:</b>
            </div>
            <div className="info">{organiser.description}</div>
          </ListGroup.Item>
        </ListGroup>
      </Card>

      <h2>Events</h2>
      {/* Published Event Cards */}
      <Tabs
        defaultActiveKey="published-events"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="published-events" title="Published events">
          <div className="card-container">
            {hasPublishedEvents ? (
              events.map((event) =>
                event.is_published ? (
                  <OrganiserEventCard
                    key={event.id}
                    eventItem={event}
                    handlePublishEvent={handlePublishEvent}
                    handleDeleteEvent={handleDeleteEvent}
                  />
                ) : null,
              )
            ) : (
              <p>There are no published events yet.</p>
            )}
          </div>
        </Tab>

        {/* Draft Event Cards */}
        <Tab eventKey="draft-events" title="Draft events">
          <div className="card-container">
            {hasDraftEvents ? (
              events.map((event) =>
                !event.is_published ? (
                  <OrganiserEventCard
                    key={event.id}
                    eventItem={event}
                    handlePublishEvent={handlePublishEvent}
                    handleDeleteEvent={handleDeleteEvent}
                  />
                ) : null,
              )
            ) : (
              <p>There are no draft events yet.</p>
            )}
          </div>
        </Tab>
      </Tabs>
    </main>
  );
}
