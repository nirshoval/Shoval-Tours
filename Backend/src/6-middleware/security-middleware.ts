import express, { NextFunction, Request, Response } from 'express';
import { cyber } from '../2-utils/cyber';
import { ClientError } from '../3-models/client-error';
import { StatusCode } from '../3-models/statusCode-model';
import striptags from 'striptags';

class SecurityMiddleware {

    // Is user logged-in:
    public validateToken(request: Request, response: Response, next: NextFunction): void {

        const header = request.headers.authorization;
        const token = header?.substring(7);

        if(!cyber.validateToken(token)){
            const err = new ClientError(StatusCode.Unauthorized, "You are not logged in.");
            next(err);
            return;
        }
        next();
    }

    // Is user Admin:
    public validateAdmin(request: Request, response: Response, next: NextFunction): void {

        const header = request.headers.authorization;
        const token = header?.substring(7);

        if(!cyber.validateAdmin(token)){
            const err = new ClientError(StatusCode.Forbidden, "You are not authorized.");
            next(err);
            return;
        }
        next();
    }

    // Is regular user:
    public validateUser(request: Request, response: Response, next: NextFunction): void {

        const header = request.headers.authorization;
        const token = header?.substring(7);

        if(cyber.validateAdmin(token)){
            const err = new ClientError(StatusCode.Forbidden, "Admin users are not allowed to do this action.");
            next(err);
            return;
        }
        next();
    }


    // Prevent XSS attacks:
    public preventXssAttack(request: Request, response: Response, next: NextFunction): void {
        
        // Strip tags:
        for (const prop in request.body) {
            const value = request.body[prop];
            if (typeof value === "string") {
                request.body[prop] = striptags(value);
            }
        }
        next();
    }
}

export const securityMiddleware = new SecurityMiddleware();