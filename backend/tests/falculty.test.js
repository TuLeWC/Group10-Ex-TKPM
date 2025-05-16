import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import Program from '../models/Program.js';
import IDDocument from '../models/IDDocument.js';
import StudentStatus from '../models/StudentStatus.js';
import { connectInMemoryDB, disconnectInMemoryDB } from './setupTestDB.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Faculty API', () => {
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

    // Helper: Faculty data builder
    function buildFacultyData(overrides = {}) {
        return {
            name: 'Khoa Công Nghệ Thông Tin',
            ...overrides,
        };
    }

    describe('POST /api/faculties', () => {
        it('should create a new faculty', async () => {
            const facultyData = buildFacultyData();
            const res = await chai.request(app).post('/api/faculties').send(facultyData);

            expect(res).to.have.status(201);
            expect(res.body).to.have.property('name', facultyData.name);
        });

        it('should not create a faculty with duplicate name (case-insensitive)', async () => {
            const faculty1 = buildFacultyData({ name: 'Khoa Luật' });
            const faculty2 = buildFacultyData({ name: 'khoa luật' }); // Lowercase duplicate

            await chai.request(app).post('/api/faculties').send(faculty1);
            const res = await chai.request(app).post('/api/faculties').send(faculty2);

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message', 'Tên khoa đã tồn tại');
        });

        it('should not create a faculty with empty name', async () => {
            const facultyData = buildFacultyData({ name: '' });
            const res = await chai.request(app).post('/api/faculties').send(facultyData);

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message', 'Tên khoa không được để trống');
        });

        it('should not create a faculty with whitespace-only name', async () => {
            const facultyData = buildFacultyData({ name: '   ' });
            const res = await chai.request(app).post('/api/faculties').send(facultyData);

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message', 'Tên khoa không được để trống');
        });

        it('should trim whitespace from name', async () => {
            const facultyData = buildFacultyData({ name: '  Khoa Toán  ' });
            const res = await chai.request(app).post('/api/faculties').send(facultyData);

            expect(res).to.have.status(201);
            expect(res.body).to.have.property('name', 'Khoa Toán');
        });
    });

    describe('PUT /api/faculties/:id', () => {
        it('should update an existing faculty', async () => {
            const faculty = await Faculty.create({ name: 'Khoa Kinh Tế' });
            const updatedData = { name: 'Khoa Kinh Tế Quốc Tế' };
            const res = await chai.request(app).put(`/api/faculties/${faculty._id}`).send(updatedData);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', updatedData.name);
        });

        it('should not update to a duplicate name', async () => {
            const facultyA = await Faculty.create({ name: 'Khoa Luật' });
            const facultyB = await Faculty.create({ name: 'Khoa Kinh Tế' });
            const res = await chai.request(app).put(`/api/faculties/${facultyB._id}`).send({ name: 'Khoa Luật' });

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message', 'Tên khoa đã tồn tại');
        });

        it('should return 404 if faculty does not exist', async () => {
            const res = await chai.request(app).put('/api/faculties/605c72ef1c4ae72f4c8b4569').send({ name: 'Non-existent Faculty' });

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message', 'Faculty not found');
        });
    });

    describe('DELETE /api/faculties/:id', () => {
        it('should delete an existing faculty', async () => {
            const faculty = await Faculty.create({ name: 'Khoa Du Lịch' });
            const res = await chai.request(app).delete(`/api/faculties/${faculty._id}`);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Faculty deleted successfully');
        });

        it('should return 404 if faculty does not exist', async () => {
            const res = await chai.request(app).delete('/api/faculties/605c72ef1c4ae72f4c8b4569');

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message', 'Faculty not found');
        });
    });
});