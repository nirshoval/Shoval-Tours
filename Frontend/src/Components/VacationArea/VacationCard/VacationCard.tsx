import { Chip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { UserModel } from "../../../Models/UserModel";
import { VacationModel } from "../../../Models/VacationModel";
import { AppState } from "../../../Redux/Store";
import { vacationSlice } from "../../../Redux/VacationSlice";
import { likeService } from "../../../Services/LikeService";
import { appConfig } from "../../../Utils/AppConfig";
import { notify } from "../../../Utils/Notify";
import "./VacationCard.css";

// Props type for this component:
type VacationCardProps = {
    vacation: VacationModel;
    deleteMe: (_id: string) => void;
}

export function VacationCard(props: VacationCardProps) {

    // Update the Redux store after like or unlike actions:
    const dispatch = useDispatch();

    // Get the current user from the global Redux state:
    const user = useSelector<AppState, UserModel>(state => state.user);
    const isAdmin = user?.roleId === 1;
    const isUser = user?.roleId === 2;

    // Get the latest version of the vacation object from the Redux state:
    const updatedVacation = useSelector((state: AppState) =>
        state.vacations.find(v => v._id === props.vacation._id)
    );

    // Don't render the card if the vacation is not found:
    if (!updatedVacation) return null;

    const isLiked = updatedVacation?.isLiked ?? false;
    const likesCount = updatedVacation?.likesCount ?? 0;

    // Toggle like or unlike behavior:
    async function toggleLike() {
        try {
            if (!user) return;

            if (isLiked) {
                // Send unlike request to the server and Update the state:
                await likeService.unlikeVacation(user._id, props.vacation._id);
                dispatch(vacationSlice.actions.toggleLike({ vacationId: props.vacation._id, isLiked: false }));

            } else {
                // Send like request to the server and Update the state:
                await likeService.likeVacation({ userId: user._id, vacationId: props.vacation._id });
                dispatch(vacationSlice.actions.toggleLike({ vacationId: props.vacation._id, isLiked: true }));
            }
        } catch (err: any) {
            notify.error(err);
        }
    }

    // Handle delete vacation button:
    function remove() {
        props.deleteMe(props.vacation._id);
    }

    return (
        <div className="VacationCard">
            <div className="ImageContainer">

                {/* Vacation image */}
                <img
                    src={`${appConfig.vacationImageUrl}${props.vacation.imageName}?ts=${props.vacation._id}`}
                    crossOrigin="anonymous"
                    alt={props.vacation.destination}
                />

                {/* Display actions buttons depending on user role */}
                <div className="ButtonsTopLeft">
                    {isAdmin && (
                        <>
                            <NavLink to={"/edit-vacation/" + props.vacation._id}>✏️ Edit</NavLink>
                            <button onClick={remove}>🗑️ Delete</button>
                        </>
                    )}
                    {isUser && (
                        <Chip
                            icon={<span>{isLiked ? "❤️" : "🤍"}</span>}
                            label={`Likes: ${likesCount}`}
                            clickable
                            onClick={toggleLike}
                        />
                    )}
                </div>
            </div>

            {/* Vacation destination */}
            <div className="DestinationTitle">
                {props.vacation.destination}
            </div>

            {/* Vacation dates */}
            <div className="Dates">
                <span>{new Date(props.vacation.startDate).toLocaleDateString()}</span> -
                <span>{new Date(props.vacation.endDate).toLocaleDateString()}</span>
            </div>

            {/* Vacation description */}
            <p className="Description">{props.vacation.description}</p>

            {/* Vacation price */}
            <div className="Price">
                ${props.vacation.price}
            </div>
        </div>

    );
}
