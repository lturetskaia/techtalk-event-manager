import type { OrganiserRawEventData } from '~/utils/types';
import { Form, Col } from 'react-bootstrap';
import { useState } from 'react';

export default function EventForm({
  handleSaveEvent,
  eventData = null,
}: {
  handleSaveEvent: (formData: FormData) => Promise<void>;
  eventData: OrganiserRawEventData | null;
}) {
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [event, setEvent] = useState<OrganiserRawEventData | null>(eventData);

  function handleChangeImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files![0];
    if (file) {
      const newURL = URL.createObjectURL(file);
      setImageURL(newURL);
    }
  }

  async function handleFormSubmission(
    event: React.SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await handleSaveEvent(formData);
  }

  return (
    <Form className="row g-3 card" onSubmit={handleFormSubmission}>
      <h3>General info</h3>
      <Col xs={12}>
        <Form.Label htmlFor="eventTitle" className="form-label">
          Event title
        </Form.Label>
        <Form.Control
          id="eventTitle"
          type="text"
          name="title"
          minLength={1}
          maxLength={50}
          aria-label="Event title"
          value={event ? event.title : undefined}
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
          value={event ? event.description : undefined}
          required
        ></Form.Control>
      </Col>

      <Col xs={12} lg={4} id="event-image">
        <Form.Label htmlFor="image-input" className="form-label">
          Event image
        </Form.Label>
        <Form.Control
          onChange={handleChangeImage}
          accept="image/png, image/jpeg"
          type="file"
          aria-label="Event image"
          id="image-input"
          name="eventImage"
        />
        {imageURL ? (
          <img id="img-preview" src={imageURL} alt="Your event image" />
        ) : null}
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
          defaultValue={event ? event.date.slice(0, 19) : undefined}
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
          value={event ? event.postcode : undefined}
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
          value={event ? event.country : undefined}
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
          value={event ? event.city : undefined}
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
          value={event ? event.street : undefined}
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
          value={event ? event.building_number : undefined}
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
          value={event ? event.building_name : undefined}
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
          defaultValue={0}
          value={event ? event.standardTickets?.total_quantity : undefined}
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
          defaultValue={0}
          min={0}
          value={event ? event.standardTickets?.price : undefined}
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
          defaultValue={0}
          min={0}
          value={event ? event.concessionTickets?.total_quantity : undefined}
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
          defaultValue={0}
          min={0}
          value={event ? event.concessionTickets?.price : undefined}
          required
        />
      </Col>

      <button type="submit" className="btn btn-primary edit-btn">
        Save
      </button>
    </Form>
  );
}
