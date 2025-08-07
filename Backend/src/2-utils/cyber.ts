import jwt, { SignOptions } from "jsonwebtoken";
import { IUserModel } from "../3-models/user-model";
import { RoleModel } from "../3-models/role-model";
import crypto from "crypto";
import { appConfig } from "./app-config";

class Cyber {

    public getNewToken(user: IUserModel): string {
        
        // Delete password before saving the user inside the token:
        delete user.password 

        // User Container:
        const payload = { user };

        // Options:
        const options: SignOptions = { expiresIn: "24h" };

        // Token:
        const token = jwt.sign(payload, appConfig.jwtSecret , options);

        return token;


    }

    // Validate token - if true - user is logged in:
    public validateToken(token: string): boolean {
        try{
            if(!token) return false;
            jwt.verify(token, appConfig.jwtSecret);
            return true;
        }
        catch(err: any){
            return false;
        }
    }

    // Validate admin:
    public validateAdmin(token: string): boolean {
        const payload = jwt.decode(token) as { user: IUserModel };
        const user = payload.user;
        return user.roleId === RoleModel.Admin;
    }

    public hash(plainText: string): string {
        
        // Hash with salting:
        const hashedText = crypto.createHmac("sha512", appConfig.hashSalt).update(plainText).digest("hex");
        return hashedText;
    }
            
}

export const cyber = new Cyber();