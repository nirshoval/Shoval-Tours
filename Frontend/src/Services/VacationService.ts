import axios from "axios";
import { VacationModel } from "../Models/VacationModel";
import { store } from "../Redux/Store";
import { vacationSlice } from "../Redux/VacationSlice";
import { appConfig } from "../Utils/AppConfig";

class VacationService {

    // Get all vacations by user id:
    public async getAllVacations(userId: string): Promise<VacationModel[]> {

        const response = await axios.get<VacationModel[]>(appConfig.vacationsUrl + userId);

        const vacations = response.data;

        const action = vacationSlice.actions.initVacation(vacations);
        store.dispatch(action);

        return vacations;
    }

    // Get a single vacation by id:
    public async getOneVacation(_id: string): Promise<VacationModel> {
        const vacation = store.getState().vacations.find(p => p._id === _id);
        if (vacation) return vacation;

        const response = await axios.get<VacationModel>(appConfig.singleVacationUrl + _id);
        const dbVacation = response.data;

        return dbVacation;
    }

    // Add a new vacation:
    public async addVacation(vacation: VacationModel): Promise<void> {
        const headers = { "Content-Type": "multipart/form-data" };
        await axios.post<VacationModel>(appConfig.vacationsUrl, vacation, { headers });
    }

    // Update an existing vacation:
    public async updateVacation(vacation: VacationModel, image?: File): Promise<void> {
        const formData = new FormData();
        formData.append("destination", vacation.destination);
        formData.append("description", vacation.description);
        formData.append("startDate", vacation.startDate.toString());
        formData.append("endDate", vacation.endDate.toString());
        formData.append("price", vacation.price.toString());
        if (image) {
            formData.append("image", image);
        }
        await axios.put(appConfig.vacationsUrl + vacation._id, formData);
    }

    // Delete a vacation by id:
    public async deleteVacation(_id: string): Promise<void> {
        await axios.delete(appConfig.vacationsUrl + _id);
    }

    // Get all vacations currently active:
    public async getActiveVacations(): Promise<VacationModel[]> {
        const response = await axios.get<VacationModel[]>(appConfig.activeVacationUrl);
        return response.data;
    }

    // Get all future vacations:
    public async getFutureVacations(): Promise<VacationModel[]> {
        const response = await axios.get<VacationModel[]>(appConfig.futureVacationUrl);
        return response.data;
    }

    // Get vacations liked by a specific user:
    public async getLikedVacationsByUser(userId: string): Promise<VacationModel[]> {
        const response = await axios.get<VacationModel[]>(appConfig.likedVacationByUserUrl + userId);
        return response.data;
    }

}

export const vacationService = new VacationService();

