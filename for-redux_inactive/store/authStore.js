import { createApi, fetchBaseQuery, setupListeners } from "@reduxjs/toolkit/query/react";
import { configureStore } from "@reduxjs/toolkit";
import config from "../config.json";
import authReducer from "../features/authSlice";

const authApi = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({
    baseUrl: config.apiUrl,
    prepareHeaders: (headers, { getState }) => {
      const state = getState(); //.auth.token;
      console.log("1", state);
      /*if (token) {
        headers.set("x-auth-token", `${token}`);
      }*/
      return headers;
    },
  }),
  tagTypes: ["Auth"],
  endpoints: (build) => ({
    loginUser: build.mutation({
      query: (body) => ({
        method: "POST",
        url: `/auth`,
        body,
      }),
    }),
  }),
});

export const { useLoginUserMutation } = authApi;

//////////////////////////////////////////////////////

export const authStore = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware),
});

setupListeners(authStore.dispatch);
