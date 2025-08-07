import dotenv from "dotenv"; // npm i dotenv

// Loads .env file into process.env
dotenv.config();

class AppConfig {
    
    public readonly isDevelopment = process.env.ENVIRONMENT === "development";
    public readonly isProduction = process.env.ENVIRONMENT === "production";
    public readonly port = process.env.PORT;
    public readonly mongodbConnectionString = process.env.MONGO_CONNECTION_STRING;
    public readonly imagesUrl = process.env.IMAGES_URL;
    public readonly hashSalt = process.env.HASH_SALT;
    public readonly jwtSecret = process.env.JWT_SECRET;
    
}

export const appConfig = new AppConfig();