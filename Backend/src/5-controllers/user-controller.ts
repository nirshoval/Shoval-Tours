import express, {NextFunction, Request, Response} from 'express';
import { UserModel } from '../3-models/user-model';
import { userService } from '../4-services/user-service';
import { StatusCode } from '../3-models/statusCode-model';
import { CredentialsModel } from '../3-models/credentials-model';
import { RegisterModel } from '../3-models/register-model';

class UserController {

    public readonly router = express.Router();

    public constructor() {
        this.router.post("/api/register", this.register);
        this.router.post("/api/login", this.login);
    }

    // Register:
    public async register(request: Request, response: Response, next: NextFunction) {
        try {
            const register = new RegisterModel(request.body);
            const token = await userService.register(register);
            response.status(StatusCode.Created).json(token);
        } catch (err: any) {
            next(err);
        }
    }

    // Login:
    public async login(request: Request, response: Response, next: NextFunction){
        try {
            const credentials = new CredentialsModel(request.body);
            const token = await userService.login(credentials);
            response.json(token);
        } 
        catch (err: any) { next(err) } // Go to the catch-all middleware
    }
}
export const userController = new UserController();
