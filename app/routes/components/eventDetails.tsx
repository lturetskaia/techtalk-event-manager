import Card from 'react-bootstrap/Card';
import { ListGroup } from 'react-bootstrap';
import { NavLink } from 'react-router';
import { Button } from 'react-bootstrap';

interface EventDetailProps {
  date: string;
  location: string;
  imagePath: string;
  description: string;
}

export default function EventCard({
  date,
  location,
  imagePath,
  description,
}: EventDetailProps) {
  const imageURL = '/' + imagePath;

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
        <p className="card-text">{description}</p>
        <ListGroup variant="flush" className="list-group">
          <ListGroup.Item className="list-group-item">
            <div>
              <b>Date:</b>
            </div>
            <div>{date}</div>
          </ListGroup.Item>
          <ListGroup.Item className="list-group-item">
            <div>
              <b>Location:</b>
            </div>
            <div>{location}</div>
          </ListGroup.Item>
          <ListGroup.Item className="list-group-item event-item-container">
            <div>
              <b>Tickets:</b>
            </div>
            {/* <% tickets.forEach (ticket => {
              if(ticket.quantity_left > 0) {%> */}
            <div className="ticket-details">
              <p>Standard : &pound; 50.00</p>
            </div>
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
