import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/landing.tsx"),
  route('create', "routes/create.tsx"),
  route('events', "routes/events.tsx"),
  route('about', "routes/about.tsx"),
  route('public', "routes/public.tsx"),
  route('event/:eventId', "routes/votePage.tsx")
] satisfies RouteConfig;
