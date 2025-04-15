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

describe('Student Management API', () => {
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

    describe('POST /api/students', () => {
        it('should create a new student', async () => {
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

            const res = await chai.request(app).post('/api/students').send(studentData);

            expect(res).to.have.status(201);
            expect(res.body).to.have.property('studentId', '123456');
            expect(res.body).to.have.property('fullName', 'Nguyen Van A');
        });

        it('should not create a student with duplicate studentId', async () => {
            const student1 = {
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

            await chai.request(app).post('/api/students').send(student1);

            const student2 = {
                studentId: '123456',
                fullName: 'Nguyen Van A',
                dateOfBirth: '2000-01-01',
                gender: 'Nam',
                faculty: facultyId,
                program: programId,
                email: 'nguyenvanb@student.edu.vn',
                phoneNumber: '+8412345678',
                addresses: {
                    permanent: {
                        houseNumber: '123',
                        street: 'Main St',
                        district: 'District 1',
                        city: 'HCMC',
                        country: 'Vietnam',
                    },
                    temporary: {
                        houseNumber: '456',
                        street: 'Second St',
                        district: 'District 1',
                        city: 'HCMC',
                        country: 'Vietnam',
                    },
                    mailing: {
                        houseNumber: '789',
                        street: 'Third St',
                        district: 'District 1',
                        city: 'HCMC',
                        country: 'Vietnam',
                    },
                },
                idDocument: {
                    type: 'CCCD',
                    idNumber: '748320954123',
                    issuedDate: '2015-08-20',
                    expiryDate: '2035-08-20',
                    issuedPlace: 'Cục quản lý xuất nhập cảnh',
                    hasChip: true,
                },
                studentStatus: studentStatusId,
                nationality: 'Vietnam',
            };

            const res = await chai.request(app).post('/api/students').send(student2);

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message', `E11000 duplicate key error collection: test.students index: studentId_1 dup key: { studentId: "${student2.studentId}" }`);
        });
    });

    describe('PUT /api/students/:id', () => {
        it('should update an existing student', async () => {
            const student = new Student({
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
                        street: 'Main St',
                        district: 'District 1',
                        city: 'HCMC',
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
            });
            await student.save();

            const updatedData = {
                studentId: '123456',
                dateOfBirth: '2000-01-01',
                gender: 'Nam',
                faculty: facultyId,
                program: programId,
                phoneNumber: '+84912345678',
                addresses: {
                    permanent: {
                        houseNumber: '123',
                        street: 'Main St',
                        district: 'District 1',
                        city: 'HCMC',
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
                // idDocument: idDocument._id,
                studentStatus: studentStatusId,
                nationality: 'Vietnam',
                fullName: 'Nguyen Van B',
                email: 'nguyenvanb@student.edu.vn',
            };

            const res = await chai.request(app).put(`/api/students/${student.studentId}`).send(updatedData);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('fullName', 'Nguyen Van B');
            expect(res.body).to.have.property('email', 'nguyenvanb@student.edu.vn');
        });

        it('should return 404 if student does not exist', async () => {
            const updatedData = {
                dateOfBirth: '2000-01-01',
                gender: 'Nam',
                faculty: facultyId,
                program: programId,
                phoneNumber: '+84912345678',
                addresses: {
                    permanent: {
                        houseNumber: '123',
                        street: 'Main St',
                        district: 'District 1',
                        city: 'HCMC',
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
                // idDocument: idDocument._id,
                studentStatus: studentStatusId,
                nationality: 'Vietnam',
                fullName: 'Nguyen Van C',
                email: 'nguyenvanc@student.edu.vn',
            };
            const res = await chai.request(app).put('/api/students/999999').send(updatedData);

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message', 'Student not found');
        });
    });

    describe('DELETE /api/students/:id', () => {
        it('should delete an existing student', async () => {
            const idDocument = await IDDocument.create({
                type: 'CCCD',
                idNumber: '123456789015',
                issuedDate: '2015-06-20',
                expiryDate: '2035-06-20',
                issuedPlace: 'Cục quản lý xuất nhập cảnh',
                hasChip: true,
            });
            const student = new Student({
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
                        street: 'Main St',
                        district: 'District 1',
                        city: 'HCMC',
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
                idDocument: idDocument._id,
                studentStatus: studentStatusId,
                nationality: 'Vietnam',
            });
            await student.save();

            const res = await chai.request(app).delete(`/api/students/${student.studentId}`);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Student deleted');
        });

        it('should return 404 if student does not exist', async () => {
            const res = await chai.request(app).delete('/api/students/999999');

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message', 'Student not found');
        });
    });

    describe('GET /api/students', () => {
        it('should get all students', async () => {
            const idDocument1 = await IDDocument.create({
                type: 'CCCD',
                idNumber: '123456789015',
                issuedDate: '2015-06-20',
                expiryDate: '2035-06-20',
                issuedPlace: 'Cục quản lý xuất nhập cảnh',
                hasChip: true,
            });
            const idDocument2 = await IDDocument.create({
                type: 'CCCD',
                idNumber: '123456789016',
                issuedDate: '2015-08-20',
                expiryDate: '2035-08-20',
                issuedPlace: 'Cục quản lý xuất nhập cảnh',
                hasChip: true,
            });
            const student1 = new Student({
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
                        street: 'Main St',
                        district: 'District 1',
                        city: 'HCMC',
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
                idDocument: idDocument1._id,
                studentStatus: studentStatusId,
                nationality: 'Vietnam',
            });
            const student2 = new Student({
                studentId: '654321',
                fullName: 'Tran Van B',
                dateOfBirth: '1999-01-01',
                gender: 'Nam',
                faculty: facultyId,
                program: programId,
                email: 'tranvanb@student.edu.vn',
                phoneNumber: '+84987654321',
                addresses: {
                    permanent: {
                        houseNumber: '456',
                        street: 'Second St',
                        district: 'District 2',
                        city: 'HCMC',
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
                idDocument: idDocument2._id,
                studentStatus: studentStatusId,
                nationality: 'Vietnam',
            });
            await student1.save();
            await student2.save();

            const res = await chai.request(app).get('/api/students');

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf(2);
        });
    });
});


