import type { Route } from './+types/main';
import BtnCard from './components/btnCard';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'TechTalk | Main' },
    { name: 'Main page', content: 'Welcome to TeckTalk!' },
  ];
}

export default function Main() {
  return (
    <main>
      <div className="main-header">
        <h1>TechTalk</h1>
        <p>Discover leading IT conferences, hackathons, and webinars.</p>
      </div>
      <div className="main-cards">
        <BtnCard
          title="For Attendees"
          description="Browse thousands of events, secure tickets instantly, and track your tech learning journey."
          btnText="Enter Attendee Hub"
          path="/attendee/events"
        />
        <BtnCard
          title="For Organisers"
          description="Scale your reach, manage ticket sales, and track recent and upcoming events - all in one place."
          btnText="Enter Organiser Hub"
          path="/organiser/dashboard"
        />
      </div>
    </main>
  );
}
