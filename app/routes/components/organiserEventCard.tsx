import Card from 'react-bootstrap/Card';
import { ListGroup } from 'react-bootstrap';
import type { OrganiserEventData } from '~/utils/types';
import { Link } from 'react-router';

export default function OrganiserEventCard({
  event,
}: {
  event: OrganiserEventData;
}) {
  const eventPath = '/attendee/events/' + event.id;
  const imageURL = '/' + event.image_path;

  return (
    <Card className="card" id="event-card">
      <Link to={eventPath} className="card-link"></Link>

      <div className="img-container">
        <img
          src={imageURL}
          className="card-img-top"
          alt="A photo of a technology event"
        />
      </div>
      <Card.Body>
        <h3 className="card-title"> {event.title}</h3>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <div>
              <b>Date created:</b>
            </div>
            <div>{event.create_date}</div>
          </ListGroup.Item>

          {event.publish_date ? (
            <ListGroup.Item>
              <div>
                <b>Date published:</b>
              </div>
              <div>{event.publish_date}</div>
            </ListGroup.Item>
          ) : null}

          {event.standardTickets ? (
            <ListGroup.Item>
              <div>
                <b>Standard tickets:</b>
              </div>
              <div>
                {event.standardTickets.total_quantity}{' '}
                <i>( Left: {event.standardTickets.quantity_left} ) </i>
              </div>
            </ListGroup.Item>
          ) : null}

          {event.concessionTickets ? (
            <ListGroup.Item>
              <div>
                <b>Concession tickets</b>
              </div>
              <div>
                {event.concessionTickets.total_quantity}{' '}
                <i>( Left: {event.concessionTickets.quantity_left} )</i>
              </div>
            </ListGroup.Item>
          ) : null}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}
