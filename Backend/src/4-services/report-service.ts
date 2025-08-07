import { ClientError } from "../3-models/client-error";
import { StatusCode } from "../3-models/statusCode-model";
import { VacationModel } from "../3-models/vacation-model";

class ReportService {

    // Get all vacations and count the likes for each vacation
    public async getLikesCountForAllVacations() {
        const report = await VacationModel.aggregate([
            { $lookup: { from: "likes", localField: "_id", foreignField: "vacationId", as: "likes"}},
            { $project: { destination: 1, likesCount: { $size: "$likes" } }},
            { $sort: { destination: 1 } }
        ]);

        // If no vacations were found:
        if (!report || report.length === 0) throw new ClientError(StatusCode.NotFound, "Sorry, no vacations found.");
        return report;
    }

    //  Get all vacations and count the likes for each vacation and returns it in CSV format:
    public async getLikesCountForAllVacationToCsv(): Promise<string> {

        const vacationLikes = await this.getLikesCountForAllVacations();

        // If no data found, throw error:
        if (!vacationLikes || vacationLikes.length === 0) throw new ClientError(StatusCode.NotFound, "Sorry, no likes found for any vacation.");

        // Filter vacations that actually have likes:
        const filteredVacations = vacationLikes.filter(vacation => vacation.likesCount > 0);

        if (filteredVacations.length === 0) throw new ClientError(StatusCode.NotFound, "Sorry, no vacations with likes found.");

        // Building the CSV content:
        let content = "\ufeff";
        content += "Destination,Likes\r\n";

        for (const vacation of filteredVacations) {
            const escapedDestination = `"${vacation.destination.replace(/"/g, '""')}"`;
            content += `${escapedDestination},${vacation.likesCount}\r\n`;
        }

        return content;
    }


}

export const reportService = new ReportService();