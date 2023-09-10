import { Hono } from "hono";
import { Sim } from "./templates/sim";
import { serveStatic } from "hono/bun";
import { newState } from "./src/sim";

const app = new Hono();

app.get("/", (c) => c.html(<Sim state={newState()} />));
app.use("/public/*", serveStatic({ root: "./" }));

export default app;
