import { UploadedFile } from 'express-fileupload';
import { Document, model, Schema } from 'mongoose';

export interface IVacationModel extends Document {
    destination: string;
    description: string;
    startDate: Date;
    endDate: Date;
    price: number;
    image?: UploadedFile;
    imageName: string;
    likesCount?: number;
    isLiked?: boolean;
}

export const VacationSchema = new Schema<IVacationModel>({
    destination: {
        type: String,
        required: [true, "Destination is required"],
        minlength: [2, "Destination too short"],
        maxlength: [100, "Destination too long"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minlength: [10, "Description too short"],
        maxlength: [1000, "Description too long"]
    },
    startDate: {
        type: Date,
        required: [true, "Start date is required"],
    },
    endDate: {
        type: Date,
        required: [true, "End date is required"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"],
        max: [10000, "Price cannot exceed 10,000"]
    },
    image: {
        type: Object,
        required: false,
    },
    imageName: {
        type: String,
        required: false,
        maxlength: [200, "Image name too long"],
    }
}, {
    versionKey: false,
    toJSON: { virtuals: true },
    id: false
});

export const VacationModel = model<IVacationModel>("VacationModel", VacationSchema, "vacations");