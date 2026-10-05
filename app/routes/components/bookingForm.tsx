import { Button } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { useState } from 'react';
import type { TicketData, UserDetails, BookingData } from '~/utils/types';
import { bookTickets } from '~/utils/http';

export default function BookingForm({
  tickets,
  eventId,
  user,
}: {
  tickets: TicketData[];
  eventId: string;
  user: UserDetails | undefined;
}) {
  const [ticketsChosen, setTicketsChosen] = useState({
    standard: 0,
    concession: 0,
  });

  //Ticket prices
  const standardTicket = tickets.find((ticket) => ticket.type === 'standard');
  const standardPrice = standardTicket ? Number(standardTicket.price) : 0;

  const concessionTicket = tickets.find(
    (ticket) => ticket.type === 'concession',
  );
  const concessionPrice = concessionTicket ? Number(concessionTicket.price) : 0;

  //Total price of all chosen tickets
  const totalPrice =
    ticketsChosen.standard * Number(standardPrice) +
    ticketsChosen.concession * concessionPrice;

  function handleFormSubmission(formData: FormData) {
    console.log('form triggered');
    const bookingData = {
      first_name: formData.get('first_name')?.toString() || '',
      last_name: formData.get('last_name')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      phone: formData.get('phone')?.toString() || '',
      standard: formData.get('standard')?.toString() || '0',
      concession: formData.get('concession')?.toString() || '0',
    };

    console.log(bookingData);
    bookTickets(eventId, bookingData);
  }

  function handleChangeTicketAmount(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const inputEl = event.target;

    if (inputEl.id === 'standard') {
      console.log('Increase standard');
      setTicketsChosen((prev) => ({
        ...prev,
        standard: Number(inputEl.value),
      }));
    } else {
      console.log('Increase concession');
      setTicketsChosen((prev) => ({
        ...prev,
        concession: Number(inputEl.value),
      }));
    }
  }
  return (
    <Form className="row g-3 card" id="book-form" action={handleFormSubmission}>
      <Col className="col-md-6">
        <Form.Label htmlFor="first-name" className="form-label">
          First name
        </Form.Label>
        <Form.Control
          type="text"
          id="first-name"
          name="first_name"
          min="1"
          max="50"
          value={user ? user.first_name : ''}
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
          name="last_name"
          min="1"
          max="50"
          value={user ? user.last_name : ''}
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
          value={user ? user.email : ''}
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
          value={user ? user.phone : ''}
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
          {tickets.map((ticket) => {
            if (ticket.quantity_left > 0) {
              return (
                <tr className="table-row" key={ticket.type}>
                  <td className="start-uppercase">{ticket.type}</td>
                  <td>&pound; {ticket.price}</td>
                  <td>
                    <div className="form-group col-md-2">
                      <input
                        type="number"
                        className="form-control ticket-input"
                        id={ticket.type}
                        name={ticket.type}
                        value={
                          ticket.type === 'standard'
                            ? ticketsChosen.standard
                            : ticketsChosen.concession
                        }
                        onChange={handleChangeTicketAmount}
                        min="0"
                        max={ticket.quantity_left}
                      />
                    </div>
                  </td>
                  <td>
                    &pound;{' '}
                    {ticket.type === 'standard'
                      ? ticketsChosen.standard * Number(ticket.price)
                      : ticketsChosen.concession * Number(ticket.price)}{' '}
                  </td>
                </tr>
              );
            }
          })}
        </tbody>
      </Table>

      <div>
        <div className="total-price-container">
          <p id="total-price">
            TOTAL: <span> &pound; {totalPrice}</span>
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
