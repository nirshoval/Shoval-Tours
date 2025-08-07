import { useTitle } from "../../../Utils/UseTitle";
import "./Page404.css";

export function Page404() {

    useTitle("Page Not Found");

    return (
        <div className="Page404">

            <h2>The page you are looking for doesn't exist.</h2>

        </div>
    );
}
