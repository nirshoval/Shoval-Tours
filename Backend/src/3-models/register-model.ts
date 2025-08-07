import Joi from "joi";
import { ClientError } from "./client-error";
import { StatusCode } from "./statusCode-model";

export class RegisterModel {
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;

    public constructor(user: RegisterModel) {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.password = user.password;
    }

    private static validationSchema = Joi.object({
        firstName: Joi.string().min(2).max(50).trim().required().label("First name"),
        lastName: Joi.string().min(2).max(50).trim().required().label("Last name"),
        email: Joi.string().email().lowercase().trim().required().label("Email"),
        password: Joi.string().min(4).max(512).trim().required().label("Password"),
    });

    public static validate(register: RegisterModel): void {
        const result = RegisterModel.validationSchema.validate(register);
        if (result.error) {
            const message = result.error.details[0].message.replace(/"/g, "");
            throw new ClientError(StatusCode.BadRequest, message);
        }
    }
}