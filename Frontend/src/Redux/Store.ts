import { configureStore } from "@reduxjs/toolkit";
import { UserModel } from "../Models/UserModel";
import { vacationSlice } from "./VacationSlice";
import { VacationModel } from "../Models/VacationModel";
import { LikeModel } from "../Models/LikeModel";
import { userSlice } from "./UserSlice";
import { likeSlice } from "./LikeSlice";

// Create AppState:
export type AppState = {
    vacations: VacationModel[];
    user: UserModel;
    likes: LikeModel[];

}

// Create store object:
export const store = configureStore<AppState>({
    reducer: {
        vacations: vacationSlice.reducer,
        user: userSlice.reducer,
        likes: likeSlice.reducer
    }
});