import axios from "axios";
import { VacationModel } from "../Models/VacationModel";
import { appConfig } from "../Utils/AppConfig";

class ReportService {

    // Get a list of vacations with their like counts:
    public async getLikesCountPerVacation(): Promise<VacationModel[]> {
        const response = await axios.get<VacationModel[]>(appConfig.reportUrl);
        return response.data;
    }

    // Get a list of the same report in a CSV format:
    public async getLikesCountPerVacationForCsv(): Promise<Blob> {
        const response = await axios.get(appConfig.reportCsvUrl, { responseType: "blob" });
        return response.data;
    }

}

export const reportService = new ReportService();