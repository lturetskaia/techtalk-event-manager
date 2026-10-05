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
    layout('./routes/organiser/organiserMenu.tsx', [
      route('dashboard', './routes/organiser/dashboard.tsx'),
      route('settings', './routes/organiser/settings.tsx'),
    ]),
  ]),
  ...prefix('attendee', [
    layout('./routes/attendee/attendeeNav.tsx', [
      route('events', './routes/attendee/events.tsx'),
      route('events/:eventId', './routes/attendee/event.tsx'),
      route('my-bookings', './routes/attendee/bookings.tsx'),
      route('profile', './routes/attendee/profile.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
