import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route('landing', "routes/landing.tsx"),
  route('create', "routes/create.tsx"),
  route('events', "routes/events.tsx")
] satisfies RouteConfig;
