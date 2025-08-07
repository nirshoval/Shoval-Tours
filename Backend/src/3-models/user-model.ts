import { Document, model, Schema } from "mongoose";
import { RoleModel } from "./role-model";

export interface IUserModel extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roleId: RoleModel;
}

export const UserSchema = new Schema<IUserModel>({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        minlength: [2, "First name too short"],
        maxlength: [50, "First name too long"],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        minlength: [2, "Last name too short"],
        maxlength: [50, "Last name too long"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [4, "Password too short"],
        maxlength: [512, "Password too long"],
    },
    roleId: {
        type: Number,
        enum: RoleModel,
        default: RoleModel.User,
    }
}, {
    versionKey: false,
    toJSON: {virtuals: true},
    id: false, 
});

export const UserModel = model<IUserModel>("UserModel", UserSchema, "users");
