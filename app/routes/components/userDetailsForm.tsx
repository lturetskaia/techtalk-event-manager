import { Button } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import type { UserDetails } from '~/utils/types';

export default function UserDetailsForm({
  user,
  handleFormSubmission,
}: {
  user: UserDetails;
  handleFormSubmission: (event: React.SubmitEvent<HTMLFormElement>) => {};
}) {
  const [userInput, setUserInput] = useState(user);

  function handleUserInput(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value;
    const property = event.currentTarget.name;

    setUserInput((prev) => {
      return { ...prev, [property]: newValue };
    });
  }

  return (
    <Form
      className="row g-4 card"
      id="book-form"
      onSubmit={handleFormSubmission}
    >
      <Col className="col-md-6">
        <Form.Label htmlFor="first-name">First Name</Form.Label>
        <Form.Control
          type="text"
          id="first-name"
          name="first_name"
          min="1"
          max="50"
          value={userInput.first_name}
          aria-describedby="first name"
          onChange={handleUserInput}
          required
        />
      </Col>
      <Col className="col-md-6">
        <Form.Label htmlFor="last-name">Last Name</Form.Label>
        <Form.Control
          type="text"
          id="last-name"
          name="last_name"
          min="1"
          max="50"
          value={userInput.last_name}
          aria-describedby="last name"
          onChange={handleUserInput}
          required
        />
      </Col>
      <Col className="col-md-6">
        <Form.Label htmlFor="email">Email address</Form.Label>
        <Form.Control
          type="email"
          id="email"
          name="email"
          aria-describedby="email"
          value={userInput.email}
          onChange={handleUserInput}
          required
        />
      </Col>
      <Col className="col-md-6">
        <Form.Label htmlFor="phone">Phone</Form.Label>
        <Form.Control
          type="tel"
          id="phone"
          name="phone"
          min="4"
          max="50"
          value={userInput.phone}
          aria-describedby="phone number"
          onChange={handleUserInput}
          required
        />
      </Col>

      <div className="edit-btn">
        <Button type="submit" className=" btn-primary edit-btn">
          Submit
        </Button>
      </div>
    </Form>
  );
}
