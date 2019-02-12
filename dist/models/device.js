"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
class Device {
}
exports.Device = Device;
exports.deviceSchema = new mongoose_1.Schema({
    createdAt: { type: Date, default: Date.now },
    deviceId: String,
    managerId: String,
    name: String
});
exports.Devices = mongoose_1.model("Device", exports.deviceSchema);
//# sourceMappingURL=device.js.map