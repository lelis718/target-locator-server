import { Router } from "express";
import { NextFunction, Request, Response } from "express";
import { Device, Devices, IDeviceDocument } from "../models/device";

export class DeviceRouter {

    public static create(router: Router): void {
        router.route("/group/:managerId/devices/:id").get((req: Request, res: Response, next: NextFunction) => {
            console.log("Chooosed route");
            new DeviceRouter().get(req, res, next);
        });
        router.route("/group/:managerId/devices/:id").delete((req: Request, res: Response, next: NextFunction) => {
            new DeviceRouter().delete(req, res, next);
        });

        router.route("/group/:managerId/devices").post((req: Request, res: Response, next: NextFunction) => {
            new DeviceRouter().insert(req, res, next);
        });
        router.route("/group/:managerId/devices").get((req: Request, res: Response, next: NextFunction) => {
            new DeviceRouter().list(req, res, next);
        });

    }

    public list(req: Request, res: Response, next: NextFunction) {
        Devices.find({ managerId: req.params.managerId }).then((devs) => {
            res.json(devs.map((item) => item.toObject()));
            next();
        }).catch(next);
    }
    public get(req: Request, res: Response, next: NextFunction) {
        Devices.findOne({ managerId: req.params.managerId, deviceId: req.params.id }).then((device) => {
            if (!device) {
                res.status(404).json({ message: `${req.params.id} not found.` });
            } else {
                res.json(device.toObject());
            }
            next();
        }).catch(next);
    }

    public insert(req: Request, res: Response, next: NextFunction) {

        const device: Device = {
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

        Devices.find({ deviceId: device.deviceId, managerId: device.managerId }).then((devices) => {
            if (devices.length > 0) {
                res.status(400).send({ message: "Device already registered." });
                next();
            } else {
                Devices.create(device).then((result) => {
                    res.json(result.toObject());
                    next();
                }).catch(next);
            }
        }).catch(next);

    }
    public delete(req: Request, res: Response, next: NextFunction) {
        Devices.deleteOne({ managerId: req.params.managerId, deviceId: req.params.id }).then(() => {
            res.json({ message: `${req.params.id} no longer exists.` });
            next();
        }).catch(next);
    }
    private validateInput(device: Device) {
        if (!device) { return { result: false, message: "Device cannot be null" }; }
        if (!device.deviceId) { return { result: false, message: "Device Id not found" }; }
        if (!device.name) { return { result: false, message: "Device name cannot be null" }; }
        return { result: true };
    }
}
