import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CredentialsModel } from "../../../Models/CredentialsModel";
import { store } from "../../../Redux/Store";
import { userService } from "../../../Services/UserService";
import { notify } from "../../../Utils/Notify";
import "./Login.css";
import { useTitle } from "../../../Utils/UseTitle";
import { NavLink } from "react-router-dom";
import { Box, TextField } from "@mui/material";

export function Login() {

    useTitle("Login");

    const { register, handleSubmit, formState: { errors } } = useForm<CredentialsModel>();
    const navigate = useNavigate();

    // Handle form submission:
    async function send(credentials: CredentialsModel) {
        try {
            await userService.login(credentials);
            notify.success("Welcome Back " + store.getState().user.firstName);
            navigate("/vacations");
        }
        catch (err: any) {
            const message = err?.response?.data || err.message || "Login failed";
            notify.error(message);
        }
    }

    return (
        <div className="Login">
            <div className="login-container">
                
                {/* Header Section */}
                <div className="login-header">
                    <h1>Welcome Back</h1>
                    <p>Sign in to your account</p>
                </div>

                {/* Form Section */}
                <Box
                    component="form"
                    className="login-form"
                    onSubmit={handleSubmit(send)}
                    noValidate
                    autoComplete="off"
                >
                    {/* Email Field */}
                    <TextField
                        id="email"
                        label="Email Address"
                        type="email"
                        variant="outlined"
                        required
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Please enter a valid email address"
                            }
                        })}
                        className="mui-textfield"
                    />

                    {/* Password Field */}
                    <TextField
                        id="password"
                        label="Password"
                        type="password"
                        variant="outlined"
                        required
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        slotProps={{
                            htmlInput: {
                                minLength: 4
                            }
                        }}
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 4,
                                message: "Password must be at least 4 characters long"
                            }
                        })}
                        className="mui-textfield"
                    />

                    {/* Submit Button */}
                    <button type="submit" className="login-button">Sign In</button>
                </Box>
                
                {/* Link to registration page */}
                <div className="register-link">
                    <p>Don't have an account? <NavLink to="/register" end>Create one now</NavLink></p>
                </div>
            </div>
        </div>
    );
}