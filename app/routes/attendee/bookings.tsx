import type { Route } from './+types/bookings';
import { useState } from 'react';
import { getData } from './../../utils/http';
import type { UserTicketData } from './../../utils/types';
import { NavLink } from 'react-router';
import TicketCard from '../components/ticketCard';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'TechTalk | My Bookings' },
    { name: 'My Bookings', content: '' },
  ];
}

export async function clientLoader() {
  const bookingData = await getData('/attendee/my-bookings');
  return bookingData.userTicketsData;
}

export default function Bookings({ loaderData }: Route.ComponentProps) {
  const [bookingData, setBookingData] = useState<UserTicketData[]>(loaderData);

  return (
    <main>
      <h2>My Bookings Page</h2>
      <div className="card-container">
        {bookingData.length > 0 ? (
          bookingData.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))
        ) : (
          <p>
            No tickets have been found. Register for our{' '}
            <NavLink to="/attendee/events">upcoming events</NavLink>.
          </p>
        )}
      </div>
    </main>
  );
}
