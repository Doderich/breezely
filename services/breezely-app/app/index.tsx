import { Button, Text, View } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';


WebBrowser.maybeCompleteAuthSession();

export default function App() {
  // const discovery = AuthSession.useAutoDiscovery('https://breezely-dev-4xbgpe.us1.zitadel.cloud/.well-known/openid-configuration');
  // Create and load an auth request
  const authorizeUri = "https://breezely-dev-4xbgpe.us1.zitadel.cloud/oauth/v2/authorize" 
  const redirectUri = AuthSession.makeRedirectUri();
  console.log(redirectUri)
  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: '294822437835575774',
      redirectUri,
      scopes: ['openid', 'profile', 'email', 'offline_access'],
    },
    {
      authorizationEndpoint: authorizeUri
    }
  );

  // console.log("discovery", discovery)
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Login!" disabled={!request} onPress={() => promptAsync()} />
      {result && <Text>{JSON.stringify(result, null, 2)}</Text>}
      {/* {discovery && <Text>{JSON.stringify(discovery, null, 2)}</Text>} */}
    </View>
  );
}
