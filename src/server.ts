import bodyParser from "body-parser";
import express from "express";
import cors from "express";
import mongoose, { mongo } from "mongoose";
import { DevicePositionsRouter } from "./routes/devicepositions";
import { DeviceRouter } from "./routes/devices";

export class Server {

    public static bootstrap(): Server {
        return new Server();
    }
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
    }

    private config() {

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        // tslint:disable-next-line:max-line-length
        mongoose.connect("mongodb://lelis718:mcf1r3iioabo@target-locator-db-shard-00-00-a0swl.mongodb.net:27017,target-locator-db-shard-00-01-a0swl.mongodb.net:27017,target-locator-db-shard-00-02-a0swl.mongodb.net:27017/test?ssl=true&replicaSet=target-locator-db-shard-0&authSource=admin&retryWrites=true");
        mongoose.connection.on("error", (error) => {
            console.error(error);
        });
        require("./models/device");

        const router = express.Router();
        DeviceRouter.create(router);
        DevicePositionsRouter.create(router);

        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

        this.app.use("/", router);

    }
}
