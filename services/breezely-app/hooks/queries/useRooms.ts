import { BACKEND_URL } from "@/config/constants";
import { Room } from "@/types/rooms";
import { QueryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../useAuth";

const QUERY_KEY_ROOMS = 'rooms'
const QUERY_KEY_ROOM = 'room'

export const useRooms = () => {
    const { authenticatedFetch } = useAuth();
    return useQuery<Room[]>({
        queryKey: [QUERY_KEY_ROOMS],
        queryFn: () => authenticatedFetch(BACKEND_URL + '/rooms').then(res => res.json())
    })  
} 

export const useRoom = (id:number | undefined, queryOptions?: Partial<QueryOptions<Room, Error>>) =>{ 
    const { authenticatedFetch } = useAuth();
    return useQuery<Room, Error>({
    ...queryOptions,
    queryKey: [QUERY_KEY_ROOM, id],
    queryFn: () => authenticatedFetch(BACKEND_URL + '/rooms/' + id).then(res => res.json()),
    enabled: !!id
})}

export const useCreateRoom = () => {
    const { authenticatedFetch } = useAuth();
    const queryClient = useQueryClient();
    return useMutation<Room, Error, {name: string, devices: number[]}>({
    mutationFn: (data) => authenticatedFetch(BACKEND_URL+ '/rooms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json()),
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
    mutationFn: (room) => authenticatedFetch(BACKEND_URL+ '/rooms/' + room.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(room)
    }).then(res => res.json()),
    onSettled: (room) => {
        queryClient.invalidateQueries({queryKey: [QUERY_KEY_ROOMS]})
        queryClient.invalidateQueries({queryKey: [QUERY_KEY_ROOM, room?.id]})
    }
}) }

export const useDeleteRoom = () =>{
    const { authenticatedFetch } = useAuth();
    const queryClient = useQueryClient();
    return  useMutation<number, Error, number>({
    mutationFn: (id) => authenticatedFetch(BACKEND_URL+ '/rooms/' + id, {
        method: 'DELETE',
    }).then(res => res.status),
    onSettled: (id) => {
        queryClient.invalidateQueries({queryKey: [QUERY_KEY_ROOMS]})
        queryClient.removeQueries({queryKey: [QUERY_KEY_ROOM, id]})
    }
}) }