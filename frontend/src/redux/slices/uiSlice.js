import {createSlice} from "@reduxjs/toolkit";
import { useReducer } from "react";

const uiSlice =createSlice({
    name:"ui",
    initialState:{
    authModalOpen:false,
    authMode:"login",//3 diff types of pop-up pages will come 
    //ie. login/signup/forgot pass
    },
    reducers:{
        openAuthModal:(state,action)=>{
            state.authModalOpen=true;
            state.authMode=action.payload||"login";

        },
    closeAuthModal:(state,action)=>{
        state.authModalOpen=false;
        state.authMode="login";

    },
    switchAuthMode:(state,action)=>{
        state.authMode= action.payload;
    },
    },
});
export const {openAuthModal,closeAuthModal,switchAuthMode}=
uiSlice.actions;
export default uiSlice.reducer;