import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VacationModel } from "../Models/VacationModel";

// 1. Init vacations:
export function initVacation(_currentState: VacationModel[], action: PayloadAction<VacationModel[]>): VacationModel[] {
    const vacationToInit = action.payload;
    const newState = vacationToInit;
    return newState;
}

// 2. Add vacation:
export function addVacation(currentState: VacationModel[], action: PayloadAction<VacationModel>): VacationModel[] {
    const vacationToAdd = action.payload;
    const newState = [...currentState];
    newState.push(vacationToAdd);
    return newState;
}

// 3. Update vacation:
export function updateVacation(currentState: VacationModel[], action: PayloadAction<VacationModel>): VacationModel[] {
    const vacationToUpdate = action.payload;
    const newState = [...currentState];
    const index = newState.findIndex(v => v._id === vacationToUpdate._id);
    newState[index] = vacationToUpdate;
    return newState;
}

// 4. Delete vacation:
export function deleteVacation(currentState: VacationModel[], action: PayloadAction<string>): VacationModel[] {
    const idToDelete = action.payload;
    const newState = [...currentState];
    const index = newState.findIndex(v => v._id === idToDelete);
    newState.splice(index, 1);
    return newState;
}

// 5. Toggle the like status of a vacation and update its likes count:
export function toggleLike(currentState: VacationModel[], action: PayloadAction<{ vacationId: string, isLiked: boolean }>): VacationModel[] {

    const { vacationId, isLiked } = action.payload;

    const newState = [...currentState];
    const index = newState.findIndex(v => v._id === vacationId);

    // If the vacation is found, update its like status and safely adjust the likes count
    if (index >= 0) {
        newState[index] = {
            ...newState[index],
            isLiked,
            likesCount: Math.max(0, isLiked ? newState[index].likesCount + 1 : newState[index].likesCount - 1)
        };
    }
    return newState;
}

// 6. Create slice: 
export const vacationSlice = createSlice({
    name: "vacation",
    initialState: [],
    reducers: { initVacation, addVacation, updateVacation, deleteVacation, toggleLike }
});