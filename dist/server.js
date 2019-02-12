"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const devicepositions_1 = require("./routes/devicepositions");
const devices_1 = require("./routes/devices");
class Server {
    static bootstrap() {
        return new Server();
    }
    constructor() {
        this.app = express_1.default();
        this.config();
    }
    config() {
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: false }));
        // tslint:disable-next-line:max-line-length
        mongoose_1.default.connect("mongodb://lelis718:mcf1r3iioabo@target-locator-db-shard-00-00-a0swl.mongodb.net:27017,target-locator-db-shard-00-01-a0swl.mongodb.net:27017,target-locator-db-shard-00-02-a0swl.mongodb.net:27017/test?ssl=true&replicaSet=target-locator-db-shard-0&authSource=admin&retryWrites=true");
        mongoose_1.default.connection.on("error", (error) => {
            console.error(error);
        });
        require("./models/device");
        const router = express_1.default.Router();
        devices_1.DeviceRouter.create(router);
        devicepositions_1.DevicePositionsRouter.create(router);
        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        this.app.use("/", router);
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map