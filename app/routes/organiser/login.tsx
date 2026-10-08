import type { Route } from '../+types/main';
import LoginForm from '../components/loginForm';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'TechTalk | Login' },
    { name: 'Login page', content: 'Welcome to TeckTalk!' },
  ];
}

export default function OrganiserLogin() {
  return (
    <main>
      <div className="main-header">
        <h1>Organiser Login</h1>
        <LoginForm />
      </div>
    </main>
  );
}
