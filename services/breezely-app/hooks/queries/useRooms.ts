import { BACKEND_URL } from "@/config/constants";
import { Room } from "@/types/rooms";
import { useMutation, useQuery } from "@tanstack/react-query";

const QUERY_KEY_ROOMS = 'rooms'
const QUERY_KEY_ROOM = 'room'

export const useRooms = () => useQuery<Room[]>({
    queryKey: [QUERY_KEY_ROOMS],
    queryFn: () => fetch(BACKEND_URL + '/room').then(res => res.json())
})

export const useRoom = (id:number | undefined) => useQuery<Room[]>({
    queryKey: [QUERY_KEY_ROOM, id],
    queryFn: () => fetch(BACKEND_URL + '/room/' + id).then(res => res.json()),
    enabled: !!id
})

export const useCreateRoom = () => useMutation<{name: string}, Error, Room>({
    mutationFn: ({name}) => fetch(BACKEND_URL+ '/room', {
        method: 'POST',
        body: JSON.stringify({name})
    }).then(res => res.json())
})

export const useUpdateRoom = () => useMutation<Room, Error, Room>({
    mutationFn: (room) => fetch(BACKEND_URL+ '/room/' + room.id, {
        method: 'PUT',
        body: JSON.stringify(room)
    }).then(res => res.json())
}) 

export const useDeleteRoom = () => useMutation<number, Error, Room>({
    mutationFn: (id) => fetch(BACKEND_URL+ '/room/' + id, {
        method: 'DELETE',
    }).then(res => res.json())
}) 