import { NavLink } from "react-router-dom";
import "./Menu.css";
import { useSelector } from "react-redux";
import { AppState } from "../../../Redux/Store";
import { UserModel } from "../../../Models/UserModel";

export function Menu() {

    const user = useSelector<AppState, UserModel>(state => state.user); // Access current user from Redux
    const isAdmin = user?.roleId === 1; // Check if user is admin (roleId === 1)

    return (
        <div className="Menu">

            {/* Home link  (visible to all users) */}
            <NavLink to="/home" end>
                <span className="MenuIcon">🏠</span>
                Home
            </NavLink>

            <span className="MenuSeparator"> | </span>

            {/* Vacations link (visible to all users) */}
            <NavLink to="/vacations" end>
                <span className="MenuIcon">🏖️</span>
                Vacations
            </NavLink>

            {/* Admin-only links */}
            {isAdmin && (
                <>
                    <span className="MenuSeparator"> | </span>
                    <NavLink to="/add-vacation" end>
                        <span className="MenuIcon">➕</span>
                        New
                    </NavLink>

                    <span className="MenuSeparator"> | </span>
                    <NavLink to="/vacations/report" end>
                        <span className="MenuIcon">📊</span>
                        Report
                    </NavLink>
                </>
            )}
        </div>
    );
}
