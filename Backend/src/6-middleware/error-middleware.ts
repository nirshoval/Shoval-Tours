import { NextFunction, Request, Response } from 'express';
import { StatusCode } from '../3-models/statusCode-model';
import { ClientError } from '../3-models/client-error';
import { appConfig } from '../2-utils/app-config';
import { logger } from '../2-utils/logger';

class ErrorMiddleware {

    // Catch-All middleware:
    public async catchAll(err: any, request: Request, response: Response, next: NextFunction){
        
        // Log the error:
        err.clientIp = request.clientIp;
        console.error(err);
        await logger.logError(err);
        
        // Take error status or 500 if not found:
        const status = err.status || StatusCode.InternalServerError;

        // Take error message, never return crash errors in production:
        const message = (status === StatusCode.InternalServerError && appConfig.isProduction) ? "Some error, please try again." : err.message;

        // Response back the error:
        response.status(status).send({ error: message });

    }

    // Route not found:
    public routeNotFound(request: Request, response: Response, next: NextFunction){
        const err = new ClientError(StatusCode.NotFound, `Route ${request.originalUrl} on method  ${request.method} not found`);   
        next(err);
    }
}

export const errorMiddleware = new ErrorMiddleware();