import { fileSaver } from "uploaded-file-saver";
import { ClientError } from "../3-models/client-error";
import { StatusCode } from "../3-models/statusCode-model";
import { LikeModel } from "../3-models/like-model";
import { IVacationModel, VacationModel } from "../3-models/vacation-model";
import { Types } from "mongoose";

class VacationService {

    // Get all vacations by user id (with likes count and check if the user liked them):
    public async getAllVacations(userId: string): Promise<IVacationModel[]> {

        if (!userId) {
            throw new ClientError(StatusCode.BadRequest, "User ID is missing.");
        }

        const vacations = await VacationModel.aggregate([
            { $lookup: { from: "likes", localField: "_id", foreignField: "vacationId", as: "likes" } },
            { $addFields: { likesCount: { $size: "$likes" } } },
            { $addFields: { isLiked: { $in: [new Types.ObjectId(userId), "$likes.userId"] } } },
            { $project: { likes: 0 } },
            { $sort: { startDate: 1 } }
        ]);

        return vacations;
    }

    // Get a single vacation by id:
    public async getOneVacation(_id: string): Promise<IVacationModel> {
        const vacation = await VacationModel.findById(_id).exec();
        if (!vacation) throw new ClientError(StatusCode.NotFound, `Vacation with _id ${_id} not exists.`);
        return vacation;
    }

    // Add a new vacation:
    public async addVacation(vacation: IVacationModel): Promise<IVacationModel> {
        const error = vacation.validateSync();
        if (error) throw new ClientError(StatusCode.BadRequest, error.message);
        if (!vacation.image) throw new ClientError(StatusCode.BadRequest, "Image is required when creating a vacation.");
        const imageName = await fileSaver.add(vacation.image);
        vacation.imageName = imageName;
        vacation.image = undefined;
        return await vacation.save();
    }

    // Update an existing vacation:
    public async updateVacation(vacation: IVacationModel): Promise<IVacationModel> {
        const error = vacation.validateSync();
        if (error) throw new ClientError(StatusCode.BadRequest, error.message);
        const oldImageName = await this.getImageName(vacation._id.toString());
        const newImageName = vacation.image ? await fileSaver.update(oldImageName, vacation.image) : oldImageName;
        vacation.imageName = newImageName;
        vacation.image = undefined;
        const dbVacation = await VacationModel.findByIdAndUpdate(vacation._id, vacation, { new: true, runValidators: true }).exec();
        if (!dbVacation) throw new ClientError(StatusCode.NotFound, `Vacation with _id ${vacation._id} not exists.`);
        return dbVacation;
    }

    // Delete a vacation by id:
    public async deleteVacation(_id: string): Promise<void> {
        const oldFileName = await this.getImageName(_id);
        const dbVacation = await VacationModel.findByIdAndDelete(_id).exec();
        if (!dbVacation) throw new ClientError(StatusCode.NotFound, `Vacation with _id ${_id} not exists.`);
        await fileSaver.delete(oldFileName);
    }

    // Get all vacations currently active:
    public async getActiveVacations(): Promise<IVacationModel[]> {
        const currentDate = new Date();
        return await VacationModel.find({ startDate: { $lte: currentDate }, endDate: { $gte: currentDate } }).sort({ startDate: 1 }).exec();
    }

    // Get all future vacations:
    public async getFutureVacations(): Promise<IVacationModel[]> {
        const currentDate = new Date();
        return await VacationModel.find({ startDate: { $gt: currentDate } }).sort({ startDate: 1 }).exec();
    }

    // Get vacations liked by a specific user:
    public async getLikedVacationsByUser(userId: string): Promise<IVacationModel[]> {
        if (!userId) throw new ClientError(StatusCode.BadRequest, "User ID is missing");
        const userLikes = await LikeModel.find({ userId }).exec();
        if (userLikes.length === 0) return [];
        const vacationIds = userLikes.map(like => like.vacationId);
        const likedVacations = await VacationModel.find({ _id: { $in: vacationIds } }).sort({ startDate: 1 }).exec();
        return likedVacations;
    }

    // Get the image file name of a vacation by id:
    public async getImageName(_id: string): Promise<string> {
        const vacation = await VacationModel.findById(_id).exec();
        if (!vacation) throw new ClientError(StatusCode.NotFound, `Vacation with _id ${_id} not exists.`);
        return vacation.imageName;
    }

}

export const vacationService = new VacationService();
