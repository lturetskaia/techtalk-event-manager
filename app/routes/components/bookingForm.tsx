import { Button } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

export default function BookingForm({}) {
  return (
    <Form
      className="row g-3 card"
      id="book-form"
      method="POST"
      action="/attendee/event/<%= eventId %>/book"
    >
      <Col className="col-md-6">
        <Form.Label htmlFor="first-name" className="form-label">
          First name
        </Form.Label>
        <Form.Control
          type="text"
          id="first-name"
          name="firstName"
          min="1"
          max="50"
          value="First name"
          required
        />
      </Col>
      <Col className="col-md-6">
        <Form.Label htmlFor="last-name" className="form-label">
          Last name
        </Form.Label>
        <Form.Control
          type="text"
          id="last-name"
          name="lastName"
          min="1"
          max="50"
          value="Last name"
          required
        />
      </Col>
      <Col className="col-6">
        <Form.Label htmlFor="e-mail" className="form-label">
          Email
        </Form.Label>
        <Form.Control
          type="email"
          id="e-mail"
          name="email"
          placeholder="example@example.com"
          max="254"
          value="jana@example.com"
          required
        />
      </Col>
      <Col className="col-6">
        <Form.Label htmlFor="phone" className="form-label">
          Phone:
        </Form.Label>
        <Form.Control
          type="tel"
          id="phone"
          name="phone"
          placeholder="123-456-7890"
          min="4"
          max="50"
          value="0770050506"
          required
        />
      </Col>
      <Table id="cart-table">
        <thead>
          <tr>
            <th scope="col" className="col-50">
              Ticket type
            </th>
            <th scope="col" className="col-15">
              Price
            </th>
            <th scope="col" className="col-20">
              Amount
            </th>
            <th scope="col" className="col-15">
              Total Price
            </th>
          </tr>
        </thead>
        <tbody>
          {/* <% tickets.forEach (ticket => {
      if(ticket.quantity_left > 0) { %> */}
          <tr className="table-row">
            <td className="start-uppercase">Standard</td>
            <td>&pound;</td>
            <td>
              <div className="form-group col-md-2">
                <input
                  type="number"
                  className="form-control ticket-input"
                  id="<%= ticket.type %>"
                  name="<%= ticket.type %>"
                  value="0"
                  min="0"
                  max="<%= ticket.quantity_left %>"
                />
              </div>
            </td>
            <td>&pound; 0 </td>
          </tr>
        </tbody>
      </Table>

      <div>
        <div className="total-price-container">
          <p id="total-price">
            TOTAL: <span> &pound; 0</span>
          </p>
        </div>
        <div className="book-btn-container">
          <Button type="submit" className="btn btn-primary book-btn">
            Book
          </Button>
        </div>
      </div>
    </Form>
  );
}
