import { UserMenu } from "../../UserArea/UserMenu/UserMenu";
import "./Header.css";
import { useSelector } from "react-redux";
import { AppState } from "../../../Redux/Store";
import { UserModel } from "../../../Models/UserModel";

export function Header() {
    const user = useSelector<AppState, UserModel>(state => state.user); // Getting the current user from Redux
    const isAdmin = user?.roleId === 1;  // Check if the current user is an admin 

    return (
        <div className={`Header ${isAdmin ? 'HeaderAdmin' : ''}`}>
            <UserMenu />
            <div className="HeaderContent">
                <h1>
                    <span className="HeaderIcon">✈️</span>
                    Shoval Tours

                    {/* Show 'ADMIN VIEW' only for admin users */}
                    {isAdmin && <span className="AdminBadge">ADMIN VIEW</span>}
                </h1>
                <p className="HeaderDescription">
                    Discover Amazing Destinations
                </p>
            </div>
        </div>
    );
}