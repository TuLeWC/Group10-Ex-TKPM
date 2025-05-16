import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import Program from '../models/Program.js';
import IDDocument from '../models/IDDocument.js';
import StudentStatus from '../models/StudentStatus.js';
import { connectInMemoryDB, disconnectInMemoryDB } from './setupTestDB_2.js';
import { seedTestData } from './setupTestData.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

chai.use(chaiHttp);
const { expect } = chai;

let facultyId;
let programId;
let idDocumentId;
let studentStatusId;

describe('Import/Export API', () => {
    before(async () => {
        await connectInMemoryDB();
        await seedTestData();
    });

    beforeEach(async () => {
        // Clear data before each test
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
            const csvPath = path.join(__dirname, 'data', 'students.csv');
            const csvContent = fs.readFileSync(csvPath, 'utf8');
            
            const res = await chai
                .request(app)
                .post('/api/students/import/csv')
                .attach('file', csvPath, {
                    filename: 'students.csv',
                    contentType: 'text/csv'
                });

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Imported successfully');
        });

        it('should return 400 for invalid CSV file', async () => {
            const csvPath = path.join(__dirname, 'data', 'invalid.csv');
            const csvContent = fs.readFileSync(csvPath, 'utf8');
            
            const res = await chai
                .request(app)
                .post('/api/students/import/csv')
                .attach('file', csvPath, {
                    filename: 'invalid.csv',
                    contentType: 'text/csv'
                });

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message').that.includes('Invalid data');
        });
    });

    describe('GET /api/students/export/csv', () => {
        it('should export students to a CSV file', async () => {
            // Create a test student first
            const studentData = {
                studentId: '123456',
                fullName: 'Nguyen Van A',
                dateOfBirth: '2000-01-01',
                gender: 'Nam',
                faculty: facultyId,
                program: programId,
                email: 'nguyenvana@student.edu.vn',
                phoneNumber: '+84912345678',
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
                idDocument: idDocumentId,
                studentStatus: studentStatusId,
                nationality: 'Vietnam',
            };

            await Student.create(studentData);

            const res = await chai.request(app).get('/api/students/export/csv');

            expect(res).to.have.status(200);
            expect(res.header['content-type']).to.include('text/csv');
        });
    });
});