import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { UserModel } from "../../../Models/UserModel";
import { AppState } from "../../../Redux/Store";
import { userService } from "../../../Services/UserService";
import { notify } from "../../../Utils/Notify";
import "./UserMenu.css";

export function UserMenu() {

    const user = useSelector<AppState, UserModel>(store => store.user);
    const navigate = useNavigate();

    // Logout the user:
    function logMeOut() {
        userService.logout();
        notify.success(`Bye Bye ${user.firstName}!`);
        sessionStorage.setItem("userLogout", "true");
        navigate("/home");
    }

    return (
        <div className="UserMenu">

            {/* Non Logged-In User: */}
            {!user && <div>
                <span>
                    Hello Guest
                </span>
                <span> | </span>
                <NavLink to="/login">
                    Login
                </NavLink>
                <span> | </span>
                <NavLink to="/register">
                    Register
                </NavLink>
            </div>}

            {/* Logged-In User: */}
            {user && <div>
                <span>
                    Hello {user.firstName} {user.lastName}
                </span>
                <span> | </span>
                <NavLink to="/home" onClick={logMeOut}>
                    Logout
                </NavLink>
            </div>}

        </div>
    );
}
