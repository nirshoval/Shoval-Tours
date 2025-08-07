import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "../../PagesArea/Home/Home";
import { Page404 } from "../Page404/Page404";
import "./Routing.css";
import { Vacations } from "../../VacationArea/Vacations/Vacations";
import { Register } from "../../UserArea/Register/Register";
import { Login } from "../../UserArea/Login/Login";
import { AddVacation } from "../../VacationArea/AddVacation/AddVacation";
import { EditVacation } from "../../VacationArea/EditVacation/EditVacation";
import { Report } from "../../AdminArea/Report/Report";

export function Routing() {

    return (
        <div className="Routing">
            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Home />} />

                <Route path="/vacations" element={<Vacations />} />

                <Route path="/add-vacation" element={<AddVacation />} />
                <Route path="/edit-vacation/:vacationId" element={<EditVacation />} />
                <Route path="/vacations/report" element={< Report />} />

                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                
                <Route path="*" element={<Page404 />} />
            </Routes>
        </div>
    );
}
