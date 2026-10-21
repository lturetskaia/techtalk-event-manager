import type { OrganiserEventData } from '~/utils/types';
import { Form, Col } from 'react-bootstrap';

export default function EventForm({
  handleSaveEvent,
  eventData = null,
}: {
  handleSaveEvent: (data: any) => Promise<void>;
  eventData: OrganiserEventData | null;
}) {
  async function handleFormSubmission(
    event: React.SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    await handleSaveEvent(data);
  }

  return (
    <Form className="row g-3 card" onSubmit={handleFormSubmission}>
      <h3>General info</h3>
      <Col xs={12}>
        <Form.Label htmlFor="eventTitle" className="form-label">
          Event title
        </Form.Label>
        <Form.Control
          type="text"
          name="title"
          minLength={1}
          maxLength={50}
          aria-label="Event title"
          required
        />
      </Col>
      <Col xs={12}>
        <Form.Label htmlFor="eventDescription" className="form-label">
          Event description
        </Form.Label>
        <Form.Control
          as="textarea"
          id="eventDescription"
          rows={3}
          name="description"
          aria-label="Event description"
          minLength={1}
          maxLength={500}
          required
        ></Form.Control>
      </Col>

      <Col xs={12} lg={4}>
        <Form.Label htmlFor="event-image" className="form-label">
          Event image
        </Form.Label>
        <Form.Control
          accept="image/png, image/jpeg"
          type="file"
          aria-label="Event image"
          id="eventImageInput"
          name="eventImage"
        />
        <img id="img-preview" src="/default-img.png" alt="Your event image" />
      </Col>

      <h3>Address and date</h3>
      <Col lg={4}>
        <Form.Label htmlFor="eventDate" className="form-label">
          Date
        </Form.Label>
        <Form.Control
          type="datetime-local"
          id="eventDate"
          name="date"
          aria-label="Event date"
          required
        />
      </Col>
      <Col lg={4}>
        <Form.Label htmlFor="postcode" className="form-label">
          Postcode
        </Form.Label>
        <Form.Control
          id="postcode"
          name="postcode"
          minLength={1}
          maxLength={15}
          aria-label="Postcode"
          required
        />
      </Col>
      <Col lg={4}>
        <Form.Label htmlFor="country" className="form-label">
          Country
        </Form.Label>
        <Form.Control
          type="text"
          id="country"
          name="country"
          minLength={1}
          maxLength={50}
          aria-label="Country"
          required
        />
      </Col>
      <Col lg={6}>
        <Form.Label htmlFor="city" className="form-label">
          City
        </Form.Label>
        <Form.Control
          type="text"
          id="city"
          name="city"
          minLength={1}
          maxLength={50}
          aria-label="City"
          required
        />
      </Col>
      <Col lg={6}>
        <Form.Label htmlFor="street" className="form-label">
          Street
        </Form.Label>
        <Form.Control
          type="text"
          id="street"
          name="street"
          minLength={1}
          maxLength={50}
          aria-label="Street"
          required
        />
      </Col>

      <Col lg={6}>
        <Form.Label htmlFor="building_number" className="form-label">
          Building number
        </Form.Label>
        <Form.Control
          type="text"
          id="building_number"
          name="buildingNumber"
          minLength={1}
          maxLength={10}
          aria-label="Building number"
        />
      </Col>
      <Col lg={6}>
        <Form.Label htmlFor="building_name" className="form-label">
          Building name
        </Form.Label>
        <Form.Control
          type="text"
          id="building_name"
          name="buildingName"
          minLength={1}
          maxLength={50}
          aria-label="Building name"
        />
      </Col>

      <h3>Tickets</h3>

      <Col lg={6}>
        <Form.Label htmlFor="standard_quantity" className="form-label">
          Number of standard tickets
        </Form.Label>
        <Form.Control
          type="number"
          id="standard_quantity"
          name="standardQuantity"
          min={0}
          aria-label="Number of standard tickets"
          required
        />
      </Col>

      <Col lg={6}>
        <Form.Label htmlFor="standard_price" className="form-label">
          Standard tickets price (&pound;)
        </Form.Label>
        <Form.Control
          type="number"
          step={0.1}
          id="standard_price"
          name="standardPrice"
          aria-label="Standard tickets price in pounds"
          min={0}
          required
        />
      </Col>

      <Col lg={6}>
        <Form.Label htmlFor="concession_quantity" className="form-label">
          Number of concession tickets
        </Form.Label>
        <Form.Control
          type="number"
          id="concession_quantity"
          name="concessionQuantity"
          aria-label="Number of concession tickets"
          min={0}
          required
        />
      </Col>

      <Col lg={6}>
        <Form.Label htmlFor="concession_price" className="form-label">
          Concession tickets price (&pound;)
        </Form.Label>
        <Form.Control
          type="number"
          step={0.1}
          id="concession_price"
          name="concessionPrice"
          aria-label="Concession tickets price in pounds"
          min={0}
          required
        />
      </Col>

      <button type="submit" className="btn btn-primary edit-btn">
        Save
      </button>
    </Form>
  );
}
