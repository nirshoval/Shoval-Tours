import { describe, it, before } from "mocha";
import { expect } from "chai";
import mongoose, { Types } from "mongoose";
import { LikeModel } from "../src/3-models/like-model";
import { VacationModel } from "../src/3-models/vacation-model";
import { UserModel } from "../src/3-models/user-model";
import { likeService } from "../src/4-services/like-service";
import { ClientError } from "../src/3-models/client-error";

describe("Testing likeService", () => {

    const testEmail = "liketest@example.com";
    const testPassword = "123456";
    let userId: Types.ObjectId;
    let vacationId: Types.ObjectId;

    before(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect("mongodb://localhost:27017/vacations");
        }

        await UserModel.deleteOne({ email: testEmail });
        await VacationModel.deleteOne({ destination: "Like Test" });

        const user = new UserModel({
            firstName: "Test",
            lastName: "User",
            email: testEmail,
            password: testPassword
        });
        const savedUser = await user.save();
        userId = savedUser._id as Types.ObjectId;

        const vacation = new VacationModel({
            destination: "Like Test",
            description: "Test like feature",
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000),
            price: 1000,
            imageName: "test.jpg"
        });
        const savedVacation = await vacation.save();
        vacationId = savedVacation._id as Types.ObjectId;

        await LikeModel.deleteMany({ userId });
    });

    after(async () => {
        await LikeModel.deleteMany({ userId });
        await VacationModel.deleteOne({ _id: vacationId });
        await UserModel.deleteOne({ _id: userId });
    });

    it("should like a vacation successfully", async () => {
        const likeDocument = new LikeModel({ userId, vacationId });
        const like = await likeService.likeVacation(likeDocument);

        expect(like).to.have.property('_id');
        expect(like).to.have.property('userId');
        expect(like).to.have.property('vacationId');
        expect(like.userId.toString()).to.equal(userId.toString());
        expect(like.vacationId.toString()).to.equal(vacationId.toString());
    });

    it("should not allow liking the same vacation twice", async () => {
        try {
            const likeDocument = new LikeModel({ userId, vacationId });
            await likeService.likeVacation(likeDocument);
            expect.fail("Expected conflict error not thrown");
        } catch (err: any) {
            expect(err).to.be.instanceOf(ClientError);
            expect(err.status).to.equal(409);
            expect(err.message.toLowerCase()).to.include("already liked");
        }
    });

    it("should unlike a vacation successfully", async () => {
        await likeService.unlikeVacation(userId.toHexString(), vacationId.toHexString());
        const deletedLike = await LikeModel.findOne({ userId, vacationId });
        expect(deletedLike).to.be.null;
    });

    it("should throw error when unliking a vacation that wasn't liked", async () => {
        try {
            await likeService.unlikeVacation(userId.toHexString(), vacationId.toHexString());
            expect.fail("Expected 404 error not thrown");
        } catch (err: any) {
            expect(err).to.be.instanceOf(ClientError);
            expect(err.status).to.equal(404);
            expect(err.message.toLowerCase()).to.include("failed to unlike");
        }
    });
});