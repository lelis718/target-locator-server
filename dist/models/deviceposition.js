"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
class DevicePosition {
}
exports.DevicePosition = DevicePosition;
exports.devicePositionSchema = new mongoose_1.Schema({
    createdAt: { type: Date, default: Date.now },
    deviceId: String,
    latitude: String,
    longitude: String,
});
exports.DevicePositions = mongoose_1.model("DevicePosition", exports.devicePositionSchema);
//# sourceMappingURL=deviceposition.js.map