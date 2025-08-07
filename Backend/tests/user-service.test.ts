import { describe, it, before } from "mocha";
import { expect } from "chai";
import mongoose from "mongoose";
import { userService } from "../src/4-services/user-service";
import { UserModel } from "../src/3-models/user-model";
import { ClientError } from "../src/3-models/client-error";
import { CredentialsModel } from "../src/3-models/credentials-model";
import { RegisterModel } from "../src/3-models/register-model";

describe("Testing UserService", () => {

    const testEmail = "testuser@example.com";
    const testPassword = "123456";

    before(async () => {

        if (mongoose.connection.readyState === 0) {
            await mongoose.connect("mongodb://localhost:27017/vacations");
        }

        await UserModel.deleteOne({ email: testEmail });
    });

    after(async () => {
        await UserModel.deleteOne({ email: testEmail });
    });

    it("should register a new user and return a token", async () => {
        const user = new RegisterModel({
            firstName: "Test",
            lastName: "User",
            email: testEmail,
            password: testPassword
        });

        const token = await userService.register(user);
        expect(token).to.be.a("string").with.length.greaterThan(10);
    });

    it("should not allow registering with existing email", async () => {
        const duplicateUser = new RegisterModel({
            firstName: "Test",
            lastName: "User",
            email: testEmail,
            password: testPassword
        });

        try {
            await userService.register(duplicateUser);
            expect.fail("Expected conflict error not thrown");
        } catch (err: any) {
            expect(err).to.be.instanceOf(ClientError);
            expect(err.status).to.be.oneOf([400, 409]);
        }
    });

    it("should login successfully with correct credentials", async () => {
        const credentials = new CredentialsModel({ email: testEmail, password: testPassword });
        const token = await userService.login(credentials);
        expect(token).to.be.a("string").with.length.greaterThan(10);
    });

    it("should not login with wrong password", async () => {
        const credentials = new CredentialsModel({ email: testEmail, password: "wrongpass" });
        try {
            await userService.login(credentials);
            expect.fail("Expected unauthorized error not thrown");
        } catch (err: any) {
            expect(err).to.be.instanceOf(ClientError);
            expect(err.status).to.equal(401);
        }
    });

});
