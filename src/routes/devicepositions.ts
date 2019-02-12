import { Router } from "express";
import { NextFunction, Request, Response } from "express";
import { Devices } from "../models/device";
import { DevicePosition, DevicePositions, IDevicePositionDocument } from "../models/deviceposition";

export class DevicePositionsRouter {

    public static create(router: Router): void {
        router.route("/device-positions/:managerId/:deviceId")
            .get((req: Request, res: Response, next: NextFunction) => {
                new DevicePositionsRouter().list(req, res, next);
            });
        router.route("/device-positions/:deviceId")
            .post((req: Request, res: Response, next: NextFunction) => {
                new DevicePositionsRouter().insert(req, res, next);
            });
        router.route("/device-positions/:managerId/:deviceId/clear")
            .post((req: Request, res: Response, next: NextFunction) => {
                new DevicePositionsRouter().deleteAll(req, res, next);
            });

    }

    public list(req: Request, res: Response, next: NextFunction) {
        Devices.find({ managerId: req.params.managerId, deviceId: req.params.deviceId }).then((deviceFound) => {
            if (deviceFound) {
                DevicePositions.find({ deviceId: req.params.deviceId }, ["latitude", "longitude", "createdAt"], {
                    sort: {
                        createdAt: -1
                    }
                }).then((devs) => {
                    res.json(devs.map((item) => item.toObject()));
                    next();
                }).catch(next);
            } else {
                res.status(404).json({ message: `${req.params.deviceId} not found.` });
                next();
            }
        });
    }
    public insert(req: Request, res: Response, next: NextFunction) {
        const devicePosition: DevicePosition = {
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
        DevicePositions.create(devicePosition).then((result) => {
            res.json(result.toObject());
            next();
        }).catch(next);
    }
    public deleteAll(req: Request, res: Response, next: NextFunction) {

        Devices.find({ managerId: req.params.managerId, deviceId: req.params.deviceId }).then((deviceFound) => {
            if (deviceFound) {
                DevicePositions.deleteMany(
                    { managerId: req.params.managerId, deviceId: req.params.deviceId }
                ).then(() => {
                    res.json({ message: `${req.params.deviceId} locations no longer exists.` });
                    next();
                }).catch(next);
            } else {
                res.status(404).json({ message: `${req.params.deviceId} not found.` });
                next();
            }
        });

    }
    private validateInput(devicePosition: DevicePosition) {
        if (!devicePosition) { return { result: false, message: "Device cannot be null" }; }
        if (!devicePosition.deviceId) { return { result: false, message: "Device name cannot be null" }; }
        if (!devicePosition.latitude || !devicePosition.longitude) {
            return { result: false, message: "No latitude / longitude informed" };
        }
        return { result: true };
    }
}
