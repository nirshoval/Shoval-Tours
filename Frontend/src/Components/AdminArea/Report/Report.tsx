import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { UserModel } from "../../../Models/UserModel";
import { VacationModel } from "../../../Models/VacationModel";
import { AppState } from "../../../Redux/Store";
import { reportService } from "../../../Services/ReportService";
import { notify } from "../../../Utils/Notify";
import { useTitle } from "../../../Utils/UseTitle";
import { LikesBarChart } from './Chart/LikesBarChart';
import "./Report.css";

export function Report() {

    useTitle("Vacations Report");

    const user = useSelector<AppState, UserModel>(store => store.user);
    const [vacations, setVacations] = useState<VacationModel[]>([]);

    // Fetch vacations with likes on mount
    useEffect(() => {
        if (!user) return;
        reportService.getLikesCountPerVacation()
            .then(v => setVacations(v))
            .catch(err => notify.error(err));
    }, [user]);

    // Export data to CSV:
    async function exportToCsv() {
        try {
            const blob = await reportService.getLikesCountPerVacationForCsv();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'vacation-likes-report.csv';
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
            notify.success("CSV File exported successfully!");
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    // Filter vacations that have at least one like:
    const filteredVacations = vacations.filter(v => v.likesCount && v.likesCount > 0);

    return (
        <div className="Report">

            <h2>📊 Vacation Likes Report</h2>

            <button className="ExportButton" onClick={exportToCsv}>
                📥 Export To CSV
            </button>

            {filteredVacations.length > 0 ? (
                <LikesBarChart vacations={filteredVacations} />
            ) : (
                <div className="EmptyState">
                    <h3>📊 No Data Available</h3>
                    <p>There are currently no vacation likes to display in the report.</p>
                </div>
            )}
        </div>


    );
}
