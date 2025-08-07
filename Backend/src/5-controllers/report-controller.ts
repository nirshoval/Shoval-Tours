import express, {NextFunction, Request, Response} from 'express';
import { StatusCode } from '../3-models/statusCode-model';
import { reportService } from '../4-services/report-service';
import { securityMiddleware } from '../6-middleware/security-middleware';

class ReportController {
 
    public readonly router = express.Router();

    public constructor() {
        this.router.get("/api/reports/count-vacations-likes/", securityMiddleware.validateAdmin, this.getLikesCountForAllVacations);
        this.router.get("/api/reports/export-to-csv/", securityMiddleware.validateAdmin, this.getLikesCountForAllVacationsToCsv);
        
    }

    // Get all vacations and count the likes for each vacation:
    private async getLikesCountForAllVacations(request: Request, response: Response, next: NextFunction) {
        try {            
            const report = await reportService.getLikesCountForAllVacations();         
            response.json(report);
        } catch (err: any) { next(err) } 
    }

    //  Get all vacations and count the likes for each vacation and returns it in CSV format:
    private async getLikesCountForAllVacationsToCsv(request: Request, response: Response, next: NextFunction) {
        try {            
            const csvData = await reportService.getLikesCountForAllVacationToCsv();         
            response.setHeader("Content-Type", "text/csv; charset=utf-8");
            response.setHeader("Content-Disposition", "attachment; filename=vacation-likes-report.csv");
            response.status(StatusCode.OK).send(csvData);
        } catch (err: any) { next(err) } 
    }


}

export const reportController = new ReportController();