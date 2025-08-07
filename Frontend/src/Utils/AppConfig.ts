// class DevAppConfig {

//     //  Without Docker:
//         public readonly registerUrl = "http://localhost:4000/api/register/";
//         public readonly loginUrl = "http://localhost:4000/api/login/";

//         public readonly vacationsUrl = "http://localhost:4000/api/vacations/";
//         public readonly singleVacationUrl = "http://localhost:4000/api/vacations/single/";
//         public readonly activeVacationUrl = "http://localhost:4000/api/vacations/active/";
//         public readonly futureVacationUrl = "http://localhost:4000/api/vacations/future/";
//         public readonly likedVacationByUserUrl = "http://localhost:4000/api/vacations/liked-vacations-by-user/";
//         public readonly vacationImageUrl = "http://localhost:4000/api/vacations/images/";

//         public readonly likeUrl = "http://localhost:4000/api/likes/";

//         public readonly reportUrl = "http://localhost:4000/api/reports/count-vacations-likes/";
//         public readonly reportCsvUrl = "http://localhost:4000/api/reports/export-to-csv/";
// }

// class ProdAppConfig {

//     //  For running over Docker:
//     public readonly registerUrl = "http://44.250.217.203:4001/api/register/";
//     public readonly loginUrl = "http://44.250.217.203:4001/api/login/";

//     public readonly vacationsUrl = "http://44.250.217.203:4001/api/vacations/";
//     public readonly singleVacationUrl = "http://44.250.217.203:4001/api/vacations/single/";
//     public readonly activeVacationUrl = "http://44.250.217.203:4001/api/vacations/active/";
//     public readonly futureVacationUrl = "http://44.250.217.203:4001/api/vacations/future/";
//     public readonly likedVacationByUserUrl = "http://44.250.217.203:4001/api/vacations/liked-vacations-by-user/";
//     public readonly vacationImageUrl = "http://44.250.217.203:4001/api/vacations/images/";

//     public readonly likeUrl = "http://44.250.217.203:4001/api/likes/";

//     public readonly reportUrl = "http://44.250.217.203:4001/api/reports/count-vacations-likes/";
//     public readonly reportCsvUrl = "http://44.250.217.203:4001/api/reports/export-to-csv/";
// }

// export const appConfig = new DevAppConfig();
// export const appConfig = new ProdAppConfig();

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

class AppConfig {
    public readonly registerUrl = `${BASE_URL}/api/register/`;
    public readonly loginUrl = `${BASE_URL}/api/login/`;
    public readonly vacationsUrl = `${BASE_URL}/api/vacations/`;
    public readonly singleVacationUrl = `${BASE_URL}/api/vacations/single/`;
    public readonly activeVacationUrl = `${BASE_URL}/api/vacations/active/`;
    public readonly futureVacationUrl = `${BASE_URL}/api/vacations/future/`;
    public readonly likedVacationByUserUrl = `${BASE_URL}/api/vacations/liked-vacations-by-user/`;
    public readonly vacationImageUrl = `${BASE_URL}/api/vacations/images/`;
    public readonly likeUrl = `${BASE_URL}/api/likes/`;
    public readonly reportUrl = `${BASE_URL}/api/reports/count-vacations-likes/`;
    public readonly reportCsvUrl = `${BASE_URL}/api/reports/export-to-csv/`;
}

export const appConfig = new AppConfig();


