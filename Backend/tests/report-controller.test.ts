import { describe, it, before } from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import { app } from "../src/app";

describe("Testing ReportController", () => {

    const admin = {
        email: "nirshoval2@gmail.com",
        password: "12345"
    };

    let token: string;

    before(async () => {
        const response = await supertest(app.server)
            .post("/api/login")
            .send(admin);

        token = response.body.token || response.body;

        expect(token).to.be.a("string");
    });

    it("should return likes count report in JSON format", async () => {
        const response = await supertest(app.server)
            .get("/api/reports/count-vacations-likes/")
            .auth(token, { type: "bearer" });

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an("array");

        if (response.body.length > 0) {
            expect(response.body[0]).to.include.keys("_id", "destination", "likesCount");
        }
    });

    it("should return likes count report in CSV format", async () => {
        const response = await supertest(app.server)
            .get("/api/reports/export-to-csv/")
            .auth(token, { type: "bearer" });

        expect(response.status).to.equal(200);
        expect(response.header["content-type"]).to.include("text/csv");
        expect(response.header["content-disposition"]).to.include("attachment");

        expect(response.text).to.include("Destination");
        expect(response.text).to.include("Likes");
    });

});
