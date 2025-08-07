import { cyber } from "../2-utils/cyber";
import { ClientError } from "../3-models/client-error";
import { CredentialsModel } from "../3-models/credentials-model";
import { RegisterModel } from "../3-models/register-model";
import { StatusCode } from "../3-models/statusCode-model";
import { IUserModel, UserModel } from "../3-models/user-model";

class UserService {
    
    // Register new user:
    public async register(register: RegisterModel): Promise<string> {

        // Joi Validation:
        RegisterModel.validate(register);

        // Normalize email:
        register.email = register.email.toLowerCase().trim();

        // Check for existing user:
        const existingUser = await UserModel.findOne({ email: register.email }).exec();
        if (existingUser) throw new ClientError(StatusCode.Conflict, "Email already exists");

        // Create user:
        const user = new UserModel(register);

        // Mongoose validation:
        const error = user.validateSync();
        if (error) throw new ClientError(StatusCode.BadRequest, error.message);

        // Hash password:
        user.password = cyber.hash(user.password);

        // Save user:
        await user.save();

        // Token:
        const token = cyber.getNewToken(user);
        return token;
    }

    // Login for existing users:
    public async login(credentials: CredentialsModel): Promise<string>{

        // Validation:
        CredentialsModel.validate(credentials);
        
        // Hash password:
        credentials.password = cyber.hash(credentials.password);

        // Find user by email and password:
        const user = await UserModel.findOne({ email: credentials.email, password: credentials.password}).exec();

        // If no such user:
        if(!user) throw new ClientError(StatusCode.Unauthorized, `Incorrect email or password.`);

        // Token:
        const token = cyber.getNewToken(user);

        return token 

    }
}

export const userService = new UserService();