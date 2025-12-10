export const environment = {
  production: true,
  apiUrl: 'https://api-dev.csediualumni.com',
  frontendUrl: 'https://admin-dev.csediualumni.com',
  auth0: {
    domain: 'csediualumni.us.auth0.com',
    clientId: '8cJDXN0svn090g4pqmS99Fqq7sOjYR6o',
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
