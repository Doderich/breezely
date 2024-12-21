const AUTHORIZE_URI= "https://breezely-dev-4xbgpe.us1.zitadel.cloud/oauth/v2/authorize"
const TOKEN_URL = "https://breezely-dev-4xbgpe.us1.zitadel.cloud/oauth/v2/token"
const CLIENT_ID = '294822437835575774'
const BACKEND_URL = 'http://server-malte.duckdns.org:5877/api'
// const BACKEND_URL = 'https://sever-1.local.malte-budig.org:9876/api'

const SCOPES = ['openid', 'offline_access', 'profile', 'email']

export {
    AUTHORIZE_URI,
    CLIENT_ID,
    TOKEN_URL,
    SCOPES,
    BACKEND_URL
}