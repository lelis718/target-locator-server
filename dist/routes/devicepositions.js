"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const device_1 = require("../models/device");
const deviceposition_1 = require("../models/deviceposition");
class DevicePositionsRouter {
    static create(router) {
        router.route("/device-positions/:managerId/:deviceId")
            .get((req, res, next) => {
            new DevicePositionsRouter().list(req, res, next);
        });
        router.route("/device-positions/:deviceId")
            .post((req, res, next) => {
            new DevicePositionsRouter().insert(req, res, next);
        });
        router.route("/device-positions/:managerId/:deviceId/clear")
            .post((req, res, next) => {
            new DevicePositionsRouter().deleteAll(req, res, next);
        });
    }
    list(req, res, next) {
        device_1.Devices.find({ managerId: req.params.managerId, deviceId: req.params.deviceId }).then((deviceFound) => {
            if (deviceFound) {
                deviceposition_1.DevicePositions.find({ deviceId: req.params.deviceId }, ["latitude", "longitude", "createdAt"], {
                    sort: {
                        createdAt: -1
                    }
                }).then((devs) => {
                    res.json(devs.map((item) => item.toObject()));
                    next();
                }).catch(next);
            }
            else {
                res.status(404).json({ message: `${req.params.deviceId} not found.` });
                next();
            }
        });
    }
    insert(req, res, next) {
        const devicePosition = {
            createdAt: new Date(),
            deviceId: req.params.deviceId,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
        };
        const validation = this.validateInput(devicePosition);
        if (!validation.result) {
            res.status(400).send({ message: validation.message });
            next();
            return;
        }
        deviceposition_1.DevicePositions.create(devicePosition).then((result) => {
            res.json(result.toObject());
            next();
        }).catch(next);
    }
    deleteAll(req, res, next) {
        device_1.Devices.find({ managerId: req.params.managerId, deviceId: req.params.deviceId }).then((deviceFound) => {
            if (deviceFound) {
                deviceposition_1.DevicePositions.deleteMany({ managerId: req.params.managerId, deviceId: req.params.deviceId }).then(() => {
                    res.json({ message: `${req.params.deviceId} locations no longer exists.` });
                    next();
                }).catch(next);
            }
            else {
                res.status(404).json({ message: `${req.params.deviceId} not found.` });
                next();
            }
        });
    }
    validateInput(devicePosition) {
        if (!devicePosition) {
            return { result: false, message: "Device cannot be null" };
        }
        if (!devicePosition.deviceId) {
            return { result: false, message: "Device name cannot be null" };
        }
        if (!devicePosition.latitude || !devicePosition.longitude) {
            return { result: false, message: "No latitude / longitude informed" };
        }
        return { result: true };
    }
}
exports.DevicePositionsRouter = DevicePositionsRouter;
//# sourceMappingURL=devicepositions.js.map