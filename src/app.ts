import fastify from "fastify";
import cookie from "@fastify/cookie";
import { userRoutes } from "./routes/users";
import { mealsRoutes } from "./routes/meals";
import { metricsRoutes } from "./routes/meals-metrics";

export const app = fastify();

app.register(cookie);   
app.register(userRoutes,{ prefix: 'diet/users'});
app.register(mealsRoutes,{ prefix: 'diet/users/:id/meals'});
app.register(metricsRoutes,{ prefix: 'diet/users/:id/meals/metrics'});