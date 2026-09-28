import type { Route } from './+types/profile';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'TechTalk | My Profile' },
    { name: 'Profile details', content: '' },
  ];
}

export default function Profile() {
  return (
    <>
      <h1>Profile Page</h1>
    </>
  );
}
