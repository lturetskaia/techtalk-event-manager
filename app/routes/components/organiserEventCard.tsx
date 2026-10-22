import { ListGroup, Card, Button } from 'react-bootstrap';
import type { OrganiserEventData } from '~/utils/types';
import { NavLink } from 'react-router';

export default function OrganiserEventCard({
  eventItem,
  handlePublishEvent,
  handleDeleteEvent,
}: {
  eventItem: OrganiserEventData;
  handlePublishEvent: (eventId: number) => void;
  handleDeleteEvent: (eventId: number) => void;
}) {
  const eventPath = '/attendee/events/' + eventItem.id;
  const imageURL = 'http://localhost:3000/images/' + eventItem.image_path;

  return (
    <Card className="card" id="event-card">
      {/* <Link to={eventPath} className="card-link"></Link> */}

      <div className="img-container">
        <img
          src={imageURL}
          className="card-img-top"
          alt="A photo of a technology event"
        />
      </div>
      <Card.Body>
        <h3 className="card-title"> {eventItem.title}</h3>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <div>
              <b>Date created:</b>
            </div>
            <div>{eventItem.create_date}</div>
          </ListGroup.Item>

          {eventItem.publish_date ? (
            <ListGroup.Item>
              <div>
                <b>Date published:</b>
              </div>
              <div>{eventItem.publish_date}</div>
            </ListGroup.Item>
          ) : null}

          {eventItem.standardTickets ? (
            <ListGroup.Item>
              <div>
                <b>Standard tickets:</b>
              </div>
              <div>
                {eventItem.standardTickets.total_quantity}{' '}
                <i>( Left: {eventItem.standardTickets.quantity_left} ) </i>
              </div>
            </ListGroup.Item>
          ) : null}

          {eventItem.concessionTickets ? (
            <ListGroup.Item>
              <div>
                <b>Concession tickets</b>
              </div>
              <div>
                {eventItem.concessionTickets.total_quantity}{' '}
                <i>( Left: {eventItem.concessionTickets.quantity_left} )</i>
              </div>
            </ListGroup.Item>
          ) : null}
        </ListGroup>
        <div className="event-actions">
          {eventItem.is_published ? (
            <NavLink
              to={`/attendee/events/${eventItem.id}`}
              className="btn btn-secondary"
            >
              View
            </NavLink>
          ) : (
            <>
              <NavLink
                to={`/organiser/events/${eventItem.id}/edit`}
                className="btn btn-primary"
              >
                Edit
              </NavLink>
              <Button
                className="btn btn-secondary publish-btn"
                name="publish"
                onClick={() => handlePublishEvent(eventItem.id)}
              >
                Publish
              </Button>
            </>
          )}
          <Button
            className="btn btn-danger delete-btn"
            onClick={() => handleDeleteEvent(eventItem.id)}
          >
            Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
