import type { Route } from './+types/dashboard';
import { NavLink } from 'react-router';
import { Card, ListGroup, Tab, Tabs } from 'react-bootstrap';
import { useState } from 'react';
import OrganiserEventCard from '../components/organiserEventCard';
import { get } from './../../utils/http';
import type { OrganiserData, OrganiserEventData } from '~/utils/types';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'TechTalk || Organiser Dashboard' },
    { name: 'Organiser Dashboard', content: '' },
  ];
}

export async function clientLoader() {
  const data = await get('/organiser/dashboard');
  console.log(data);
  return data;
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const [organiser] = useState<OrganiserData>(loaderData.organiser);
  const [events, setEvents] = useState<OrganiserEventData[]>(loaderData.events);

  const hasPublishedEvents =
    events.length > 0 && events.find((event) => event.is_published);

  return (
    <main>
      <NavLink to="/organiser/create-event" className="btn btn-primary">
        {' '}
        + Create new event
      </NavLink>
      <h2>Organiser information</h2>
      <Card id="event-card">
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
          {hasPublishedEvents ? (
            events.map((event) =>
              event.is_published ? <OrganiserEventCard event={event} /> : null,
            )
          ) : (
            <p>There are no published events yet.</p>
          )}
        </Tab>

        {/* Draft Event Cards */}
        <Tab eventKey="draft-events" title="Draft events">
          {hasPublishedEvents ? (
            events.map((event) =>
              !event.is_published ? <OrganiserEventCard event={event} /> : null,
            )
          ) : (
            <p>There are no published events yet.</p>
          )}
        </Tab>
      </Tabs>
    </main>
  );
}
