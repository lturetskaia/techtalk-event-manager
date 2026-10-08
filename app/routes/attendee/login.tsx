import type { Route } from '../+types/main';
import LoginForm from '../components/loginForm';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'TechTalk | Login' },
    { name: 'User login page', content: '' },
  ];
}

export default function AttendeeLogin() {
  return (
    <main>
      <div className="main-header">
        <h1>User Login</h1>
        <LoginForm />
        <p id="auth-option-info">
          Not registered? <a href="/attendee/signup">Create an account</a>
        </p>
      </div>
    </main>
  );
}
