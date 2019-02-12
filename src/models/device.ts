import { Document, model, Schema } from "mongoose";

export class Device {
    public managerId: string;
    public deviceId: string;
    public name?: string;
}

export let deviceSchema: Schema = new Schema({
  createdAt: { type: Date, default: Date.now },
  deviceId: String,
  managerId: String,
  name: String
});

export interface IDeviceDocument extends Device, Document {}
export const Devices = model<IDeviceDocument>("Device", deviceSchema);
