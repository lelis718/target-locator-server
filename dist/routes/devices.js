"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const device_1 = require("../models/device");
class DeviceRouter {
    static create(router) {
        router.route("/group/:managerId/devices/:id").get((req, res, next) => {
            console.log("Chooosed route");
            new DeviceRouter().get(req, res, next);
        });
        router.route("/group/:managerId/devices/:id").delete((req, res, next) => {
            new DeviceRouter().delete(req, res, next);
        });
        router.route("/group/:managerId/devices").post((req, res, next) => {
            new DeviceRouter().insert(req, res, next);
        });
        router.route("/group/:managerId/devices").get((req, res, next) => {
            new DeviceRouter().list(req, res, next);
        });
    }
    list(req, res, next) {
        device_1.Devices.find({ managerId: req.params.managerId }).then((devs) => {
            res.json(devs.map((item) => item.toObject()));
            next();
        }).catch(next);
    }
    get(req, res, next) {
        device_1.Devices.findOne({ managerId: req.params.managerId, deviceId: req.params.id }).then((device) => {
            if (!device) {
                res.status(404).json({ message: `${req.params.id} not found.` });
            }
            else {
                res.json(device.toObject());
            }
            next();
        }).catch(next);
    }
    insert(req, res, next) {
        const device = {
            deviceId: req.body.deviceId,
            managerId: req.params.managerId,
            name: req.body.name,
        };
        const validation = this.validateInput(device);
        if (!validation.result) {
            res.status(400).send({ message: validation.message });
            next();
            return;
        }
        device_1.Devices.find({ deviceId: device.deviceId, managerId: device.managerId }).then((devices) => {
            if (devices.length > 0) {
                res.status(400).send({ message: "Device already registered." });
                next();
            }
            else {
                device_1.Devices.create(device).then((result) => {
                    res.json(result.toObject());
                    next();
                }).catch(next);
            }
        }).catch(next);
    }
    delete(req, res, next) {
        device_1.Devices.deleteOne({ managerId: req.params.managerId, deviceId: req.params.id }).then(() => {
            res.json({ message: `${req.params.id} no longer exists.` });
            next();
        }).catch(next);
    }
    validateInput(device) {
        if (!device) {
            return { result: false, message: "Device cannot be null" };
        }
        if (!device.deviceId) {
            return { result: false, message: "Device Id not found" };
        }
        if (!device.name) {
            return { result: false, message: "Device name cannot be null" };
        }
        return { result: true };
    }
}
exports.DeviceRouter = DeviceRouter;
//# sourceMappingURL=devices.js.map