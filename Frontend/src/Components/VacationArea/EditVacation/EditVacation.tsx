import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { VacationModel } from "../../../Models/VacationModel";
import { vacationService } from "../../../Services/VacationService";
import { notify } from "../../../Utils/Notify";
import "./EditVacation.css";
import { useNavigate, useParams } from "react-router-dom";
import { useTitle } from "../../../Utils/UseTitle";
import { appConfig } from "../../../Utils/AppConfig";
import { validateVacationDates } from "../../../Utils/ValidateVacationDates";
import { Box, TextField, Button, Typography } from "@mui/material";

export function EditVacation() {
    
    useTitle("Edit Vacation");

    const navigate = useNavigate();
    const params = useParams(); // Get the dynamic route parameter
    const id = params.vacationId;

    const { register, handleSubmit, setValue, formState: { errors }, getValues } = useForm<VacationModel>();
    const today = new Date().toISOString().split("T")[0]; // Today's date in YYYY-MM-DD format
    const [startDateValue, setStartDateValue] = useState<string>(today); // Holds the startDate field selection
    const [currentImageUrl, setCurrentImageUrl] = useState<string>(""); // Holds the current image filename from the database for display
    const [newImagePreviewUrl, setNewImagePreviewUrl] = useState<string>(""); // Holds the preview URL for a newly selected image
    const [imageError, setImageError] = useState<string>(""); // Holds validation error message related to the selected image file
    const imgInputRef = useRef<HTMLInputElement>(null); // Reference to the hidden image file input element

    // Load vacation details:
    useEffect(() => {

        if (!id) {
            notify.error("Invalid vacation ID.");
            navigate("/vacations");
            return;
        }

        vacationService.getOneVacation(id)
            .then(vacation => {
                setValue("destination", vacation.destination);
                setValue("description", vacation.description);
                setValue("startDate", new Date(vacation.startDate).toISOString().split("T")[0]);
                setValue("endDate", new Date(vacation.endDate).toISOString().split("T")[0]);
                setValue("price", vacation.price);
                setCurrentImageUrl(vacation.imageName);
            })
            .catch(err => notify.error(err));
    }, [id]);

    // Cleanup image preview on unmount:
    useEffect(() => {
        return () => {
            if (newImagePreviewUrl) {
                URL.revokeObjectURL(newImagePreviewUrl);
            }
        };
    }, [newImagePreviewUrl]);

    // Handle form submission:
    async function send(vacation: VacationModel) {
        try {
            validateVacationDates(vacation.startDate, vacation.endDate, true); //  Validate vacation dates before submitting
            vacation._id = id;
            const file = imgInputRef.current?.files?.[0];
            await vacationService.updateVacation(vacation, file);
            notify.success("Vacation has been updated.");
            navigate("/vacations");
        } catch (err: any) {
            notify.error(err);
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
            if (newImagePreviewUrl) {
                URL.revokeObjectURL(newImagePreviewUrl);
            }

            setImageError("");
            const previewUrl = URL.createObjectURL(file);
            setNewImagePreviewUrl(previewUrl);
        } else {
            setNewImagePreviewUrl("");
            setImageError("");
        }
    }

    return (
        <div className="EditVacation">
            <div className="edit-vacation-container">

                {/* Header Section */}
                <div className="edit-vacation-header">
                    <Typography variant="h3" component="h1" className="edit-vacation-title">
                        Edit Vacation
                    </Typography>
                    <Typography variant="h6" className="edit-vacation-subtitle">
                        Update the destination details and make it perfect
                    </Typography>
                </div>

                {/* Form Section */}
                <Box
                    component="form"
                    className="edit-vacation-form"
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
                                {(newImagePreviewUrl || currentImageUrl) && (
                                    <img
                                        src={newImagePreviewUrl || (appConfig.vacationImageUrl + currentImageUrl)}
                                        alt="Vacation Preview"
                                        crossOrigin="anonymous"
                                    />
                                )}
                                <div className="image-overlay">
                                    <Typography variant="body1" className="upload-text">
                                        {newImagePreviewUrl ? 'Click to change image' : 'Click to update image'}
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
                            Supported formats: JPG, PNG, GIF (Max size: 5MB) • Leave empty to keep current image
                        </Typography>

                        {/* Hidden file input */}
                        <input
                            type="file"
                            accept="image/*"
                            ref={imgInputRef}
                            className="hidden-input"
                            onChange={updateImagePreview}
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
                            className="edit-vacation-button"
                            size="large"
                        >
                            Update Vacation
                        </Button>
                    </div>

                </Box>

            </div>

        </div>
    );
}
