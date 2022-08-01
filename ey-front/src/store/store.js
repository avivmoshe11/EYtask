import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { configureStore } from "@reduxjs/toolkit";
import config from "../config.json";

const usersApi = createApi({
  reducerPath: "users",
  baseQuery: fetchBaseQuery({
    baseUrl: config.apiUrl,
    prepareHeaders: (headers, { getState }) => {
      const state = getState();

      //   headers.set('x-auth-token', state.user.token);
      headers.set(
        "x-auth-token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmU1OTMzZGFmZjBhNjZjZDdlMDM5OTgiLCJuYW1lIjoiYXZpdiIsImVtYWlsIjoiYXZpdkBnbWFpbC5jb20iLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjU5Mzc2NjYxfQ.12-2INVd0i2oZuNI3gX5oilwdGetLNcuFkufNOlWobc"
      );
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: (build) => ({
    getUsers: build.query({
      query: () => "/users",
    }),
    getUser: build.query({
      query: (id) => `/users/${id}`,
      providesTags: console.log,
    }),
  }),
});

export const { useGetUserQuery, useGetUsersQuery } = usersApi;

//////////////////////////////////////////////////
export const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(usersApi.middleware),
});

// createApi({
//   baseQuery: fetchBaseQuery({
//     baseUrl: "/",
//   }),
//   tagTypes: ["Post"],
//   endpoints: (build) => ({
//     getPost: build.query({
//       // note: an optional `queryFn` may be used in place of `query`
//       query: (id) => ({ url: `post/${id}` }),
//       // Pick out data and prevent nested properties in a hook or selector
//       transformResponse: (response, meta, arg) => response.data,
//       providesTags: (result, error, id) => [{ type: "Post", id }],
//       // The 2nd parameter is the destructured `QueryLifecycleApi`
//       async onQueryStarted(arg, { dispatch, getState, extra, requestId, queryFulfilled, getCacheEntry, updateCachedData }) {},
//       // The 2nd parameter is the destructured `QueryCacheLifecycleApi`
//       async onCacheEntryAdded(arg, { dispatch, getState, extra, requestId, cacheEntryRemoved, cacheDataLoaded, getCacheEntry, updateCachedData }) {},
//     }),
//   }),
// });
