import express, { NextFunction, Request, Response } from 'express';
import { StatusCode } from '../3-models/statusCode-model';
import { vacationService } from '../4-services/vacation-service';
import { VacationModel } from '../3-models/vacation-model';
import { securityMiddleware } from '../6-middleware/security-middleware';
import { fileSaver } from 'uploaded-file-saver';
import { UploadedFile } from 'express-fileupload';


class VacationController {

    public readonly router = express.Router();

    public constructor() {
        this.router.get("/api/vacations/:userId([0-9a-f]{24})", securityMiddleware.validateToken, this.getAllVacations);
        this.router.get("/api/vacations/single/:_id([0-9a-f]{24})", securityMiddleware.validateToken, this.getOneVacation);
        this.router.post("/api/vacations", securityMiddleware.validateAdmin, this.addVacation);
        this.router.put("/api/vacations/:_id([0-9a-f]{24})", securityMiddleware.validateAdmin, this.updateVacation);
        this.router.delete("/api/vacations/:_id([0-9a-f]{24})", securityMiddleware.validateAdmin, this.deleteVacation);
        this.router.get("/api/vacations/active", securityMiddleware.validateToken, this.getActiveVacations);
        this.router.get("/api/vacations/future", securityMiddleware.validateToken, this.getFutureVacations);
        this.router.get("/api/vacations/liked-vacations-by-user/:userId([0-9a-f]{24})", securityMiddleware.validateToken, this.getLikedVacationsByUser);
        this.router.get("/api/vacations/images/:imageName", this.getImageFile);
    }

    // Get all vacations by user id (with likes count and check if the user liked them):
    private async getAllVacations(request: Request, response: Response, next: NextFunction) {
        try {
            const userId = request.params.userId;
            const vacation = await vacationService.getAllVacations(userId);
            response.json(vacation);
        } catch (err: any) { next(err) }
    }

    // Get a single vacation by id:
    private async getOneVacation(request: Request, response: Response, next: NextFunction) {
        try {
            const _id = request.params._id;
            const vacation = await vacationService.getOneVacation(_id);
            response.json(vacation);
        } catch (err: any) { next(err) }
    }

    // Add a new vacation:
    private async addVacation(request: Request, response: Response, next: NextFunction) {
        try {
            request.body.image = request.files?.image;
            const vacation = new VacationModel(request.body);
            const dbVacation = await vacationService.addVacation(vacation);
            response.status(StatusCode.Created).json(dbVacation);
        } catch (err: any) { next(err) }
    }

    // Update an existing vacation:
    private async updateVacation(request: Request, response: Response, next: NextFunction) {
        try {
            request.body._id = request.params._id;
            const vacation = new VacationModel(request.body);
            if (request.files && request.files.image) {
                vacation.image = request.files.image as UploadedFile;
            }
            const dbVacation = await vacationService.updateVacation(vacation);
            response.json(dbVacation);
        } catch (err: any) { next(err) }
    }

    // Delete a vacation by id:
    private async deleteVacation(request: Request, response: Response, next: NextFunction) {
        try {
            const _id = request.params._id;
            await vacationService.deleteVacation(_id);
            response.status(StatusCode.NoContent).json();
        } catch (err: any) { next(err) }
    }

    // Get all vacations currently active: 
    private async getActiveVacations(request: Request, response: Response, next: NextFunction) {
        try {
            const vacations = await vacationService.getActiveVacations();
            response.json(vacations);
        } catch (err: any) { next(err) }
    }

    // Get all future vacations:
    private async getFutureVacations(request: Request, response: Response, next: NextFunction) {
        try {
            const vacations = await vacationService.getFutureVacations();
            response.json(vacations);
        } catch (err: any) { next(err) }
    }

    // Get vacations liked by a specific user:
    private async getLikedVacationsByUser(request: Request, response: Response, next: NextFunction) {
        try {
            const userId = request.params.userId;
            const vacations = await vacationService.getLikedVacationsByUser(userId);
            response.json(vacations);
        } catch (err: any) { next(err) }
    }

    // Get a vacation image file by its name
    private async getImageFile(request: Request, response: Response, next: NextFunction) {
        try {
            const imageName = request.params.imageName;
            const imagePath = fileSaver.getFilePath(imageName);
            response.sendFile(imagePath);
        } catch (err: any) { next(err) }
    }
    
}

export const vacationController = new VacationController();