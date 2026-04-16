import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  /* If there's a token, we assume they are authenticated for now*/
  isAuthenticated: !!localStorage.getItem("token"), 
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload; /* Fixed dot and lowercase payload*/
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;

      if (action.payload.token) {
        localStorage.setItem("token", action.payload.token);
      }
    },
    setError: (state, action) => {
      state.error = action.payload; /* Fixed lowercase payload*/
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
    },
    
    updateFavourites: (state, action) => {
      if (state.user) {
        state.user.favourites = action.payload; /* Fixed lowercase payload*/
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { 
  setLoading, 
  setUser, 
  setError, 
  logout, 
  clearError, 
  updateFavourites ,
} = authSlice.actions;

export default authSlice.reducer;