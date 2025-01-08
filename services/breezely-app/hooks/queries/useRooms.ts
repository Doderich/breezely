import { BACKEND_URL, getBackendUrl } from "@/config/constants";
import { Room } from "@/types/rooms";
import { QueryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../useAuth";

const QUERY_KEY_ROOMS = 'rooms'
const QUERY_KEY_ROOM = 'room'

export const useRooms = () => {
    const { authenticatedFetch } = useAuth();
    return useQuery<Room[]>({
        queryKey: [QUERY_KEY_ROOMS],
        queryFn: async () =>{
            const backendUrl = await getBackendUrl();
            return authenticatedFetch(backendUrl + '/rooms').then(res => res.json())} 
    })  
} 

export const useRoom = (id:number | undefined, queryOptions?: Partial<QueryOptions<Room, Error>>) =>{ 
    const { authenticatedFetch } = useAuth();
    return useQuery<Room, Error>({
    ...queryOptions,
    queryKey: [QUERY_KEY_ROOM, id],
    queryFn: async() => {
        const backendUrl = await getBackendUrl();
        return authenticatedFetch(backendUrl + '/rooms/' + id).then(res => res.json())},
    enabled: !!id
})}

export const useCreateRoom = () => {
    const { authenticatedFetch } = useAuth();
    const queryClient = useQueryClient();
    return useMutation<Room, Error, {name: string, devices: number[]}>({
    mutationFn: async (data) =>{
        const backendUrl = await getBackendUrl();
        return  authenticatedFetch(backendUrl+ '/rooms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json())},
    onError: (error) => {
        console.log(error)
    },
    onSuccess: (data) => {
        console.log("Data",data)
        queryClient.invalidateQueries({queryKey: [QUERY_KEY_ROOMS]})
    },
    onSettled: () => {
        queryClient.invalidateQueries({queryKey: [QUERY_KEY_ROOMS]})
    }
})}


export const useUpdateRoom = () => {
    const { authenticatedFetch } = useAuth();
    const queryClient = useQueryClient();
    return useMutation<Room, Error, {id: string, name:string, devices: number[]}>({
    mutationFn: async (room) => {
        const backendUrl = await getBackendUrl();
        return authenticatedFetch(backendUrl+ '/rooms/' + room.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(room)
    }).then(res => res.json())},
    onSettled: (room) => {
        queryClient.invalidateQueries({queryKey: [QUERY_KEY_ROOMS]})
        queryClient.invalidateQueries({queryKey: [QUERY_KEY_ROOM, room?.id]})
    }
}) }

export const useDeleteRoom = () =>{
    const { authenticatedFetch } = useAuth();
    const queryClient = useQueryClient();
    return  useMutation<number, Error, number>({
    mutationFn: async(id) => {
        const backendUrl = await getBackendUrl();
        return authenticatedFetch(backendUrl+ '/rooms/' + id, {
        method: 'DELETE',
    }).then(res => res.status)},
    onSettled: (id) => {
        queryClient.invalidateQueries({queryKey: [QUERY_KEY_ROOMS]})
        queryClient.removeQueries({queryKey: [QUERY_KEY_ROOM, id]})
    }
}) }