import { BACKEND_URL } from "@/config/constants";
import { Device } from "@/types/device";
import { useMutation, useQuery } from "@tanstack/react-query";

const QUERY_KEY_DEVICES = 'devices'
const QUERY_KEY_DEVICE = 'device'

export const useDevices = () => useQuery<Device[]>({
    queryKey: [QUERY_KEY_DEVICES],
    queryFn: () => fetch(BACKEND_URL + '/device').then(res => res.json())
})

export const useDevice = (id:number | undefined) => useQuery<Device[]>({
    queryKey: [QUERY_KEY_DEVICE, id],
    queryFn: () => fetch(BACKEND_URL + '/device/' + id).then(res => res.json()),
    enabled: !!id
})

export const useCreateDevice = () => useMutation<{name: string}, Error, Device>({
    mutationFn: ({name}) => fetch(BACKEND_URL+ '/device', {
        method: 'POST',
        body: JSON.stringify({name})
    }).then(res => res.json())
})

export const useUpdateDevice = () => useMutation<Device, Error, Device>({
    mutationFn: (device) => fetch(BACKEND_URL+ '/device/' + device.deviceId, {
        method: 'PUT',
        body: JSON.stringify(device)
    }).then(res => res.json())
}) 

export const useDeleteDevice = () => useMutation<number, Error, Device>({
    mutationFn: (id) => fetch(BACKEND_URL+ '/device/' + id, {
        method: 'DELETE',
    }).then(res => res.json())
}) 