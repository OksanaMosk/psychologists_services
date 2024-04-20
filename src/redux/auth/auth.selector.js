export const selectUserData = state => state.auth.userData;
export const selectAuthenticated = state => state.auth.authenticated;
export const selectAuthIsLoadingAuth = state => state.auth.isLoadingAuth;
export const selectAuthError = state => state.auth.error;
export const selectToken = state => state.auth.token;
