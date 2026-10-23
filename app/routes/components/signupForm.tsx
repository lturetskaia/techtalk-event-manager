import { Form, Button } from 'react-bootstrap';
import type { SignupData } from '~/utils/types';
import { Alert } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { postData } from '~/utils/http';

export default function SignupForm() {
  const [signupError, setSignupError] = useState({
    isError: false,
    message: '',
  });

  const navigate = useNavigate();

  async function handleFormSubmission(
    event: React.SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const signupData: SignupData = {
      email: data.email.toString(),
      password: data.password.toString(),
      first_name: data.firstName.toString(),
      last_name: data.lastName.toString(),
      phone: data.phone.toString(),
    };

    try {
      await postData('/attendee/signup', signupData);
      navigate('/attendee/login');
    } catch (err: any) {
      //show error message
      setSignupError({
        isError: true,
        message:
          err.message ||
          'Something went wrong! Please check your input information and try again.',
      });
    }
  }
  return (
    <Form className="login" onSubmit={handleFormSubmission}>
      <Form.Group>
        <Form.Label htmlFor="email">Email address</Form.Label>
        <Form.Control
          type="email"
          id="email"
          name="email"
          aria-describedby="email"
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="first-name">First Name</Form.Label>
        <Form.Control
          type="text"
          id="first-name"
          name="firstName"
          aria-describedby="First Name"
          minLength={1}
          maxLength={50}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="last-name">Last Name</Form.Label>
        <Form.Control
          type="text"
          id="last-name"
          name="lastName"
          aria-describedby="Last Name"
          minLength={1}
          maxLength={50}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="phone">Phone number</Form.Label>
        <Form.Control
          type="tel"
          id="phone"
          name="phone"
          aria-describedby="Phone number"
          minLength={4}
          maxLength={50}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label htmlFor="password">Password</Form.Label>
        <Form.Control type="password" id="password" name="password" />
      </Form.Group>
      {signupError.isError ? (
        <Alert variant={'danger'}>{signupError.message}</Alert>
      ) : null}
      <div>
        <Button type="submit" className="btn btn-primary">
          Submit
        </Button>
      </div>
    </Form>
  );
}
