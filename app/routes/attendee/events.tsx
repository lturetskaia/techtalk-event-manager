import type { Route } from './+types/events';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'TechTalk | Events' },
    { name: 'All events page', content: '' },
  ];
}

export default function Events() {
  return (
    <>
      <h1>Events Page</h1>
    </>
  );
}
