import { describe } from "mocha";
import supertest from "supertest";
import { app } from "../src/app";
import { expect } from "chai";
import { LikeModel } from "../src/3-models/like-model";


describe("Testing LikeController", () => {

    const user = {
        email: "guy@gmail.com",
        password: "12345"
    };

    let token: string;
    let vacationId: string = "732dc54daf7e44d8a09477af";
    let userId: string

    before(async () => {
        const response = await supertest(app.server).post("/api/login").send(user);

        token = response.body;

        const payloadBase64 = token.split(".")[1];
        const payload = JSON.parse(Buffer.from(payloadBase64, "base64").toString());
        userId = payload.user._id
    });

    after(async () => {
        await LikeModel.deleteOne({ userId, vacationId });
    });

    it("should successfully like a vacation", async () => {
        const response = await supertest(app.server)
            .post("/api/likes/")
            .auth(token, { type: "bearer" })
            .send({ userId, vacationId });

        expect(response.status).to.equal(201);
        expect(response.body).to.include.keys("_id", "userId", "vacationId");
    });

    it("should not like the same vacation twice (if service blocks it)", async () => {
        const response = await supertest(app.server)
            .post("/api/likes/")
            .auth(token, { type: "bearer" })
            .send({ userId, vacationId });

        expect(response.status).to.be.oneOf([400, 409]);
        expect(response.body.message || response.body.error).to.include("already liked");
    });

    it("should unlike a vacation", async () => {
        const response = await supertest(app.server)
            .delete(`/api/likes/${userId}/${vacationId}`)
            .auth(token, { type: "bearer" });

        expect(response.status).to.equal(204);
    });


});