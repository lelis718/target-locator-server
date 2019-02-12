import http from "http";
import { Server } from "./server";

const httpPort = process.env.PORT || 3000;
const app = Server.bootstrap().app;
app.set("port", httpPort);
const httpServer = http.createServer(app);

httpServer.on("error", (error) => {
    console.error(`Error listening to port ${httpPort}`, error);
});

httpServer.on("listening", () => {
    const addr = httpServer.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    console.debug(`Listening on ${bind}`);
});

httpServer.listen(httpPort);
