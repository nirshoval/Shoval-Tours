// Handling the user (UserModel) at application level.

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserModel } from "../Models/UserModel";

// 1. Init user: 
export function initUser(_currentState: UserModel, action: PayloadAction<UserModel>): UserModel {
    const userToInit = action.payload;
    const newState = userToInit;
    return newState;
}

// 2. Logout user: 
export function logoutUser(_currentState: UserModel, _action: PayloadAction): UserModel {
    return null;
}

// 3. Create slice: 
export const userSlice = createSlice({
    name: "user",
    initialState: null,
    reducers: { initUser, logoutUser }
});
