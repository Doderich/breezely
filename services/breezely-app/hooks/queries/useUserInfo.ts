import { BACKEND_URL } from "@/config/constants";
import { Device } from "@/types/device";
import { User } from "@/types/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../useAuth";

const QUERY_KEY_USER = 'user'

export const useUserInfo = () => {
    const { authenticatedFetch } = useAuth();
    
    return useQuery<User>({
        queryKey: [QUERY_KEY_USER],
        queryFn: async () => {
            return authenticatedFetch(BACKEND_URL + '/me').then(response => {
                if (!response.ok) {
                    console.log('responseStatus ',response.status);
                    throw new Error('Failed to fetch user data');
                }
                return response.json()
            }).catch((e) => {
                throw new Error('Failed to fetch user data: ' + e );
            });
        },
        retry: 1,
        staleTime: 10
    });
}

export const useAssignPushToken = () => {
    const { authenticatedFetch } = useAuth();
    
    return useMutation<User, Error,{expo_push_token: string} >({
        mutationFn: async (data) => {
             return authenticatedFetch(
                BACKEND_URL + '/pushtoken',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }
            ).then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update device');
                }
                return response.json();
            });
        },
    });
}
