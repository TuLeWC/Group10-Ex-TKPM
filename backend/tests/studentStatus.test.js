import chai from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";
import Student from "../models/Student.js";
import Faculty from "../models/Faculty.js";
import Program from "../models/Program.js";
import IDDocument from "../models/IDDocument.js";
import StudentStatus from "../models/StudentStatus.js";
import { connectInMemoryDB, disconnectInMemoryDB } from "./setupTestDB.js";

chai.use(chaiHttp);
const { expect } = chai;

describe("Student status API", () => {
  before(async () => {
    await connectInMemoryDB();
  });
  beforeEach(async () => {
    // Xoa du lieu truoc moi test
    await Student.deleteMany({});
    await Faculty.deleteMany({});
    await Program.deleteMany({});
    await IDDocument.deleteMany({});
    await StudentStatus.deleteMany({});
  });
  after(async () => {
    await disconnectInMemoryDB();
  });

  describe("POST /api/student-statuses", () => {
    
    /// Done.
    it("should create a new student status", async () => {
      const statusData = {
        status: "Đang học",
      };

      const res = await chai
        .request(app)
        .post("/api/student-statuses")
        .send(statusData);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("status", "Đang học");
    });
  });

  describe("PUT /api/student-statuses/:id", () => {
    /// Done.
    it("should update an existing student status", async () => {
      const status = await StudentStatus.create({ status: "Đang học" });

      const updatedData = { status: "Đã tốt nghiệp" };
      const res = await chai
        .request(app)
        .put(`/api/student-statuses/${status._id}`)
        .send(updatedData);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("status", "Đã tốt nghiệp");
    });

    /// Done.
    it("should not update a student status with student status with ID not found", async () => {
      const res = await chai
        .request(app)
        .put(`/api/student-statuses/67e56a259e34aa97f63263d4`)
        .send({ status: "Đã tốt nghiệp" });
      expect(res).to.have.status(404);
      expect(res.body)
        .to.have.property("message")
        .that.includes("Student status not found");
    });
  });

  describe("DELETE /api/student-statuses/:id", () => {
    /// Done.
    it("should delete an existing student status", async () => {
      const status = await StudentStatus.create({ status: "Đang học" });

      const res = await chai
        .request(app)
        .delete(`/api/student-statuses/${status._id}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property(
        "message",
        "Student status deleted successfully"
      );
    });

    /// Done.
    it("should not delete a student status with student status ID not found", async () => {
      const res = await chai
        .request(app)
        .del("/api/student-statuses/67e56a259e34aa97f63263d4");
      expect(res).to.have.status(404);
      expect(res.body)
        .to.have.property("message")
        .that.includes("Student status not found");
    });
  });

  describe("GET /api/student-statuses", () => {
    /// Done.
    it("should get all student statuses", async () => {
      const res = await chai.request(app).get("/api/student-statuses");
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
    });
  });
});
