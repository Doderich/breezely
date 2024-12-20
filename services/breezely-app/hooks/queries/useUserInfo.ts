import { BACKEND_URL } from "@/config/constants";
import { Device } from "@/types/device";
import { User } from "@/types/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../useAuth";

const QUERY_KEY_USER = 'user'

export const useUserInfo = () => {
    const { authenticatedFetch, logout } = useAuth();
    
    return useQuery<User>({
        queryKey: [QUERY_KEY_USER],
        queryFn: async () => {
            const response = await authenticatedFetch(BACKEND_URL + '/me');
            if (!response.ok) {
                if (response.status === 401) {
                    logout();
                    throw new Error('Unauthorized');
                }
                throw new Error('Failed to fetch user info');
            }
            return response.json().then(data => data.message);
        },
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export const useSetExpoPushToken = () => {
    const { authenticatedFetch } = useAuth();
    
    return useMutation<User, Error,{expo_push_token: string} >({
        mutationFn: async (data) => {
             return authenticatedFetch(
                BACKEND_URL + '/pushtoken',
                {
                    method: 'POST',
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
