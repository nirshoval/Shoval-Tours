class DevAppConfig {

    //  Without Docker:
        public readonly registerUrl = "http://localhost:4000/api/register/";
        public readonly loginUrl = "http://localhost:4000/api/login/";

        public readonly vacationsUrl = "http://localhost:4000/api/vacations/";
        public readonly singleVacationUrl = "http://localhost:4000/api/vacations/single/";
        public readonly activeVacationUrl = "http://localhost:4000/api/vacations/active/";
        public readonly futureVacationUrl = "http://localhost:4000/api/vacations/future/";
        public readonly likedVacationByUserUrl = "http://localhost:4000/api/vacations/liked-vacations-by-user/";
        public readonly vacationImageUrl = "http://localhost:4000/api/vacations/images/";

        public readonly likeUrl = "http://localhost:4000/api/likes/";

        public readonly reportUrl = "http://localhost:4000/api/reports/count-vacations-likes/";
        public readonly reportCsvUrl = "http://localhost:4000/api/reports/export-to-csv/";
}

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

export const appConfig = new DevAppConfig();
// export const appConfig = new ProdAppConfig();

