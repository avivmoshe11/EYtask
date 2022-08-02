import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, PayloadAction) => {
      localStorage.setItem(
        "user",
        JSON.stringify({
          user: PayloadAction.payload.user,
          token: PayloadAction.payload.token,
        })
      );
      state.user = PayloadAction.payload.user;
      state.token = PayloadAction.payload.token;
    },
  },
});

export const selectAuth = (state) => {
  return state.auth;
};

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
