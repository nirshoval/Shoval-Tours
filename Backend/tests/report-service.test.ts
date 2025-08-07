import { describe, it, before, after } from "mocha";
import { expect } from "chai";
import mongoose, { ObjectId } from "mongoose";
import path from "path";
import supertest from "supertest";
import { app } from "../src/app";
import { reportService } from "../src/4-services/report-service";
import { LikeModel } from "../src/3-models/like-model";

describe("Testing ReportService", () => {

    let vacationId: ObjectId;
    let token: string;

    before(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect("mongodb://localhost:27017/vacations");
        }

        const credentials = { email: "nirshoval2@gmail.com", password: "12345" };
        const login = await supertest(app.server)
            .post("/api/login")
            .send(credentials);
        token = login.body.token || login.body;

        const imagePath = path.join(__dirname, "resources", "israel.jpg");
        const addVacation = await supertest(app.server)
            .post("/api/vacations")
            .auth(token, { type: "bearer" })
            .field("destination", "Report Test")
            .field("description", "For report testing")
            .field("startDate", new Date().toISOString())
            .field("endDate", new Date(Date.now() + 86400000).toISOString())
            .field("price", "123")
            .attach("image", imagePath);

        vacationId = addVacation.body._id;

        await LikeModel.create({
            userId: new mongoose.Types.ObjectId(),
            vacationId: vacationId
        });
    });

    after(async () => {
        await LikeModel.deleteMany({ vacationId });
        await supertest(app.server)
            .delete(`/api/vacations/${vacationId}`)
            .auth(token, { type: "bearer" });
    });

    it("should return likes count report in JSON format", async () => {
        const report = await reportService.getLikesCountForAllVacations();
        expect(report).to.be.an("array");
        const record = report.find(r => r.destination === "Report Test");
        expect(record).to.include.keys("destination", "likesCount");
        expect(record.likesCount).to.be.a("number").and.greaterThanOrEqual(1);
    });

    it("should return likes count report in CSV format", async () => {
        const csv = await reportService.getLikesCountForAllVacationToCsv();
        expect(csv).to.be.a("string");
        expect(csv).to.include("Destination");
        expect(csv).to.include("Report Test");
    });

});
