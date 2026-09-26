import type { Route } from './+types/settings';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'TechTalk | Settings' },
    { name: 'Organiser Settings', content: '' },
  ];
}

export default function Settings() {
  return (
    <>
      <h1>Organiser Settings Page</h1>
    </>
  );
}
