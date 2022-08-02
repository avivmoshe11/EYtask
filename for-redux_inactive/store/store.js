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
      providesTags: (result) =>
        result ? [...result.map(({ _id: id }) => ({ type: "Users", id })), { type: "Users", id: "LIST" }] : [{ type: "Users", id: "LIST" }],
    }),
    getUser: build.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),

    deleteUser: build.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `/users/${id}`,
      }),
      invalidatesTags: (result, error, id) => [{ type: "Users", id }],
    }),

    getFriends: build.query({
      query: () => "/users/friends",
      providesTags: [{ type: "Friends", id: "LIST" }],
    }),

    addFriend: build.mutation({
      query: (id) => ({
        method: "PUT",
        url: `/users/friends/add/${id}`,
      }),
      invalidatesTags: [{ type: "Friends", id: "LIST" }],
    }),

    removeFriend: build.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `/users/friends/remove/${id}`,
      }),
      invalidatesTags: [{ type: "Friends", id: "LIST" }],
    }),
  }),
});

export const { useGetUserQuery, useGetUsersQuery, useDeleteUserMutation, useGetFriendsQuery, useAddFriendMutation, useRemoveFriendMutation } =
  usersApi;

//////////////////////////////////////////////////
export const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(usersApi.middleware),
});
