import { BACKEND_URL, getBackendUrl } from "@/config/constants";
import { Device } from "@/types/device";
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { useAuth } from "../useAuth";

const QUERY_KEY_DEVICES = 'devices'
const QUERY_KEY_DEVICE = 'device'

export const useDevices = () => {
    const { authenticatedFetch } = useAuth();
    // const notifyOnChangeProps = useFocusNotifyOnChangeProps();
    return useQuery<Device[]>({
    queryKey: [QUERY_KEY_DEVICES],
    refetchOnWindowFocus: true,
    refetchInterval: 7 * 1000,
    queryFn: async () => {
        const backendUrl = await getBackendUrl();
        return authenticatedFetch(backendUrl + '/devices').then(res => res.json())
    },
    // notifyOnChangeProps
})}

export const useDevice = (id:number | undefined, props?: Partial<UseQueryOptions<Device>>) =>{
    const { authenticatedFetch } = useAuth();
    return  useQuery<Device>({
    ...props,
    queryKey: [QUERY_KEY_DEVICE, id],
    staleTime: 7 * 1000,
    queryFn: async () => {
        const backendUrl = await getBackendUrl();
        return authenticatedFetch(backendUrl + '/devices/' + id).then(res => res.json())},
    enabled: !!id,
})}

export const useCreateDevice = () =>{
    const { authenticatedFetch } = useAuth();
    const queryClient = useQueryClient();
    return useMutation<Device, Error, Omit<Device['device'], 'user' | 'id' | 'assigned_room'>>({
    mutationFn: async (data) => {
        const backendUrl = await getBackendUrl();
        return authenticatedFetch(backendUrl+ '/devices', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then(res => res.json())
},
    throwOnError: true,
    onError: (error) => console.log(error),
    onSuccess: (data) => {
        queryClient.setQueryData([QUERY_KEY_DEVICES], (prev: Device[]) => [...prev,data ])
    },
    onSettled: () => queryClient.invalidateQueries({queryKey: [QUERY_KEY_DEVICES]})
})}

export const useUpdateDevice = () => {
    const { authenticatedFetch } = useAuth();
    const queryClient = useQueryClient();
    return useMutation<Device, Error, Omit<Device['device'], 'user' | 'assigned_room'>>({
    mutationFn: async (device) => {
        console.log("device", device);
        const backendUrl = await getBackendUrl();
        return authenticatedFetch(backendUrl+ '/devices/' + device.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(device)
    }).then(res => res.json())},
    onError: (error) => console.log(error),
    onSuccess(data, id, context) {
        queryClient.setQueryData([QUERY_KEY_DEVICES], (prev: Device[]) => {
            return [...prev.filter(device => device.device.id != id), data ]
        })
        queryClient.setQueryData([QUERY_KEY_DEVICE, id], data)
    },
    onSettled: (_,__,{id}) => {
        queryClient.invalidateQueries({queryKey: [QUERY_KEY_DEVICES]})
    }
}) }

export const useDeleteDevice = () => {
    const { authenticatedFetch } = useAuth();
    const queryClient = useQueryClient();
    return useMutation<number, Error, number>({
    mutationFn: async (id) =>{
        const backendUrl = await getBackendUrl();
        return authenticatedFetch(backendUrl+ '/devices/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => res.status)},
    onSuccess(data, id, context) {
        queryClient.setQueryData([QUERY_KEY_DEVICES], (prev: Device[]) => prev.filter(device => device.device.id != id))
    },
    onSettled: (id) => {
        queryClient.invalidateQueries({queryKey: [QUERY_KEY_DEVICES]})
        queryClient.removeQueries({queryKey: [QUERY_KEY_DEVICE, id]})
    }
}) }