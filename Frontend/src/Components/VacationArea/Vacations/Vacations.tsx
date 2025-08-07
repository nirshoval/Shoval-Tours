import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserModel } from "../../../Models/UserModel";
import { VacationModel } from "../../../Models/VacationModel";
import { AppState } from "../../../Redux/Store";
import { vacationService } from "../../../Services/VacationService";
import { notify } from "../../../Utils/Notify";
import { useTitle } from "../../../Utils/UseTitle";
import { VacationCard } from "../VacationCard/VacationCard";
import "./Vacations.css";
import { Pagination } from "@mui/material";

// Filter types for vacation view
type FilterType = "all" | "liked" | "active" | "future";

export function Vacations() {

    useTitle("All Vacations");

    const navigate = useNavigate();
    const vacations = useSelector<AppState, VacationModel[]>(store => store.vacations);
    const user = useSelector<AppState, UserModel>(store => store.user);

    const [filteredVacations, setFilteredVacations] = useState<VacationModel[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeFilter, setActiveFilter] = useState<FilterType>("all");

    const vacationsPerPage = 9;

    // Checks user authentication and fetches vacations on first load:
    useEffect(() => {

        const token = sessionStorage.getItem("token") || localStorage.getItem("token");

        if (!user || !token) {
            const Logout = sessionStorage.getItem("userLogout");
            if (Logout) {
                sessionStorage.removeItem("userLogout");
                navigate("/home");
            } else {
                notify.error("You must be logged in to view vacations.");
                navigate("/login");
            }
            return;
        }

        vacationService.getAllVacations(user._id)
            .catch(err => notify.error(err));

    }, [user, navigate]);

    // Update filtered vacations list:
    useEffect(() => {
        switch (activeFilter) {
            case "all":
                setFilteredVacations(vacations);
                break;
            case "liked":
                setFilteredVacations(vacations.filter(v => v.isLiked));
                break;
            default:
                break;
        }
    }, [vacations, activeFilter]);

    // Pagination handler and scroll to top:
    function scrollToTop(value: number) {
        setCurrentPage(value);
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 0);
    }

    // Changes the vacations list displayed according to the selected filter:
    function applyFilter(type: FilterType) {

        setActiveFilter(type);
        setCurrentPage(1);

        switch (type) {
            case "all":
            case "liked":
                // handled by the useEffect
                break;
            case "active":
                vacationService.getActiveVacations()
                    .then(setFilteredVacations)
                    .catch(err => notify.error(err));
                break;
            case "future":
                vacationService.getFutureVacations()
                    .then(setFilteredVacations)
                    .catch(err => notify.error(err));
                break;
        }
    }

    // Pagination slicing:
    const indexOfLastVacation = currentPage * vacationsPerPage;
    const indexOfFirstVacation = indexOfLastVacation - vacationsPerPage;
    const currentVacations = filteredVacations.slice(indexOfFirstVacation, indexOfLastVacation);
    const totalPages = Math.ceil(filteredVacations.length / vacationsPerPage);

    // Delete a vacation:
    async function deleteVacation(_id: string) {
        try {
            const sure = confirm("Are you sure?");
            if (!sure) return;
            await vacationService.deleteVacation(_id);
            notify.success("Vacation has been deleted");
            setFilteredVacations(prev => prev.filter(v => v._id !== _id));
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    // Return an appropriate error message for empty filter results:
    function getNoResult() {
        switch (activeFilter) {
            case "all":
                return {
                    title: "No Vacations Available",
                    message: "There are currently no vacations in the system.",
                    icon: "✈️"
                };
            case "liked":
                return {
                    title: "No Liked Vacations",
                    message: "You haven't liked any vacations yet. Explore new destinations and start adding favorites to your list!",
                    icon: "❤️"
                };
            case "active":
                return {
                    title: "No Active Vacations",
                    message: "There are currently no ongoing vacations. Check out future vacations!",
                    icon: "⏳"
                };
            case "future":
                return {
                    title: "No Future Vacations",
                    message: "There are currently no planned future vacations. Check back soon for updates!",
                    icon: "🔮"
                };
            default:
                return {
                    title: "No Results Found",
                    message: "No vacations match your current filter.",
                    icon: "🔍"
                };
        }
    }

    return (
        <div className="Vacations">

            {/* Filter buttons */}
           <div className="Filters">
                <button
                    onClick={() => applyFilter("all")}
                    className={activeFilter === "all" ? "active" : ""}
                >
                    All Vacations
                </button>
                {
                    user?.roleId === 2 &&
                    <button
                        onClick={() => applyFilter("liked")}
                        className={activeFilter === "liked" ? "active" : ""}
                    >
                        Liked Vacations
                    </button>
                }
                <button
                    onClick={() => applyFilter("active")}
                    className={activeFilter === "active" ? "active" : ""}
                >
                    Active Vacations
                </button>
                <button
                    onClick={() => applyFilter("future")}
                    className={activeFilter === "future" ? "active" : ""}
                >
                    Future Vacations
                </button>
            </div>

            {/* Vacation list or empty state */}
            <div className="VacationsContainer">
                {currentVacations.length > 0 ? (
                    currentVacations.map(v => <VacationCard key={v._id} vacation={v} deleteMe={deleteVacation} />)
                ) : (
                    <div className="EmptyState">
                        <div className="EmptyStateIcon">{getNoResult().icon}</div>
                        <h3 className="EmptyStateTitle">{getNoResult().title}</h3>
                        <p className="EmptyStateMessage">{getNoResult().message}</p>
                        {activeFilter !== "all" && (
                            <button className="BackToAllButton" onClick={() => applyFilter("all")}>
                                View All Vacations
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {filteredVacations.length > vacationsPerPage && (
                <div className="PaginationContainer">
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(_, value) => scrollToTop(value)}
                        color="primary"
                        size="large"
                        sx={{ marginBottom: 1, display: "flex", justifyContent: "center"  }}
                    />
                </div>
            )}

        </div>
    );
}
