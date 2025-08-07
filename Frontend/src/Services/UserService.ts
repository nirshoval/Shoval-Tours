import axios from "axios";
import { UserModel } from "../Models/UserModel";
import { appConfig } from "../Utils/AppConfig";
import { store } from "../Redux/Store";
import { jwtDecode } from "jwt-decode";
import { CredentialsModel } from "../Models/CredentialsModel";
import { userSlice } from "../Redux/UserSlice";

class UserService {

    //  Load user from localStorage on page refresh: 
    constructor() {

        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            this.handleToken(token);
        } catch {
            localStorage.removeItem("token");
        }
    }

    // Decodes the token and updates the user state in the store and localStorage:
    private handleToken(token: string): void {
        const userContainer = jwtDecode<{ user: UserModel }>(token);
        const dbUser = userContainer.user;

        store.dispatch(userSlice.actions.initUser(dbUser));
        localStorage.setItem("token", token);
    }

    // Register new user: 
    public async register(user: UserModel): Promise<void> {

        user.email = user.email.trim().toLowerCase();

        const response = await axios.post<string>(appConfig.registerUrl, user);

        const token = response.data;

        this.handleToken(token);
    }

    // Login existing user: 
    public async login(credentials: CredentialsModel): Promise<void> {

        credentials.email = credentials.email.trim().toLowerCase();

        const response = await axios.post<string>(appConfig.loginUrl, credentials);

        const token = response.data;

        this.handleToken(token);
    }

    // Logout the user from the global state: 
    public logout(): void {
        store.dispatch(userSlice.actions.logoutUser());
        localStorage.removeItem("token");
    }

}

export const userService = new UserService();
