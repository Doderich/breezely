import { BACKEND_URL, getBackendUrl } from "@/config/constants";
import { Device } from "@/types/device";
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { useAuth } from "../useAuth";
import { User } from "@/types/user";

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

export const useCreateDevice = (user: User | undefined) => {
    const { authenticatedFetch } = useAuth();
    const queryClient = useQueryClient();

    return useMutation<Device, Error, Omit<Device['device'], 'user' | 'id' | 'assigned_room'>>({
        mutationFn: async (data) => {
            const backendUrl = await getBackendUrl();
            return authenticatedFetch(backendUrl + '/devices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }).then((res) => res.json());
        },
        throwOnError: true,
        onMutate: async (newDevice) => {
            await queryClient.cancelQueries({queryKey: [QUERY_KEY_DEVICES]});

            const previousDevices = queryClient.getQueryData<Device[]>([QUERY_KEY_DEVICES]);

            queryClient.setQueryData([QUERY_KEY_DEVICES], (old: Device[] = []) => [
                ...old,
                {
                    device: { ...newDevice, id: Date.now(), user: user?.id, assigned_room: null },
                    telemetry: {
                        active: [{
                            value: "loading",
                            ts: Date.now(),
                        }],
                        temperature: [{
                            value: "loading",
                            ts: Date.now(),
                        }],
                        humidity: [{
                            value: "loading",
                            ts: Date.now(),
                        }],
                        window_status: [{
                            value: "loading",
                            ts: Date.now(),
                        }],
                    },
                },
            ]);

            return { previousDevices };
        },
        onError: (error, newDevice, context) => {
            // @ts-expect-error asd
            queryClient.setQueryData([QUERY_KEY_DEVICES], context?.previousDevices);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY_DEVICES] });
        },
    });
};


export const useUpdateDevice = () => {
    const { authenticatedFetch } = useAuth();
    const queryClient = useQueryClient();

    return useMutation<Device, Error, Omit<Device['device'], 'user' | 'assigned_room'>>({
        mutationFn: async (device) => {
            const backendUrl = await getBackendUrl();
            return authenticatedFetch(backendUrl + '/devices/' + device.id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(device),
            }).then((res) => res.json());
        },
        onMutate: async (updatedDevice) => {
            await queryClient.cancelQueries({queryKey: [QUERY_KEY_DEVICES]});

            const previousDevices = queryClient.getQueryData<Device[]>([QUERY_KEY_DEVICES]);

            queryClient.setQueryData([QUERY_KEY_DEVICES], (old: Device[] = []) =>
                old.map((device) =>
                    device.device.id === updatedDevice.id
                        ? { ...device, device: { ...device.device, ...updatedDevice } }
                        : device
                )
            );

            return { previousDevices };
        },
        onError: (error, updatedDevice, context) => {
            // @ts-expect-error asd
            queryClient.setQueryData([QUERY_KEY_DEVICES], context?.previousDevices);
        },
        onSettled: (_, __, { id }) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY_DEVICES] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY_DEVICE, id] });
        },
    });
};


export const useDeleteDevice = () => {
    const { authenticatedFetch } = useAuth();
    const queryClient = useQueryClient();

    return useMutation<number, Error, number>({
        mutationFn: async (id) => {
            const backendUrl = await getBackendUrl();
            return authenticatedFetch(backendUrl + '/devices/' + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((res) => res.status);
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({queryKey: [QUERY_KEY_DEVICES]});

            const previousDevices = queryClient.getQueryData<Device[]>([QUERY_KEY_DEVICES]);

            queryClient.setQueryData([QUERY_KEY_DEVICES], (old: Device[] = []) =>
                old.filter((device) => device.device.id !== id)
            );

            return { previousDevices };
        },
        onError: (error, id, context) => {
            // @ts-expect-error asd
            queryClient.setQueryData([QUERY_KEY_DEVICES], context?.previousDevices);
        },
        onSettled: (id) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY_DEVICES] });
            queryClient.removeQueries({ queryKey: [QUERY_KEY_DEVICE, id] });
        },
    });
};
