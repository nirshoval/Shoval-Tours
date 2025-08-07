import axios from "axios";
import { LikeModel } from "../Models/LikeModel";
import { appConfig } from "../Utils/AppConfig";

class LikeService {

    // Sends a like request for a vacation:
    public async likeVacation(like: LikeModel): Promise<void> {
        const headers = { "Content-Type": "application/json" };
        await axios.post<LikeModel>(appConfig.likeUrl, like, { headers });
    }

    // Sends an unlike request by userId and vacationId:
    public async unlikeVacation(userId: string, vacationId: string): Promise<void> {
        await axios.delete(appConfig.likeUrl + `${userId}/${vacationId}`);
    }
    
}

export const likeService = new LikeService();