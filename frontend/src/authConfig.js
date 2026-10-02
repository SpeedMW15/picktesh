import { PublicClientApplication } from '@azure/msal-browser'

export const msalConfig = {
  auth: {
    // ID de la aplicación registrada en Azure Entra ID (Si tienes una real, reemplázala aquí)
    clientId: 'YOUR_AZURE_CLIENT_ID_HERE', 
    authority: 'https://login.microsoftonline.com/common', 
    redirectUri: 'http://localhost:5173'
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false
  }
}

export const loginRequest = {
  scopes: ['User.Read', 'openid', 'profile', 'email']
}

export const msalInstance = new PublicClientApplication(msalConfig)