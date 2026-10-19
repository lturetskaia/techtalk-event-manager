import type { Route } from './+types/dashboard';
import { NavLink } from 'react-router';
import { Card, ListGroup, Tab, Tabs } from 'react-bootstrap';
import { useState } from 'react';
import OrganiserEventCard from '../components/organiserEventCard';
import { get } from './../../utils/http';

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
  const [organiserData, setOrganiserData] = useState();
  const [eventData, setEventData] = useState();
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
            <div className="info">Name </div>
          </ListGroup.Item>
          <ListGroup.Item>
            <div className="description">
              <b>Description:</b>
            </div>
            <div className="info">Something</div>
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
          Tab content for Published events
        </Tab>

        {/* Draft Event Cards */}
        <Tab eventKey="draft-events" title="Draft events">
          Tab content for Draft events
        </Tab>
      </Tabs>

      {/* // Tab content
    <div class="tab-content" id="eventsTabContent">
      <div class="tab-pane fade show active" id="published" role="tabpanel" aria-labelledby="home-tab">
        <!-- Published Event Cards -->
        <div class="card-container">
          <% events.forEach ((event) => {if (event.is_published == true) {%>
          <%- include("../../partials/organiser-event-card", {event}); %>
          <% }}) %>
        </div>
      </div>

      <div class="tab-pane fade" id="draft" role="tabpanel" aria-labelledby="profile-tab">
        <!-- Published Event Cards -->
        <div class="card-container">
          <% events.forEach ((event) => { if (event.is_published == false) {%>
          <%- include("../../partials/organiser-event-card", {event}); %>
          <% }}) %>
        </div>
      </div>
      </div> */}
    </main>
  );
}
