
enum DeviceTypes {
    Window,
    Door
}

// {
//     "device": {
//         "device_id": "4d6138b0-bb11-11ef-9451-89906175e28b",
//         "id": 2,
//         "name": "Fenster 1",
//         "type": "Window",
//         "assigned_room": 4,
//         "user": 1
//     },
//     "telemetry": {
//         "open_status": [
//             {
//                 "ts": 1734291957540,
//                 "value": "true"
//             }
//         ]
//     }
// }

type DjangoDevice = {
    device_id: string,
    id: number,
    name: string,
    type: DeviceTypes,
    assigned_room: number,
    user: number
}

type TelemetryValue = {
    ts: number,
    value: string
}

type Telemetry = Record<string, TelemetryValue[]>
type Device =  {
    device: DjangoDevice,
    telemetry:Telemetry
}

export {
    Device,
    DeviceTypes
}