import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LikeModel } from "../Models/LikeModel";

// 1. Init likes:
export function initLike(_currentState: LikeModel[], action: PayloadAction<LikeModel[]>): LikeModel[] {
    const likeToInit = action.payload;
    const newState = likeToInit;
    return newState;
}

// 2. Add new like:
export function addLike(currentState: LikeModel[], action: PayloadAction<LikeModel>): LikeModel[] {
    const likeToAdd = action.payload;
    const newState = [...currentState];
    newState.push(likeToAdd);
    return newState;
}

// 3. Unlike:
export function removeLike(currentState: LikeModel[], action: PayloadAction<string>): LikeModel[] {
    const idToUnlike = action.payload;
    const newState = [...currentState];
    const index = newState.findIndex(v => v._id === idToUnlike);
    newState.splice(index, 1);
    return newState;
}

// 4. Create slice: 
export const likeSlice = createSlice({
    name: "likes",
    initialState: [],
    reducers: { initLike, addLike, removeLike }
});