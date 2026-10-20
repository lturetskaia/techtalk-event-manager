import { NavLink } from 'react-router';
import { Form, Col } from 'react-bootstrap';

export default function EventForm() {
  return (
    <Form className="row g-3 card">
      <h3>General info</h3>
      <Col xs={12}>
        <Form.Label for="eventTitle" class="form-label">
          Event title
        </Form.Label>
        <Form.Control
          type="text"
          name="title"
          minLength={1}
          maxLength={50}
          aria-label="Event title"
          value=""
          required
        />
      </Col>
      <Col xs={12}>
        <Form.Label for="eventDescription" class="form-label">
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
        <Form.Label for="event-image" class="form-label">
          Event image
        </Form.Label>
        <Form.Control
          accept="image/png, image/jpeg"
          type="file"
          aria-label="Event image"
          id="eventImageInput"
          name="eventImage"
        />
        <img id="img-preview" src="" alt="Your event image" />
      </Col>

      <h3>Address and date</h3>
      <Col lg={4}>
        <Form.Label for="eventDate" class="form-label">
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
        <Form.Label for="postcode" class="form-label">
          Postcode
        </Form.Label>
        <Form.Control
          id="postcode"
          name="postcode"
          minLength={1}
          maxLength={15}
          aria-label="Postcode"
          value=""
          required
        />
      </Col>
      <Col lg={4}>
        <Form.Label for="country" class="form-label">
          Country
        </Form.Label>
        <Form.Control
          type="text"
          id="country"
          name="country"
          minLength={1}
          maxLength={50}
          aria-label="Country"
          value=""
          required
        />
      </Col>
      <Col lg={6}>
        <Form.Label for="city" class="form-label">
          City
        </Form.Label>
        <Form.Control
          type="text"
          id="city"
          name="city"
          minLength={1}
          maxLength={50}
          aria-label="City"
          value=""
          required
        />
      </Col>
      <Col lg={6}>
        <Form.Label for="street" class="form-label">
          Street
        </Form.Label>
        <Form.Control
          type="text"
          id="street"
          name="street"
          minLength={1}
          maxLength={50}
          aria-label="Street"
          value=""
          required
        />
      </Col>

      <Col lg={6}>
        <Form.Label for="building_number" class="form-label">
          Building number
        </Form.Label>
        <Form.Control
          type="text"
          id="building_number"
          name="buildingNumber"
          minLength={1}
          maxLength={10}
          aria-label="Building number"
          value=""
        />
      </Col>
      <Col lg={6}>
        <Form.Label for="building_name" class="form-label">
          Building name
        </Form.Label>
        <Form.Control
          type="text"
          id="building_name"
          name="buildingName"
          minLength={1}
          maxLength={50}
          aria-label="Building name"
          value=""
        />
      </Col>

      <h3>Tickets</h3>

      <Col lg={6}>
        <Form.Label for="standard_quantity" class="form-label">
          Number of standard tickets
        </Form.Label>
        <Form.Control
          type="number"
          id="standard_quantity"
          name="standardQuantity"
          min={0}
          aria-label="Number of standard tickets"
          value=""
          required
        />
      </Col>

      <Col lg={6}>
        <Form.Label for="standard_price" class="form-label">
          Standard tickets price (&pound;)
        </Form.Label>
        <Form.Control
          type="number"
          step={0.1}
          id="standard_price"
          name="standardPrice"
          aria-label="Standard tickets price in pounds"
          min={0}
          value=""
          required
        />
      </Col>

      <Col lg={6}>
        <Form.Label for="concession_quantity" class="form-label">
          Number of concession tickets
        </Form.Label>
        <Form.Control
          type="number"
          id="concession_quantity"
          name="concessionQuantity"
          aria-label="Number of concession tickets"
          min={0}
          value=""
          required
        />
      </Col>

      <Col lg={6}>
        <Form.Label for="concession_price" class="form-label">
          Concession tickets price (&pound;)
        </Form.Label>
        <Form.Control
          type="number"
          step={0.1}
          id="concession_price"
          name="concessionPrice"
          aria-label="Concession tickets price in pounds"
          min={0}
          value=""
          required
        />
      </Col>

      <button type="submit" className="btn btn-primary edit-btn">
        Save
      </button>
    </Form>
  );
}
