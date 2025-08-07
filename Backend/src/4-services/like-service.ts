import { ClientError } from "../3-models/client-error";
import { ILikeModel, LikeModel } from "../3-models/like-model";
import { StatusCode } from "../3-models/statusCode-model";
import { UserModel } from "../3-models/user-model";
import { VacationModel } from "../3-models/vacation-model";

class LikeService {

    // Like a vacation
    public async likeVacation(like: ILikeModel): Promise<ILikeModel> {
        
        // Validate the like model:
        const error = like.validateSync();
        if(error) throw new ClientError(StatusCode.BadRequest, error.message);
        
        // Ensure the user exists in the database:
        const userExists = await UserModel.findById(like.userId).exec();
        if (!userExists) throw new ClientError(StatusCode.NotFound, `User with _id ${like.userId} does not exist.`);
        
         // Ensure the vacation exists in the database:
        const vacationExists = await VacationModel.findById(like.vacationId).exec();
        if (!vacationExists) throw new ClientError(StatusCode.NotFound, `Vacation with _id ${like.vacationId} does not exist.`);
        
        // Check if the user already liked this vacation:
        const existingLike = await LikeModel.findOne({ userId: like.userId, vacationId: like.vacationId }).exec();
        if (existingLike) throw new ClientError(StatusCode.Conflict, "You already liked this vacation");
        
        return await like.save();
    }

    // Uunlike a vacation
    public async unlikeVacation(userId: string, vacationId: string): Promise<void> {
        // Find and delete the like record:
        const dbUnlike = await LikeModel.findOneAndDelete({ userId, vacationId }).exec();
         // If no such like exists, throw an error:
        if (!dbUnlike) throw new ClientError(StatusCode.NotFound, `Failed to unlike this vacation.`);   
    }

}

export const likeService = new LikeService();