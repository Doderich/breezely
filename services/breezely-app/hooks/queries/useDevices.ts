import { BACKEND_URL } from "@/config/constants";
import { Device } from "@/types/device";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../useAuth";

const QUERY_KEY_DEVICES = 'devices'
const QUERY_KEY_DEVICE = 'device'

export const useDevices = () => {
    const { authenticatedFetch } = useAuth();
    return useQuery<Device[]>({
    queryKey: [QUERY_KEY_DEVICES],
    queryFn: () => authenticatedFetch(BACKEND_URL + '/devices').then(res => res.json())
})}

export const useDevice = (id:number | undefined) =>{
    const { authenticatedFetch } = useAuth();
    return  useQuery<Device[]>({
    queryKey: [QUERY_KEY_DEVICE, id],
    queryFn: () => authenticatedFetch(BACKEND_URL + '/devices/' + id).then(res => res.json()),
    enabled: !!id
})}

export const useCreateDevice = () =>{
    const { authenticatedFetch } = useAuth();
    return useMutation<Device, Error, Device>({
    mutationFn: (data) => authenticatedFetch(BACKEND_URL+ '/devices', {
        method: 'POST',
        body: JSON.stringify(data)
    }).then(res => res.json())
})}

export const useUpdateDevice = () => {
    const { authenticatedFetch } = useAuth();
    return useMutation<Device, Error, Device>({
    mutationFn: (device) => authenticatedFetch(BACKEND_URL+ '/devices/' + device.device.id, {
        method: 'PUT',
        body: JSON.stringify(device)
    }).then(res => res.json())
}) }

export const useDeleteDevice = () => {
    const { authenticatedFetch } = useAuth();
    return useMutation<number, Error, number>({
    mutationFn: (id) => authenticatedFetch(BACKEND_URL+ '/devices/' + id, {
        method: 'DELETE',
    }).then(res => res.status)
}) }