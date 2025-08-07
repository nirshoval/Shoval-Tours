import { JSX, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { VacationModel } from "../../../Models/VacationModel";
import { notify } from "../../../Utils/Notify";
import { useTitle } from "../../../Utils/UseTitle";
import "./AddVacation.css";
import { vacationService } from "../../../Services/VacationService";
import imagePlaceholder from "../../../Assets/Images/image-placeholder.png";
import { validateVacationDates } from "../../../Utils/ValidateVacationDates";
import { Box, TextField, Button, Typography } from "@mui/material";

export function AddVacation(): JSX.Element {

    useTitle("Add Vacation");

    // Destructuring Assignment
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, getValues } = useForm<VacationModel>();
    const today = new Date().toISOString().split("T")[0]; // Today's date in YYYY-MM-DD format
    const [startDateValue, setStartDateValue] = useState<string>(today); // Holds the startDate field selection
    const [previewUrl, setPreviewUrl] = useState<string>(imagePlaceholder); // Holds the image preview URL
    const [imageError, setImageError] = useState<string>(""); // Holds validation message for image selection
    const imgInputRef = useRef<HTMLInputElement>(null); // Ref for the hidden file input element

    // Clean up the object URL for the preview image to prevent memory leaks:
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl !== imagePlaceholder) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    // Handle form submission:
    async function send(vacation: VacationModel) {
        try {

            //  Validate vacation dates before submitting
            validateVacationDates(vacation.startDate, vacation.endDate);

            const file = imgInputRef.current?.files?.[0];
            if (!file) {
                setImageError("Image is required");
                throw new Error("Image is missing.");
            }

            vacation.image = file;
            await vacationService.addVacation(vacation);
            notify.success("Vacation has been created.");
            navigate("/vacations");
        }
        catch (err: any) {
            notify.error(err.message || "Failed to add vacation.");
        }
    }

    // Cancel changes:
    function cancel() {
        const sure = confirm("Are you sure you want to cancel? All changes will be lost.");
        if (sure) {
            navigate("/vacations");
        }
    }

    // Handle image file input change and preview:
    function updateImagePreview(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setImageError("Please select a valid image file");
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setImageError("Image size must be less than 5MB");
                return;
            }

            setImageError("");

            if (previewUrl && previewUrl !== imagePlaceholder) {
                URL.revokeObjectURL(previewUrl);
            }

            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            setPreviewUrl(imagePlaceholder);
            setImageError("");
        }
    }

    return (
        <div className="AddVacation">
            <div className="add-vacation-container">

                {/* Header Section */}
                <div className="add-vacation-header">
                    <Typography variant="h3" component="h1" className="add-vacation-title">
                        Create New Vacation
                    </Typography>
                    <Typography variant="h6" className="add-vacation-subtitle">
                        Add a new destination for travelers to discover!
                    </Typography>
                </div>

                {/* Form Section */}
                <Box
                    component="form"
                    className="add-vacation-form"
                    onSubmit={handleSubmit(send)}
                    noValidate
                    autoComplete="off"
                >
                    {/* Destination & Price */}
                    <div className="form-row">
                        <TextField
                            id="destination"
                            label="Destination"
                            type="text"
                            variant="outlined"
                            required
                            error={!!errors.destination}
                            helperText={errors.destination?.message}
                            {...register("destination", {
                                required: "Destination is required",
                                minLength: {
                                    value: 2,
                                    message: "Destination must be at least 2 characters"
                                },
                                maxLength: {
                                    value: 100,
                                    message: "Destination cannot exceed 100 characters"
                                }
                            })}
                            className="mui-textfield"
                            fullWidth
                        />

                        <TextField
                            id="price"
                            label="Price ($)"
                            type="number"
                            variant="outlined"
                            required
                            error={!!errors.price}
                            helperText={errors.price?.message}
                            slotProps={{
                                htmlInput: {
                                    min: 0,
                                    max: 10000,
                                    step: 0.01
                                }
                            }}
                            {...register("price", {
                                required: "Price is required",
                                min: {
                                    value: 0,
                                    message: "Price must be positive"
                                },
                                max: {
                                    value: 10000,
                                    message: "Price cannot exceed $10,000"
                                }
                            })}
                            className="mui-textfield"
                            fullWidth
                        />
                    </div>

                    {/* Description Field */}
                    <TextField
                        id="description"
                        label="Description"
                        multiline
                        rows={1}
                        variant="outlined"
                        required
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        {...register("description", {
                            required: "Description is required",
                            minLength: {
                                value: 10,
                                message: "Description must be at least 10 characters"
                            },
                            maxLength: {
                                value: 1000,
                                message: "Description cannot exceed 1000 characters"
                            }
                        })}
                        className="mui-textfield"
                        fullWidth
                    />

                    {/* Dates Section */}
                    <div className="form-row">
                        <TextField
                            id="startDate"
                            label="Start Date"
                            type="date"
                            variant="outlined"
                            required
                            error={!!errors.startDate}
                            helperText={errors.startDate?.message}
                            slotProps={{
                                htmlInput: {
                                    min: today,
                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                                        setStartDateValue(e.target.value);
                                    }
                                }
                            }}
                            {...register("startDate", {
                                required: "Start date is required"
                            })}
                            className="mui-textfield date-field"
                            fullWidth
                        />

                        <TextField
                            id="endDate"
                            label="End Date"
                            type="date"
                            variant="outlined"
                            required
                            error={!!errors.endDate}
                            helperText={errors.endDate?.message}
                            slotProps={{
                                htmlInput: {
                                    min: startDateValue
                                }
                            }}
                            {...register("endDate", {
                                required: "End date is required",
                                validate: (value) => {
                                    const startDate = getValues("startDate");
                                    if (!startDate) return true;
                                    if (value < startDate) return "End date cannot be before start date";
                                    return true;
                                }
                            })}
                            className="mui-textfield date-field"
                            fullWidth
                        />
                    </div>

                    {/* Image Upload and preview */}
                    <div className="image-upload-section">
                        <Typography variant="h6" className="image-section-title">
                            Vacation Image
                        </Typography>

                        {/* Image preview */}
                        <div
                            className={`image-picker ${imageError ? 'error' : ''}`}
                            onClick={() => imgInputRef.current?.click()}
                        >
                            <div className="image-preview">
                                <img src={previewUrl} alt="Vacation Preview" />
                                <div className="image-overlay">
                                    <Typography variant="body1" className="upload-text">
                                        {previewUrl === imagePlaceholder ? 'Click to upload image' : 'Click to change image'}
                                    </Typography>
                                </div>
                            </div>
                        </div>

                        {/* Image Error message */}
                        {imageError && (
                            <Typography variant="body2" className="image-error">
                                {imageError}
                            </Typography>
                        )}

                        {/* Hint text */}
                        <Typography variant="caption" className="image-help-text">
                            Supported formats: JPG, PNG, GIF (Max size: 5MB)
                        </Typography>

                        {/* Hidden file input */}
                        <input
                            type="file"
                            accept="image/*"
                            ref={imgInputRef}
                            className="hidden-input"
                            onChange={updateImagePreview}
                            required
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="form-actions">
                        <Button
                            variant="outlined"
                            onClick={cancel}
                            className="cancel-button"
                            size="large"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            className="add-vacation-button"
                            size="large"
                        >
                            Add Vacation
                        </Button>
                    </div>

                </Box>

            </div>

        </div>
    );
}
