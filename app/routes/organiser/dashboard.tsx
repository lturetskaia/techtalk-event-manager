import type { Route } from './+types/dashboard';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'TechTalk || Organiser Dashboard' },
    { name: 'Organiser Dashboard', content: '' },
  ];
}

export default function Dashboard() {
  return (
    <>
      <h1>Organiser Dahsboard Page</h1>
    </>
  );
}
