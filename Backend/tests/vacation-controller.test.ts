import { after, before, describe } from "mocha";
import supertest from "supertest";
import path from "path";
import { app } from "../src/app";
import { expect } from "chai";
import { IVacationModel, VacationModel } from "../src/3-models/vacation-model";
import { StatusCode } from "../src/3-models/statusCode-model";

describe("Testing VacationController", () => {

    let token: string;
    let createdVacationId: string;

    before(async () => {
        const credentials = { email: "nirshoval2@gmail.com", password: "12345" };
        const response = await supertest(app.server).post("/api/login").send(credentials);
        token = response.body;

        const imagePath = path.join(__dirname, "resources", "israel.jpg");
        const vacationResponse = await supertest(app.server)
            .post("/api/vacations")
            .auth(token, { type: "bearer" })
            .field("destination", "Vacation Controller Test")
            .field("description", "Vacation Controller Test")
            .field("startDate", new Date("2025-07-01").toISOString())
            .field("endDate", new Date("2025-07-10").toISOString())
            .field("price", 2000)
            .attach("image", imagePath);

        createdVacationId = vacationResponse.body._id;
    });

    after(async () => {
        await VacationModel.deleteMany({ destination: "Vacation Controller Test" });
        if (createdVacationId) {
            await supertest(app.server)
                .delete(`/api/vacations/${createdVacationId}`)
                .auth(token, { type: "bearer" });
        }
    });

    it("should return vacations array", async () => {

        const userId = "687b6da7294a1a5d8e96f78f";

        const response = await supertest(app.server)
            .get("/api/vacations/" + userId)
            .auth(token, { type: "bearer" });

        expect(response.status).to.equal(200);

        const vacations: IVacationModel[] = response.body;
        expect(vacations.length).to.be.greaterThanOrEqual(1);
        expect(vacations[0]).to.contain.keys("_id", "destination", "description", "startDate", "endDate", "price", "imageName");
    });

    it("should return one vacation", async () => {
        const vacationId = "6815f0e1fe84794852e360fe";

        const response = await supertest(app.server)
            .get("/api/vacations/single/" + vacationId)
            .auth(token, { type: "bearer" });

        expect(response.status).to.equal(200);

        const vacation: IVacationModel = response.body;
        expect(vacation).to.contain.keys("_id", "destination", "description", "startDate", "endDate", "price", "imageName");
    });

    it("should add new vacation", async () => {
        const vacation = {
            destination: "Vacation Controller Test",
            description: "Vacation Controller Test",
            startDate: new Date("2025-07-01"),
            endDate: new Date("2025-07-10"),
            price: 2000,
            image: null,
            imageName: "israel.jpg",
        };

        const imagePath = path.join(__dirname, "resources", "israel.jpg");
        const response = await supertest(app.server)
            .post("/api/vacations")
            .auth(token, { type: "bearer" })
            .field("destination", vacation.destination)
            .field("description", vacation.description)
            .field("startDate", vacation.startDate.toISOString())
            .field("endDate", vacation.endDate.toISOString())
            .field("price", vacation.price)
            .field("imageName", vacation.imageName)
            .attach("image", imagePath);

        expect(response.status).to.equal(201);
        const dbVacation: IVacationModel = response.body;
        expect(dbVacation).to.not.be.empty;
        expect(dbVacation).to.contain.keys("_id", "destination", "description", "startDate", "endDate", "price", "imageName");
    });

    it("should update vacation", async () => {
        const vacationId = createdVacationId;
        const updatedVacation = {
            _id: vacationId,
            destination: "Paris, France",
            description: "Explore the city of lights and romance",
            startDate: new Date("2025-08-01"),
            endDate: new Date("2025-08-10"),
            price: 2500,
            imageName: "bdbd9e33-18e2-46a2-a787-48bf293b41df.jpg",
        };

        const response = await supertest(app.server)
            .put("/api/vacations/" + vacationId)
            .auth(token, { type: "bearer" })
            .send(updatedVacation);

        expect(response.status).to.equal(200);
        const dbVacation: IVacationModel = response.body;
        expect(dbVacation).to.contain.keys("_id", "destination", "description", "startDate", "endDate", "price", "imageName");
    });

    it("should delete vacation", async () => {
        const vacationId = createdVacationId;

        const response = await supertest(app.server)
            .delete(`/api/vacations/${vacationId}`)
            .auth(token, { type: "bearer" });

        expect(response.status).to.equal(204);
    });

    it("should return 404 error on route not found", async () => {
        const response = await supertest(app.server).get("/api/nothing-here");
        expect(response.status).to.equal(StatusCode.NotFound);
    });

    it("should return 404 error on resource not found", async () => {
        const response = await supertest(app.server).get("/api/vacations/single/10000000");
        expect(response.status).to.equal(StatusCode.NotFound);
    });

});
