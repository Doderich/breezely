
enum DeviceTypes {
    Window,
    Door
}

type Device =  {
    name: string;
    openStatus: boolean,
    temperatur: number
    humidity: number,
    deviceType: DeviceTypes,
    roomId: string;
    deviceId: string;
    createdAt: string;
}

export {
    Device,
    DeviceTypes
}