import express, {NextFunction, Request, Response} from 'express';
import { StatusCode } from '../3-models/statusCode-model';
import { likeService } from '../4-services/like-service';
import { LikeModel } from '../3-models/like-model';
import { securityMiddleware } from '../6-middleware/security-middleware';

class LikeController {

    public readonly router = express.Router();

    public constructor() {
        this.router.post("/api/likes/", securityMiddleware.validateToken, securityMiddleware.validateUser, this.likeVacation);
        this.router.delete("/api/likes/:userId([0-9a-f]{24})/:vacationId([0-9a-f]{24})", securityMiddleware.validateToken, securityMiddleware.validateUser, this.unlikeVacation);
    }

    // Like a vacation
    private async likeVacation(request: Request, response: Response, next: NextFunction) {
        try {
            const like =  new LikeModel(request.body);
            const dbLike = await likeService.likeVacation(like);
            response.status(StatusCode.Created).json(dbLike);
        } catch (err: any) { next(err) }
    }

    // Uunlike a vacation
    private async unlikeVacation(request: Request, response: Response, next: NextFunction) {
        try {
            const userId = request.params.userId;
            const vacationId = request.params.vacationId;
            await likeService.unlikeVacation(userId, vacationId);
            response.status(StatusCode.NoContent).json();
        } catch (err: any) { next(err) }
    }

}

export const likeController = new LikeController();
