import { ListGroup, Card } from 'react-bootstrap';
import type { UserTicketData } from '~/utils/types';
import { NavLink } from 'react-router';

export default function TicketCard({ ticket }: { ticket: UserTicketData }) {
  const eventPath = '/attendee/events/' + ticket.event_id;

  return (
    <Card className="card" id="event-card">
      <NavLink to={eventPath} className="card-link" />

      <div className="img-container">
        <img
          src="https://teapod.dev/api/sample-qr-code.png"
          className="card-img-top"
          id="qr-image"
          alt="A ticket QR code"
        />
        <p className="ticket-number"> #{ticket.id}</p>
      </div>
      <Card.Body className="card-body">
        <h3 className="card-title"> {ticket.title}</h3>
        <ListGroup variant="flush" className="list-group">
          <ListGroup.Item className="list-group-item">
            <div>
              <b>Type:</b>
            </div>
            <div>{ticket.ticket_type}</div>
          </ListGroup.Item>
          <ListGroup.Item className="list-group-item">
            <div>
              <b>Date:</b>
            </div>
            <div>{ticket.date}</div>
          </ListGroup.Item>
          <ListGroup.Item className="list-group-item">
            <div>
              <b>Location:</b>
            </div>
            <div>{ticket.address}</div>
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
}
