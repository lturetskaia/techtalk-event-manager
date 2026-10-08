import { Form, Button } from 'react-bootstrap';
import type { LoginData } from '~/utils/types';
import { logIn } from '~/utils/http';

export default function LoginForm() {
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
      const response = await logIn(loginData);
      console.log('Successful login: ', response);
    } catch (err: any) {
      //show error message
      console.log('Failed login: ', err);
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
      <div>
        <Button type="submit" className="btn btn-primary">
          Submit
        </Button>
      </div>
    </Form>
  );
}
