import { useForm } from "react-hook-form";
import { UserModel } from "../../../Models/UserModel";
import { notify } from "../../../Utils/Notify";
import "./Register.css";
import { userService } from "../../../Services/UserService";
import { useNavigate } from "react-router-dom";
import { useTitle } from "../../../Utils/UseTitle";
import ReCAPTCHA from "react-google-recaptcha";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Box, TextField } from "@mui/material";

export function Register() {

    useTitle("Register");

    const { register, handleSubmit, formState: { errors }, setError } = useForm<UserModel>();
    const navigate = useNavigate();
    const [isHuman, setIsHuman] = useState<boolean>(false); // State for verifying reCAPTCHA pass

    // Handle form submission:
    async function send(user: UserModel) {
        try {
            await userService.register(user);
            notify.success("Welcome " + user.firstName);
            navigate("/vacations");
        }
        catch (err: any) {
            // Show email field error if it is already registered:
            if (err.message && err.message.includes("email") && err.message.includes("exists")) {
                setError("email", {
                    type: "manual",
                    message: "This email is already registered."
                });
            } else {
                notify.error(err);
            }
        }
    }

    // Enable form submission after passing reCAPTCHA:
    function onChange(_value: string): void {
        setIsHuman(true);
    }

    return (
        <div className="Register">
            <div className="register-container">

                {/* Header Section */}
                <div className="register-header">
                    <h1>Create Account</h1>
                    <p>Join us and start exploring amazing vacations</p>
                </div>

                {/* Registration Form Section */}
                <Box
                    component="form"
                    className="register-form"
                    onSubmit={handleSubmit(send)}
                    noValidate
                    autoComplete="off"
                >
                    {/* First and Last name fields*/}
                    <div className="form-row">
                        <TextField
                            id="firstName"
                            label="First Name"
                            type="text"
                            variant="outlined"
                            required
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                            {...register("firstName", {
                                required: "First name is required",
                                minLength: {
                                    value: 2,
                                    message: "First name must be at least 2 characters"
                                },
                                maxLength: {
                                    value: 50,
                                    message: "First name cannot exceed 50 characters"
                                }
                            })}
                            className="mui-textfield"
                        />

                        <TextField
                            id="lastName"
                            label="Last Name"
                            type="text"
                            variant="outlined"
                            required
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                            {...register("lastName", {
                                required: "Last name is required",
                                minLength: {
                                    value: 2,
                                    message: "Last name must be at least 2 characters"
                                },
                                maxLength: {
                                    value: 50,
                                    message: "Last name cannot exceed 50 characters"
                                }
                            })}
                            className="mui-textfield"
                        />
                    </div>

                     {/* Email field */}
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

                    {/* Password field */}
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

                    {/* Google reCAPTCHA */}
                    <div className="recaptcha-container">
                        <ReCAPTCHA
                            sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                            onChange={onChange}
                        />
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        className={`register-button ${!isHuman ? 'disabled' : ''}`}
                        disabled={!isHuman}
                    >
                        Create Account
                    </button>
                </Box>

                {/* Link to login */}
                <div className="login-link">
                    <p>Already have an account? <NavLink to="/login">Login now</NavLink></p>
                </div>
            </div>
        </div>
    );
}
