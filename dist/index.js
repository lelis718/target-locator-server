"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const server_1 = require("./server");
const httpPort = process.env.PORT || 3000;
const app = server_1.Server.bootstrap().app;
app.set("port", httpPort);
const httpServer = http_1.default.createServer(app);
httpServer.on("error", (error) => {
    console.error(`Error listening to port ${httpPort}`, error);
});
httpServer.on("listening", () => {
    const addr = httpServer.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    console.debug(`Listening on ${bind}`);
});
httpServer.listen(httpPort);
//# sourceMappingURL=index.js.map