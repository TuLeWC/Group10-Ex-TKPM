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

chai.use(chaiHttp);
const { expect } = chai;

let facultyId;
let programId;
let idDocumentId;
let studentStatusId;

describe('Business Rules', () => {
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

    describe('POST /api/students', () => {
        it('should return 400 for invalid email domain', async () => {
            const studentData = {
                studentId: '123457',
                fullName: 'Nguyen Van B',
                email: 'invalidemail@gmail.com', // Invalid domain
                phoneNumber: '012345678',
                faculty: facultyId,
                program: programId,
                studentStatus: studentStatusId,
                dateOfBirth: '2000-01-01',
                gender: 'Nam',
                addresses: {
                    permanent: {
                        houseNumber: '123',
                        street: 'Le Loi',
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

            const res = await chai.request(app).post('/api/students').send(studentData);

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message').that.includes('Email không thuộc tên miền được phép');
        });

        it('should return 400 for invalid phone number', async () => {
            const studentData = {
                studentId: '123458',
                fullName: 'Nguyen Van C',
                phoneNumber: '12345', // Invalid phone number
                email: 'nguyenvanc@student.edu.vn',
                faculty: facultyId,
                program: programId,
                studentStatus: studentStatusId,
                dateOfBirth: '2000-01-01',
                gender: 'Nam',
                addresses: {
                    permanent: {
                        houseNumber: '123',
                        street: 'Le Loi',
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

            const res = await chai.request(app).post('/api/students').send(studentData);

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message').that.includes('Số điện thoại không có định dạng hợp lệ');
        });
    });  
});