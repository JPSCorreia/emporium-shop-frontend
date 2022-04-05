import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { usersApi } from "./usersApiSlice";
import { authApi } from "./authApiSlice";
import toggleUsersReducer from "./toggleUsersSlice";
import isLoggedReducer from "./isLoggedSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    // [productssApi.reducerPath]: productsApi.reducer,
    toggleUsers: toggleUsersReducer,
    isLogged: isLoggedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({serializableCheck: false})
      .concat(authApi.middleware)
      .concat(usersApi.middleware)
      // .concat(productsApi.middleware)
})

setupListeners(store.dispatch);

export default store;