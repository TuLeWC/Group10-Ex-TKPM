import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import StudentContext from '../contexts/StudentContext';
import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { deleteDataAPI, fetchDataFromAPI, postDataToAPI } from '../ultis/api';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Breadcrumb } from '../components/breadcrumb/Breadcrumb';
import { LeftSidebar } from '../components/sidebar/LeftSidebar';
import { ToastContainer, toast } from 'react-toastify';
import { FaPencil, FaTrash } from 'react-icons/fa6';

const StudentEnrollment = () => {
    const { id } = useParams();

    // get all classes
    const {
        data: classes,
        isLoading: isLoadingClasses,
        error: errorClasses,
    } = useFetch("/api/classes/");

    // student info
    const [student, setStudent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // enrollment info of student
    const [enrollments, setEnrollments] = useState(null);
    
    const navigate = useNavigate();
    const notify = (text) => toast(text);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setStudent(null);
            setError(null);
            try {
                // Fetch student data
                const response = await fetchDataFromAPI(`/api/students/${id}`);
                console.log(response);
                setStudent(response);


                const responseEnrollment = await fetchDataFromAPI(`/api/enrollments/student/${id}`);
                setEnrollments(responseEnrollment);
                console.log(responseEnrollment);
                
            } catch (error) {
                setError(error?.message || "API call failed");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]); 

    // Handle find class
    const [allClasses, setAllClasses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredClasses, setFilteredClasses] = useState([]);
    const [classId, setClassId] = useState(null);

    useEffect(() => {
        if (classes) {
            setAllClasses(classes);
            setFilteredClasses(classes);
        }
    }, [classes]);

    const handleCourseChange = (e) => {
        setSearchTerm(e.target.value);
        const filtered = allClasses.filter((item) =>
            item?.course.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
            item?.classId.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredClasses(filtered);
    };

    const addClassId = (classId) => {
        setClassId(classId)
    };

    const removeClassId = (classId) => {
        setClassId(null);
    };

    // Form validation
    const [validated, setValidated] = useState(false);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(classId);

        if (!classId || classId === '') {
            notify("Vui lòng chọn lớp học!");
            return;
        }

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
        }
        
        const data = {
            studentId: id,
            classId: classId,
        }
        console.log(data);
        try {
            const response = await postDataToAPI(`/api/enrollments`, data);
            console.log(response);
            notify("Đăng kí lớp học thành công");

            // Chỉ reset khi không có lỗi
            setValidated(false);
            setTimeout(() => {
                navigate('/classes')
            }, 1200);
        } catch (error) {
            notify(error.message || "Đăng kí lớp học thất bại!");
            console.log(error);
        }
    };

    const handleDelete = async (classId, studentId) => {
        if (!window.confirm(`Bạn có chắc muốn xóa lớp học ${classId} cho sinh viên ${studentId}?`))
            return;
    
        try {
            const response = await deleteDataAPI(`/api/courses/${courseId}`);
            console.log(response);
            notify("Xoá lớp học thành công!");
        
            // Cập nhật danh sách lớp học sau khi xóa thành công
            setCourses((prevCourses) =>
                prevCourses.filter((course) => course.courseId !== courseId)
            );
        } catch (error) {
            notify(error.message || "Xoá lớp học thất bại!");
            console.error("Lỗi khi xóa lớp học:", error);
        }
    };

    return (
        <div>
            <Row>
            <Col md={2}>
                <LeftSidebar />
            </Col>

            <Col md={10} className="p-4 bg-light">     
                <Breadcrumb
                    title="Register Class"
                    items={[
                        { label: 'List Student', href: '/' },
                        { label: 'Register Class', active: true }
                    ]}
                />
                <div className="card mb-4 mb-xl-0">
                    <div className="card-header">Profile Picture</div>
                    <div className="card-body text-center">
                    <img
                        className="img-account-profile rounded-circle mb-2"
                        src="http://bootdey.com/img/Content/avatar/avatar1.png"
                        alt=""
                    />
                </div>
                <div>
                    <div className="card-body">
                        {error && <p className="text-danger">Có lỗi xảy ra: {error}</p>}
                        {!isLoading && student && 
                        (
                        <Form>
                            <Row>
                                {/* MSSV */}
                                <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                    MSSV <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        readOnly
                                        type="text"
                                        name="id"
                                        value={student.studentId}
                                    />
                                </Form.Group>
                                </Col>

                                {/* Name */}
                                <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Họ tên <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        readOnly
                                        type="text"
                                        name="fullName"
                                        value={student.fullName}
                                    />
                                </Form.Group>
                                </Col>

                                {/* nationality */}
                                <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Quốc tịch <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        readOnly
                                        type="text"
                                        name="nationality"
                                        value={student.nationality}
                                    
                                        placeholder="Nhập Quốc tịch"
                                    />
                                </Form.Group>
                                </Col>
                            </Row>
                
                            <Row>
                                {/* DOB */}
                                <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Ngày sinh <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        readOnly
                                        type="date"
                                        name="dateOfBirth"
                                        value={student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split("T")[0] : ""}
                                    />
                                </Form.Group>
                                </Col>

                                {/* Gender */}
                                <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Giới tính <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        required
                                        name="gender"
                                        value={student.gender}
                                    >
                                    </Form.Control>
                                </Form.Group>
                                </Col>
                            </Row>

                        </Form> 
                        )    
                        }
                    </div>
                </div>
                </div>
                
                <Form className="bg-white p-4 rounded shadow-sm mt-2" noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group controlId="prerequisites" className="mb-3">
                        <Form.Label>Đăng ký lớp học <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Tìm kiếm lớp học theo classId và tên khoá học"
                            value={searchTerm}
                            onChange={handleCourseChange}
                        />
                        {searchTerm && (
                            <div
                                className="mt-2"
                                style={{
                                    maxHeight: '200px', // Limit the height of the list
                                    overflowY: 'auto', // Add a scrollbar if the content exceeds the height
                                    border: '1px solid #ddd', // Optional: Add a border for better visibility
                                    borderRadius: '4px',
                                    padding: '8px',
                                    backgroundColor: '#fff',
                                }}
                            >
                                {filteredClasses.map((item) => (
                                    <div
                                        key={item.classId}
                                        className="d-flex justify-content-between align-items-center mt-2"
                                    >
                                        <span>Mã lớp học: ({item?.classId}) - {item.course?.name}</span>
                                        <Button
                                            size="sm"
                                            variant="success"
                                            disabled={classId === item.classId}
                                            onClick={() => {
                                                addClassId(item.classId)
                                            }}
                                        >
                                            Thêm
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mt-3">
                            <h6>Lớp học: </h6>
                            
                            {classId ? (        
                            <div className="d-flex justify-content-between align-items-center mt-2">
                                <span>{classId}</span>
                                <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => removeClassId(classId)}
                                >
                                    Xoá
                                </Button>
                            </div>
                            ) : (
                                <span className="text-danger">Vui lòng chọn lớp học!</span>
                            )}
                            
                        </div>
                    </Form.Group>

                    <div className="d-flex gap-2">
                    <Button type="submit" variant="primary">Submit</Button>
                    <Button variant="danger">Cancel</Button>
                    </div>
                </Form>
                    
                <div className="table-responsive shadow-sm rounded bg-white p-3 mt-2">
                    <table className="table table-hover">
                    <thead>
                        <tr>
                        <th>Mã lớp</th>
                        <th>Khoá học</th>
                        <th>Năm học</th>
                        <th>Học kì</th>
                        <th>Giảng viên</th>
                        <th>SLTĐ</th>
                        <th>SLHT</th>
                        <th>Lịch học</th>
                        <th>Phòng</th>
                        <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enrollments && enrollments.length > 0 && enrollments.map((item, id) => (
                        <tr key={id}>
                            <td><strong>{item?.class.classId}</strong></td>
                            <td><strong>{item?.class?.course?.name}</strong></td>
                            <td>{item?.class?.academicYear}</td>
                            <td>{item?.class?.semester?.semesterId}</td>
                            <td className="fw-bold">{item?.class?.lecturer}</td>
                            <td>{item?.class?.maximumCapacity}</td>
                            <td>{item?.class?.currentCapacity}</td>
                            <td>{item?.class?.schedule}</td>
                            <td>{item?.class?.classroom}</td>
                            <td>
                            <button className="btn btn-sm btn-primary me-2">
                                <FaPencil/>
                            </button>
                            <button className="btn btn-sm btn-danger">
                                <FaTrash/>
                            </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </Col>
            </Row>
            <ToastContainer/>
        </div>
  );
};

export default StudentEnrollment;
