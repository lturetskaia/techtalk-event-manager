import Card from 'react-bootstrap/Card';
import { ListGroup } from 'react-bootstrap';
import type { EventData } from '~/utils/types';

export default function EventCard({
  id,
  title,
  date,
  address,
  image_path,
}: EventData) {
  const eventPath = '/attendee/events/' + id;
  const imageURL = '/' + image_path;

  return (
    <Card className="card" id="event-card">
      <a href={eventPath} className="card-link"></a>

      <div className="img-container">
        <img
          src={imageURL}
          className="card-img-top"
          alt="A photo of a technology event"
        />
      </div>
      <Card.Body className="card-body">
        <h3 className="card-title"> {title}</h3>
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
            <div>{address}</div>
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
}
