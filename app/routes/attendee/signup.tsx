import type { Route } from '../+types/main';
import SignupForm from '../components/signupForm';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'TechTalk | Signup' },
    { name: 'User signup page', content: '' },
  ];
}

export default function AttendeeSignup() {
  return (
    <main>
      <div className="main-header">
        <h1>User Signup</h1>
        <SignupForm />

        <p id="auth-option-info">
          Already registered? <a href="/attendee/login">Log in</a>
        </p>
      </div>
    </main>
  );
}
