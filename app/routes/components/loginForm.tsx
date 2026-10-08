import { Form, Button } from 'react-bootstrap';
import type { LoginData } from '~/utils/types';
import { Alert } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '~/utils/AuthContext';

export default function LoginForm() {
  const [loginError, setLoginError] = useState({
    isError: false,
    message: '',
  });

  const { user, login } = useAuth();

  const navigate = useNavigate();

  async function handleFormSubmission(
    event: React.SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const loginData: LoginData = {
      email: data.email.toString() || '',
      password: data.password.toString() || '',
    };

    try {
      const loggedInUser = await login(loginData);
      console.log(loggedInUser);
      //redirect to /organiser/dashboard or attendee/my-bookings
      if (loggedInUser.role === 'ORGANISER') {
        navigate('/organiser/dashboard');
      } else if (loggedInUser.role === 'ATTENDEE') {
        navigate('/attendee/events');
      }
    } catch (err: any) {
      //show error message
      setLoginError({
        isError: true,
        message: 'The user with these credentials has not been found!',
      });
    }
  }
  return (
    <Form className="login" onSubmit={handleFormSubmission}>
      <div className="form-group">
        <Form.Label htmlFor="email">Email address</Form.Label>
        <Form.Control
          type="email"
          id="email"
          name="email"
          aria-describedby="email"
        />
      </div>
      <div className="form-group">
        <Form.Label htmlFor="password">Password</Form.Label>
        <Form.Control type="password" id="password" name="password" />
      </div>
      {loginError.isError ? (
        <Alert variant={'danger'}>{loginError.message}</Alert>
      ) : null}
      <div>
        <Button type="submit" className="btn btn-primary">
          Submit
        </Button>
      </div>
    </Form>
  );
}
