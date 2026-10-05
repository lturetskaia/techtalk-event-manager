import Card from 'react-bootstrap/Card';
import { ListGroup } from 'react-bootstrap';
import { NavLink } from 'react-router';
import { Button } from 'react-bootstrap';
import type { EventData, TicketData } from '~/utils/types';

export default function EventDetails({
  event,
  tickets,
}: {
  event: EventData;
  tickets: TicketData[];
}) {
  const imageURL = '/' + event.image_path;

  return (
    <Card className="card event-details">
      <div className="img-container">
        <img
          src={imageURL}
          className="card-img-top"
          alt="A photo of a technology event"
        />
      </div>
      <Card.Body className="event-details-content">
        <p className="card-text">{event.description}</p>
        <ListGroup variant="flush" className="list-group">
          <ListGroup.Item className="list-group-item">
            <div>
              <b>Date:</b>
            </div>
            <div>{event.date}</div>
          </ListGroup.Item>
          <ListGroup.Item className="list-group-item">
            <div>
              <b>Location:</b>
            </div>
            <div>{event.address}</div>
          </ListGroup.Item>
          <ListGroup.Item className="list-group-item event-item-container">
            <div>
              <b>Tickets:</b>
            </div>
            {tickets.map((ticket) =>
              ticket.quantity_left > 0 ? (
                <div className="ticket-details" key={ticket.id}>
                  <p>
                    {ticket.type} : &pound; {ticket.price}
                  </p>
                </div>
              ) : null,
            )}
          </ListGroup.Item>
          <ListGroup.Item className="list-group-item event-item-container">
            <NavLink to="/attendee/events">
              <Button variant="primary"> &larr; Back to all events</Button>
            </NavLink>
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
}
