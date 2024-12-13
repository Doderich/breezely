import { useQuery } from '@tanstack/react-query';
export const useExampleQuery = () => useQuery({
    queryKey: ['example'],
    queryFn: () => fetch('https://jsonplaceholder.typicode.com/todos/1').then(resp => resp.json())
  })