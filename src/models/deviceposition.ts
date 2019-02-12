import { Document, model, Schema } from "mongoose";

export class DevicePosition {
    public deviceId: string;
    public createdAt: Date;
    public latitude: string;
    public longitude: string;
}

export let devicePositionSchema: Schema = new Schema({
  createdAt: { type: Date, default: Date.now },
  deviceId: String,
  latitude: String,
  longitude: String,
});

export interface IDevicePositionDocument extends DevicePosition, Document {}
export const DevicePositions = model<IDevicePositionDocument>("DevicePosition", devicePositionSchema);
