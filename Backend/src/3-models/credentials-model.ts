import Joi from "joi";
import { ClientError } from "./client-error";
import { StatusCode } from "./statusCode-model";

export class CredentialsModel {

    public email: string;
    public password: string;


    public constructor(user: CredentialsModel) {
        this.email = user.email;
        this.password = user.password;
    }

    // Joi Validation
    private static validationSchema = Joi.object({
        email: Joi.string().email().lowercase().trim().required().label("Email"),
        password: Joi.string().min(4).max(512).trim().required().label("Password"),
    });

    public static validate(credentials: CredentialsModel): void {
        const result = CredentialsModel.validationSchema.validate(credentials);
        if (result.error) {
            const message = result.error.details[0].message.replace(/"/g, "");
            throw new ClientError(StatusCode.BadRequest, message);
        }
    }
}