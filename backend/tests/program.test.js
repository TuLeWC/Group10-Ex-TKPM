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

describe("Program API", () => {
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

  describe("POST /api/programs", () => {
    it("should create a new program", async () => {
      const programData = { name: "Đại trà" };

      const res = await chai
        .request(app)
        .post("/api/programs")
        .send(programData);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("name", "Đại trà");
    });

    it("should not create a program with duplicate name", async () => {
      const program1 = { name: "Chất lượng cao" }; // Already created in beforeEach()
      const program2 = { name: "Chất lượng cao" }; // Duplicate name

      await chai.request(app).post("/api/programs").send(program1); // Create the first program
      const res = await chai.request(app).post("/api/programs").send(program2);

      expect(res).to.have.status(400);
      expect(res.body)
        .to.have.property("message")
        .that.includes("Program already exists");
    });
  });

  describe("GET /api/programs", () => {
    it("should return all programs", async () => {
      const res = await chai.request(app).get("/api/programs");

      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
    });
  });

  describe("PUT /api/programs/:id", () => {
    it("should update program name of an existing program", async () => {
      const program = await Program.create({ name: "Tiên tiến" });

      const updatedData = { name: "Chất lượng cao" };
      const res = await chai
        .request(app)
        .put(`/api/programs/${program._id}`)
        .send(updatedData);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("name", "Chất lượng cao");
    });

    it("should not update program when program not found", async () => {
      const res = await chai
        .request(app)
        .put(`/api/programs/67e56a259e34aa97D63263d8`)
        .send({
          name: "Chất lượng cao",
        });

      expect(res).to.have.status(404);
      expect(res.body)
        .to.have.property("message")
        .that.includes("Program not found");
    });
  });

  describe("DELETE /api/programs/:id", () => {
    it("should delete an existing program", async () => {
      const program = await Program.create({ name: "Đại trà" });

      const res = await chai
        .request(app)
        .delete(`/api/programs/${program._id}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property(
        "message",
        "Program deleted successfully"
      );
    });

    it("should return 404 for non-existing program", async () => {
      const res = await chai
        .request(app)
        .delete("/api/programs/67e56a259e34aa97D63263d8"); // Non-existing ID

      expect(res).to.have.status(404);
      expect(res.body).to.have.property("message", "Program not found");
    });
  });
});
