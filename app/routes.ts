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
  route('events', './routes/events.tsx'),
  ...prefix('user', [
    route('my-bookings', './routes/user/bookings.tsx'),
    route('profile', './routes/user/profile.tsx'),
  ]),
] satisfies RouteConfig;
