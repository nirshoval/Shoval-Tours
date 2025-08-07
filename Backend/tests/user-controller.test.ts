import { expect } from "chai";
import { before, describe } from "mocha";
import supertest from "supertest";
import { app } from "../src/app";
import { UserModel } from "../src/3-models/user-model";

describe("Testing UserController", () => {

    const newUser = {
        firstName: "Test",
        lastName: "User",
        email: "testuser@example.com",
        password: "123456"
    };

    let token: string;

    before(async () => {
        const response = await supertest(app.server).post("/api/users").send(newUser);
        token = response.body;
    });

    after(async () => {
        await UserModel.deleteOne({ email: newUser.email });
    });

    it("should register a new user and return token", async () => {
        const response = await supertest(app.server)
            .post("/api/register")
            .send(newUser);

        expect(response.status).to.equal(201);
        expect(response.body).to.be.a("string");
    });

    it("should not allow duplicate registration", async () => {
        const response = await supertest(app.server)
            .post("/api/register")
            .send(newUser);

        console.log("DUPLICATE RESPONSE:", response.body);

        expect(response.status).to.not.equal(201);
        expect(response.body.error).to.include("exists");
    });


    it("should login with correct credentials and return token", async () => {
        const response = await supertest(app.server)
            .post("/api/login")
            .send({
                email: newUser.email,
                password: newUser.password
            });

        expect(response.status).to.equal(200);
        expect(response.body).to.be.a("string");
    });

    it("should fail login with wrong password", async () => {
        const response = await supertest(app.server)
            .post("/api/login")
            .send({
                email: newUser.email,
                password: "wrong-password"
            });

        console.log("wrong password:", response.body);

        expect(response.status).to.not.equal(200);
        expect(response.body.error).to.include("Incorrect");
    });

});