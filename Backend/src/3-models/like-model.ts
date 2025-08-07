import mongoose, { Document, model, ObjectId, Schema } from "mongoose";

export interface ILikeModel extends Document {
    userId: ObjectId;
    vacationId: ObjectId;
}

export const LikeSchema = new Schema<ILikeModel>({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    vacationId: {
        type: mongoose.Types.ObjectId,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true,

});

LikeSchema.virtual("vacation", {
    ref: "VacationModel",
    localField: "vacationId",
    foreignField: "_id",
    justOne: true
});

export const LikeModel = model<ILikeModel>("LikeModel", LikeSchema, "likes");