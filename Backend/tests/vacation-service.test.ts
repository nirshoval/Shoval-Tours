import { describe, it, before } from "mocha";
import { expect } from "chai";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { vacationService } from "../src/4-services/vacation-service";
import { VacationModel, IVacationModel } from "../src/3-models/vacation-model";
import { ClientError } from "../src/3-models/client-error";
import supertest from "supertest";
import { app } from "../src/app";

const userId = new mongoose.Types.ObjectId().toHexString();

describe("Testing VacationService", () => {

    let token: string;
    let vacationId: string;
    let imageName: string = "";

    before(async () => {

        if (mongoose.connection.readyState === 0) {
            await mongoose.connect("mongodb://localhost:27017/vacations");
        }

        await VacationModel.deleteMany({ destination: "Test Destination" });

        const credentials = { email: "nirshoval2@gmail.com", password: "12345" };
        const login = await supertest(app.server)
            .post("/api/login")
            .send(credentials);
        token = login.body.token || login.body;

        const imagePath = path.join(__dirname, "resources", "israel.jpg");
        const addVacation = await supertest(app.server)
            .post("/api/vacations")
            .auth(token, { type: "bearer" })
            .field("destination", "Vacation Service Test")
            .field("description", "For Vacation Service testing")
            .field("startDate", new Date().toISOString())
            .field("endDate", new Date(Date.now() + 86400000).toISOString())
            .field("price", "123")
            .attach("image", imagePath);

        vacationId = addVacation.body._id;
    });

    after(async () => {
        await VacationModel.findByIdAndDelete(vacationId);

        if (imageName) {
            const imagePath = path.join(__dirname, "../src/1-assets/images", imageName);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
    });

    it("should get all vacations", async () => {
        const vacations = await vacationService.getAllVacations(userId);
        expect(vacations).to.be.an("array");
        const plainVacation = vacations[0];
        expect(plainVacation).to.include.all.keys( "_id", "destination", "description", "startDate", "endDate", "price", "imageName");
        expect(plainVacation).to.not.have.property("image");
    });

    it("should get one vacation by id", async () => {
        const vacation = await vacationService.getOneVacation(vacationId);
        expect(vacation.destination).to.equal("Vacation Service Test");
    });

    it("should throw error for non-existent vacation", async () => {
        try {
            await vacationService.getOneVacation(new mongoose.Types.ObjectId().toHexString());
            expect.fail("Expected error not thrown");
        } catch (err: any) {
            expect(err).to.be.instanceOf(ClientError);
            expect(err.status).to.equal(404);
        }
    });

    it("should throw validation error for invalid vacation", async () => {
        try {
            const invalid = new VacationModel({ destination: "" }) as IVacationModel;
            await vacationService.addVacation(invalid);
            expect.fail("Expected validation error");
        } catch (err: any) {
            expect(err).to.be.instanceOf(ClientError);
            expect(err.status).to.equal(400);
        }
    });

});
