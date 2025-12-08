export const environment = {
  production: true,
  apiUrl: 'https://api-dev.csediualumni.com',
  frontendUrl: 'https://admin-dev.csediualumni.com',
  auth0: {
    domain: 'YOUR_AUTH0_DOMAIN',
    clientId: 'YOUR_AUTH0_CLIENT_ID',
    authorizationParams: {
      redirect_uri: 'https://admin-dev.csediualumni.com/auth/callback',
      audience: 'YOUR_AUTH0_AUDIENCE',
    },
    httpInterceptor: {
      allowedList: [
        {
          uri: 'https://api-dev.csediualumni.com/*',
          tokenOptions: {
            authorizationParams: {
              audience: 'YOUR_AUTH0_AUDIENCE',
            },
          },
        },
      ],
    },
  },
};
