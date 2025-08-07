import cors from 'cors';
import express, { Request } from 'express';
import fileUpload from 'express-fileupload';
import rateLimit from "express-rate-limit";
import helmet from 'helmet';
import path from 'path';
import requestIp from "request-ip";
import { fileSaver } from 'uploaded-file-saver';
import { appConfig } from './2-utils/app-config';
import { dal } from './2-utils/dal';
import { userController } from './5-controllers/user-controller';
import { errorMiddleware } from './6-middleware/error-middleware';
import { securityMiddleware } from './6-middleware/security-middleware';
import { vacationController } from './5-controllers/vacation-controller';
import { likeController } from './5-controllers/like-controller';
import { reportController } from './5-controllers/report-controller';

class App {

    // Create application server:
    public readonly server = express();

    public async start(): Promise<void> {

        console.log("App starting...");

        // Prevent DOS attacks:
        this.server.use(rateLimit({
            windowMs: 1000,
            limit: 100,
            skip: (request: Request) => request.originalUrl.startsWith("/api/vacations/images/") // Don't block images
        }));

        // Prevent header request attacks:
        this.server.use(helmet({
            contentSecurityPolicy: false
        }));

        // Enable CORS for our frontend:
        this.server.use(cors()); // Enabling any frontend address.

        // Create request.body from the given body json:
        this.server.use(express.json());

        // Tell express to create request.files object containing uploaded files: 
        this.server.use(fileUpload());

        // Prevent XSS attacks (Put after express.json() ):
        this.server.use(securityMiddleware.preventXssAttack);

        // Middleware for client IP address
        this.server.use(requestIp.mw());

        // Health check endpoint for Render:
        this.server.get("/", (_req, res) => {res.status(200).send("Shoval Tours API is alive")});
        this.server.get("/health", (_req, res) => {res.status(200).json({ ok: true })});
        this.server.get("/healthz", (_req, res) => { res.status(200).send("OK")});

        // Tell upload-file-saver library where is the default images folder:
        fileSaver.config(path.join(__dirname, "1-assets", "images"));

        this.server.use("/", userController.router);
        this.server.use("/", vacationController.router);
        this.server.use("/", likeController.router);
        this.server.use("/", reportController.router);

        // Register error middleware:
        this.server.use(errorMiddleware.routeNotFound);

        this.server.use(errorMiddleware.catchAll);

        await dal.connect(); // Connect to MongoDB

        // Run server on HTTP port 4000:
        const port = process.env.PORT || 4000;
        console.log("Listening on port:", port);

        this.server.listen(port, () => { console.log("Listening on http://localhost:" + port) });

        // this.server.listen(appConfig.port, () => console.log("Listening on http://localhost:" + appConfig.port));
    }
}

export const app = new App();
app.start();

