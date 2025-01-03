import { BACKEND_URL } from "@/config/constants";
import { Room } from "@/types/rooms";
import { QueryOptions, useMutation, useQuery } from "@tanstack/react-query";
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
    return useMutation<Room, Error, Omit<Room, "id">>({
    mutationFn: ({name}) => authenticatedFetch(BACKEND_URL+ '/rooms', {
        method: 'POST',
        body: JSON.stringify({name})
    }).then(res => res.json())
})}


export const useUpdateRoom = () => {
    const { authenticatedFetch } = useAuth();
    return useMutation<Room, Error, Room>({
    mutationFn: (room) => authenticatedFetch(BACKEND_URL+ '/rooms/' + room.id, {
        method: 'PUT',
        body: JSON.stringify(room)
    }).then(res => res.json())
}) }

export const useDeleteRoom = () =>{
    const { authenticatedFetch } = useAuth();
    return  useMutation<number, Error, number>({
    mutationFn: (id) => authenticatedFetch(BACKEND_URL+ '/rooms/' + id, {
        method: 'DELETE',
    }).then(res => res.status)
}) }