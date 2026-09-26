import type { Route } from './+types/bookings';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'TechTalk | My Bookings' },
    { name: 'My Bookings', content: '' },
  ];
}

export default function Bookings() {
  return (
    <>
      <h1>My Bookings Page</h1>
    </>
  );
}
