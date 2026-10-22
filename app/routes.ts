import {
  type RouteConfig,
  index,
  route,
  layout,
  prefix,
} from '@react-router/dev/routes';

export default [
  index('routes/main.tsx'),
  ...prefix('organiser', [
    route('login', './routes/organiser/login.tsx'),
    layout('./routes/organiser/organiserNav.tsx', [
      route('dashboard', './routes/organiser/dashboard.tsx'),
      route('events/new-event', './routes/organiser/newEvent.tsx'),
      route('events/:eventId/edit', './routes/organiser/editEvent.tsx'),
    ]),
  ]),
  ...prefix('attendee', [
    route('login', './routes/attendee/login.tsx'),
    layout('./routes/attendee/attendeeNav.tsx', [
      route('events', './routes/attendee/events.tsx'),
      route('events/:eventId', './routes/attendee/event.tsx'),
      route('my-bookings', './routes/attendee/bookings.tsx'),
      route('profile', './routes/attendee/profile.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
