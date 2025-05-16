import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import Program from '../models/Program.js';
import IDDocument from '../models/IDDocument.js';
import StudentStatus from '../models/StudentStatus.js';
import Course from '../models/Course.js';
import Class from '../models/Class.js';
import Enrollment from '../models/Enrollment.js';
import Semester from '../models/Semester.js';
import { connectInMemoryDB, disconnectInMemoryDB } from './setupTestDB.js';
import mongoose from 'mongoose';

chai.use(chaiHttp);
const { expect } = chai;

let testData;
let facultyId;
let programId;
let idDocumentId;
let studentStatusId;
let studentId;
let courseId;
let classId;
let semesterId;

describe('Enrollment API', () => {
    before(async () => {
        await connectInMemoryDB();
    });

    beforeEach(async () => {
        // Clear all collections
        await Student.deleteMany({});
        await Class.deleteMany({});
        await Course.deleteMany({});
        await Enrollment.deleteMany({});
        await Semester.deleteMany({});
        await Faculty.deleteMany({});

        // Create test data
        const faculty = await Faculty.create({ name: 'Test Faculty' });
        const semester = await Semester.create(buildSemesterData());
        const course = await Course.create(buildCourseData({ faculty: faculty._id }));
        const cls = await Class.create(buildClassData({ 
            course: course._id,
            semester: semester._id
        }));
        const student = await Student.create(buildStudentData({ faculty: faculty._id }));

        // Store test data for use in tests
        testData = {
            faculty,
            semester,
            course,
            class: cls,
            student
        };
    });

    after(async () => {
        await disconnectInMemoryDB();
    });

    describe('POST /api/enrollments', () => {
        it('should create a new enrollment', async () => {
            const res = await chai.request(app)
                .post('/api/enrollments')
                .send({
                    studentId: testData.student.studentId,
                    classId: testData.class.classId
                });

            expect(res).to.have.status(201);
            expect(res.body).to.have.property('student');
            expect(res.body).to.have.property('class');
            expect(res.body.status).to.equal('active');
        });

        it('should not create enrollment for non-existent student', async () => {
            const res = await chai.request(app)
                .post('/api/enrollments')
                .send({
                    studentId: 'NONEXISTENT',
                    classId: testData.class.classId
                });

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message', 'Student is not existed');
        });

        it('should not create enrollment for non-existent class', async () => {
            const res = await chai.request(app)
                .post('/api/enrollments')
                .send({
                    studentId: testData.student.studentId,
                    classId: 'NONEXISTENT'
                });

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message', 'Class is not existed');
        });

        it('should not create duplicate enrollment', async () => {
            // First enrollment
            await chai.request(app)
                .post('/api/enrollments')
                .send({
                    studentId: testData.student.studentId,
                    classId: testData.class.classId
                });

            // Try to create duplicate enrollment
            const res = await chai.request(app)
                .post('/api/enrollments')
                .send({
                    studentId: testData.student.studentId,
                    classId: testData.class.classId
                });

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message', 'Student is already enrolled in a class for this course');
        });

        it('should not create enrollment for full class', async () => {
            // Create a full class
            const fullClass = await Class.create(buildClassData({
                classId: 'FULL001',
                course: testData.course._id,
                semester: testData.semester._id,
                maximumCapacity: 1,
                currentCapacity: 1,
                status: 'active'
            }));

            const res = await chai.request(app)
                .post('/api/enrollments')
                .send({
                    studentId: testData.student.studentId,
                    classId: fullClass.classId
                });

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message', 'Class is full');
        });
    });

    describe('GET /api/enrollments/student/:studentId', () => {
        it('should get enrollments for a student', async () => {
            // Create an enrollment first
            await chai.request(app)
                .post('/api/enrollments')
                .send({
                    studentId: testData.student.studentId,
                    classId: testData.class.classId
                });

            const res = await chai.request(app)
                .get(`/api/enrollments/student/${testData.student.studentId}`);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body[0]).to.have.property('student');
            expect(res.body[0]).to.have.property('class');
        });

        it('should return 404 for non-existent student', async () => {
            const res = await chai.request(app)
                .get('/api/enrollments/student/NONEXISTENT');

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message', 'Student not existed');
        });

        it('should return 404 for student with no enrollments', async () => {
            const res = await chai.request(app)
                .get(`/api/enrollments/student/${testData.student.studentId}`);

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message', 'No enrollments found');
        });
    });

    describe('POST /api/enrollments/cancel', () => {
        it('should cancel an enrollment', async () => {
            // Create an enrollment first
            const enrollment = await Enrollment.create({
                student: testData.student._id,
                class: testData.class._id,
                status: 'active'
            });

            const res = await chai.request(app)
                .post('/api/enrollments/cancel')
                .send({
                    studentId: testData.student.studentId,
                    classId: testData.class.classId
                });

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Enrollment canceled successfully');
        });

        it('should not cancel non-existent enrollment', async () => {
            const res = await chai.request(app)
                .post('/api/enrollments/cancel')
                .send({
                    studentId: testData.student.studentId,
                    classId: testData.class.classId
                });

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message', 'No active enrollment found');
        });

        it('should not cancel enrollment after deadline', async () => {
            // Create a past semester
            const pastSemester = await Semester.create(buildSemesterData({
                semesterId: '2023-1',
                startDay: '01-09',
                endDay: '31-12',
                cancellationDeadline: '15-09'
            }));

            // Create a class in past semester
            const pastClass = await Class.create(buildClassData({
                classId: 'PAST001',
                course: testData.course._id,
                semester: pastSemester._id,
                academicYear: 2023
            }));

            // Create an enrollment
            await chai.request(app)
                .post('/api/enrollments')
                .send({
                    studentId: testData.student.studentId,
                    classId: pastClass.classId
                });

            const res = await chai.request(app)
                .post('/api/enrollments/cancel')
                .send({
                    studentId: testData.student.studentId,
                    classId: pastClass.classId
                });

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message', 'Cancellation deadline has passed');
        });
    });

    describe('PUT /api/enrollments/students/:studentId/classes/:classId/grades', () => {
        it('should update student grade', async () => {
            // Create an enrollment first
            await chai.request(app)
                .post('/api/enrollments')
                .send({
                    studentId: testData.student.studentId,
                    classId: testData.class.classId
                });

            const res = await chai.request(app)
                .put(`/api/enrollments/students/${testData.student.studentId}/classes/${testData.class.classId}/grades`)
                .send({ grade: 8.5 });

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message').that.includes('Grade updated successfully');
        });

        it('should not update grade for non-existent enrollment', async () => {
            const res = await chai.request(app)
                .put(`/api/enrollments/students/${testData.student.studentId}/classes/${testData.class.classId}/grade`)
                .send({ grade: 8.5 });

            expect(res).to.have.status(404);
            // expect(res.body).to.have.property('message', 'No active enrollment found');
        });

        it('should not update grade with invalid value', async () => {
            // Create an enrollment first
            await chai.request(app)
                .post('/api/enrollments')
                .send({
                    studentId: testData.student.studentId,
                    classId: testData.class.classId
                });

            const res = await chai.request(app)
                .put(`/api/enrollments/students/${testData.student.studentId}/classes/${testData.class.classId}/grades`)
                .send({ grade: 11 });

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message', 'Invalid grade value');
        });
    });

    describe('GET /api/enrollments/students/:studentId/grades', () => {
        it('should get grades for a student', async () => {
            // Create an enrollment with a grade
            const enrollment = await Enrollment.create({
                student: testData.student._id,
                class: testData.class._id,
                status: 'completed',
                grade: 8.5,
            });

            const res = await chai.request(app).get(`/api/enrollments/students/${testData.student.studentId}/grades`);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body[0]).to.have.property('courseId', 'CS101');
            expect(res.body[0]).to.have.property('grade', 8.5);
        });

        it('should return 404 for a non-existent student', async () => {
            const res = await chai.request(app).get('/api/students/999999/grades');

            expect(res).to.have.status(404);
            // expect(res.body).to.have.property('message', 'Student not found');
        });
    });

    // Helper: Class data builder
    function buildClassData(overrides = {}) {
        return {
            classId: 'TEST001',
            course: new mongoose.Types.ObjectId(),
            academicYear: 2024,
            semester: new mongoose.Types.ObjectId(),
            lecturer: 'Dr. Test',
            maximumCapacity: 30,
            currentCapacity: 0,
            schedule: 'Monday 8:00-10:00',
            classroom: 'Room 101',
            ...overrides,
        };
    }

    // Helper: Course data builder
    function buildCourseData(overrides = {}) {
        return {
            courseId: 'CS101',
            name: 'Introduction to Programming',
            credits: 3,
            faculty: new mongoose.Types.ObjectId(),
            description: 'Basic programming concepts',
            prerequisites: [],
            isActive: true,
            ...overrides,
        };
    }

    // Helper: Semester data builder
    function buildSemesterData(overrides = {}) {
        return {
            semesterId: '2024-1',
            name: 'Spring 2024',
            startDay: '01-02',
            endDay: '15-06',
            cancellationDeadline: '15-03',
            ...overrides,
        };
    }

    // Helper: Student data builder
    function buildStudentData(overrides = {}) {
        return {
            studentId: '123456',
            fullName: 'Nguyen Van A',
            dateOfBirth: '2000-01-01',
            gender: 'Nam',
            faculty: new mongoose.Types.ObjectId(),
            program: new mongoose.Types.ObjectId(),
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
                mailing: {
                    houseNumber: '789',
                    street: 'Pham Ngu Lao',
                    district: 'District 1',
                    city: 'Ho Chi Minh City',
                    country: 'Vietnam',
                },
            },
            idDocument: new mongoose.Types.ObjectId(),
            studentStatus: new mongoose.Types.ObjectId(),
            nationality: 'Vietnam',
            ...overrides,
        };
    }
}); 