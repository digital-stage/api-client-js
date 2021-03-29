import ServerDeviceEvents from "../../types/ServerDeviceEvents";
import Device from "../../types/model/Device";

const handleLocalDeviceReady = (device: Device) => {
  return {
    type: ServerDeviceEvents.LocalDeviceReady,
    payload: device,
  };
};

const addDevice = (device: Device) => {
  return {
    type: ServerDeviceEvents.DeviceAdded,
    payload: device,
  };
};
const changeDevice = (device: Partial<Device>) => {
  return {
    type: ServerDeviceEvents.DeviceChanged,
    payload: device,
  };
};
const removeDevice = (deviceId: string) => {
  return {
    type: ServerDeviceEvents.DeviceRemoved,
    payload: deviceId,
  };
};

const client = {};
const server = {
  handleLocalDeviceReady,
  addDevice,
  changeDevice,
  removeDevice,
};

const deviceActions = {
  client,
  server,
};
export default deviceActions;
