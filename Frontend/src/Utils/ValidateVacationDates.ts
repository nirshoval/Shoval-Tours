export function validateVacationDates(startDate: string, endDate: string, allowPastStartDate: boolean = false): void {
    // Get current date and convert all dates to Date objects:
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Normalize time to ensure comparison is only by date:
    now.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    // Validation:
    //  Throw error If past start dates are not allowed or start date is before today:
    if (!allowPastStartDate && start < now) {
        throw new Error("Start date must be today or a future date.");
    }

    // Throw error if End date selected before start date:
    if (end < start) {
        throw new Error("End date must be the same as or later than the start date.");
    }
}