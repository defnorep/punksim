import { Hono } from "hono";
import { Sim } from "./templates/sim";
import { serveStatic } from "hono/bun";
import { State } from "./src/state";

const app = new Hono();

app.get("/", (c) => c.html(<Sim state={State.empty()} />));
app.use("/public/*", serveStatic({ root: "./" }));

export default app;
