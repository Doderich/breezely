import { useExampleQuery } from "@/hooks/queries/useExampleQuery"
import { Text, View } from 'react-native';
export const ReactQueryExample = () => {
    const { data: example, isLoading, isError  } = useExampleQuery()
    return <View>
        <Text>IsLoading: {JSON.stringify(isLoading)}</Text>
        <Text>IsLoading: {JSON.stringify(isLoading)}</Text>
        <Text>IsLoading: {JSON.stringify(isLoading)}</Text>
        <Text>IsError: {JSON.stringify(isError)}</Text>
        <Text>Data: {JSON.stringify(example)}</Text>
    </View>
}