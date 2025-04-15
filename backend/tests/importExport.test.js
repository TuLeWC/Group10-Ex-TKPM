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

let facultyId;
let programId;
let idDocumentId;
let studentStatusId;

describe('Import/Export API', () => {
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

        const faculty = await Faculty.create({ name: 'Khoa Luật' });
        const program = await Program.create({ name: 'Chương trình A' });
        const idDocument = await IDDocument.create({
            type: 'CCCD',
            idNumber: `123456789011`,
            issuedDate: '2015-06-20',
            expiryDate: '2035-06-20',
            issuedPlace: 'Cục quản lý xuất nhập cảnh',
            hasChip: true,
        });

        const studentStatus = await StudentStatus.create({ name: 'Active', status: 'active' });
        studentStatusId = studentStatus._id;

        facultyId = faculty._id;
        programId = program._id;
        idDocumentId = idDocument._id;
    });

    after(async () => {
        await disconnectInMemoryDB();
    });

    describe('POST /api/students/import/csv', () => {
        it('should import students from a valid CSV file', async () => {
            const res = await chai
                .request(app)
                .post('/api/students/import/csv')
                .attach('file', 'path/to/students.csv');

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Imported successfully');
        });

        it('should return 400 for invalid CSV file', async () => {
            const res = await chai
                .request(app)
                .post('/api/students/import/csv')
                .attach('file', 'path/to/invalid.csv');

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message').that.includes('Invalid data');
        });
    });

    describe('GET /api/students/export/csv', () => {
        it('should export students to a CSV file', async () => {
            const studentData = {
                studentId: '123456',
                fullName: 'Nguyen Van A',
                dateOfBirth: '2000-01-01',
                gender: 'Nam',
                faculty: facultyId,
                program: programId,
                email: 'nguyenvana@student.edu.vn',
                phoneNumber: '012345678',
                addresses: {
                    permanent: {
                        houseNumber: '123',
                        street: 'Le Loi',
                        district: 'District 1',
                        city: 'Ho Chi Minh City',
                        country: 'Vietnam',
                    },
                    temporary: {
                        houseNumber: '456',
                        street: 'Nguyen Hue',
                        district: 'District 1',
                        city: 'Ho Chi Minh City',
                        country: 'Vietnam',
                    },
                    mailing: {
                        houseNumber: '789',
                        street: 'Pham Ngu Lao',
                        district: 'District 1',
                        city: 'Ho Chi Minh City',
                        country: 'Vietnam',
                    },
                },
                idDocument: {
                    type: 'CCCD',
                    idNumber: '123456789013',
                    issuedDate: '2015-06-20',
                    expiryDate: '2035-06-20',
                    issuedPlace: 'Cục quản lý xuất nhập cảnh',
                    hasChip: true,
                },
                studentStatus: studentStatusId,
                nationality: 'Vietnam',
            };

            await chai.request(app).post('/api/students').send(studentData);

            const res = await chai.request(app).get('/api/students/export/csv');

            expect(res).to.have.status(200);
            expect(res.header['content-type']).to.include('text/csv');
        });
    });
});