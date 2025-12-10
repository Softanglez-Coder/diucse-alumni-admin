export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  frontendUrl: 'http://localhost:4300',
  auth0: {
    domain: 'csediualumni.us.auth0.com',
    clientId: '8cJDXN0svn090g4pqmS99Fqq7sOjYR6o',
    authorizationParams: {
      redirect_uri: 'http://localhost:4300/auth/callback',
    },
    httpInterceptor: {
      allowedList: [],
    },
  },
};
