export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  frontendUrl: 'http://localhost:4200',
  auth0: {
    domain: 'YOUR_AUTH0_DOMAIN',
    clientId: 'YOUR_AUTH0_CLIENT_ID',
    authorizationParams: {
      redirect_uri: 'http://localhost:4200/auth/callback',
      audience: 'YOUR_AUTH0_AUDIENCE',
    },
    httpInterceptor: {
      allowedList: [
        {
          uri: 'http://localhost:3000/*',
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
