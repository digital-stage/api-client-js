import { ServerDeviceEvents, Device } from '@digitalstage/api-types'

const handleLocalDeviceReady = (device: Device) => ({
    type: ServerDeviceEvents.LocalDeviceReady,
    payload: device,
})

const addDevice = (device: Device) => ({
    type: ServerDeviceEvents.DeviceAdded,
    payload: device,
})
const changeDevice = (device: Partial<Device>) => ({
    type: ServerDeviceEvents.DeviceChanged,
    payload: device,
})
const removeDevice = (deviceId: string) => ({
    type: ServerDeviceEvents.DeviceRemoved,
    payload: deviceId,
})

const client = {}
const server = {
    handleLocalDeviceReady,
    addDevice,
    changeDevice,
    removeDevice,
}

const deviceActions = {
    client,
    server,
}
export default deviceActions
