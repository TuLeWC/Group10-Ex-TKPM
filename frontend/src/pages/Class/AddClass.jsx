import React, { useEffect, useState } from 'react'
import { Col, Container, Form, Row, Button} from 'react-bootstrap'
import { LeftSidebar } from '../../components/sidebar/LeftSidebar'
import { FaGraduationCap, FaHeart } from 'react-icons/fa6'
import { Breadcrumb } from '../../components/breadcrumb/Breadcrumb'
import useFetch from '../../hooks/useFetch'
import { postDataToAPI} from '../../ultis/api'
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from 'react-router-dom'

export const AddClass = () => {
    const {
        data: courses,
        isLoading: isLoadingCourses,
        error: errorCourses,
    } = useFetch("/api/courses/");

    const navigate = useNavigate();

    // handle alert
    const notify = (text) => toast(text);

    // new information of course
    const [classs, setClasss] = useState({
        classId: '',
        courseId: '',
        academicYear: '',
        semesterId: '', // id of faculty
        lecturer: '',
        maximumCapacity: 0,
        schedule: '',
        classroom: '',
    });

    // handle course search
    const [allCourses, setAllCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCourses, setFilteredCourses] = useState([]);

    useEffect(() => {
        if (courses) {
            setAllCourses(courses);
            setFilteredCourses(courses);
        }
    }, [courses]);

    const handleCourseChange = (e) => {
        setSearchTerm(e.target.value);
        const filtered = allCourses.filter((course) =>
            course.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
            course.courseId.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredCourses(filtered);
    };

    const addCourseId = (courseId) => {
        setClasss((prev) => ({
            ...prev,
            courseId: courseId,
        }));
    };

    const removeCourseId = (courseId) => {
        setClasss((prev) => ({
            ...prev,
            courseId: '',
        }));
    };

    // Form validation
    const [validated, setValidated] = useState(false);
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setClasss((prev) => ({
          ...prev,
          [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!classs.courseId) {
            notify("Vui lòng chọn khoá học!");
            return;
        }

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
        }  
        console.log(classs);

        try {
            const response = await postDataToAPI(`/api/classes`, classs);
            console.log(response);
            notify("Thêm lớp học thành công");

            // Chỉ reset khi không có lỗi
            setValidated(false);
            setTimeout(() => {
                navigate('/classes')
            }, 1200);
        } catch (error) {
            notify(error.message || "Thêm lớp học thất bại!");
            console.log(error);
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
                    title="Add Class"
                    items={[
                        { label: 'Classes', href: '#' },
                        { label: 'All Classes', href: '/classes' },
                        { label: 'Add Class', active: true }
                    ]}
                />
                <Form className="bg-white p-4 rounded shadow-sm" noValidate validated={validated} onSubmit={handleSubmit}>
                    <Row className="mb-3">
                    <Col md={4}>
                        <Form.Group controlId="classId">
                            <Form.Label>Mã lớp <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="text" placeholder="Mã lớp" required name='classId' value={classs.classId} onChange={handleInputChange} />
                            <Form.Control.Feedback type="invalid">
                                Vui lòng nhập mã lớp
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>

                    <Col md={4}>
                        <Form.Group controlId="academicYear" className="mb-3">
                            <Form.Label>Năm học <span className="text-danger">*</span></Form.Label>
                            <Form.Control type='number' placeholder="Năm học" required name='academicYear' value={classs.academicYear} onChange={handleInputChange}  />
                            <Form.Control.Feedback type="invalid">
                                Vui lòng nhập năm học
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="semesterId" className="mb-3">
                            <Form.Label>Học kì <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                required
                                name="semesterId"
                                value={classs.semesterId}
                                onChange={handleInputChange}
                            >
                                <option value="">Chọn học kì</option>
                                <option value="HKI">Học kì I</option>
                                <option value="HKII">Học kì II</option>
                                <option value="HKIII">Học kì hè</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Vui lòng nhập Học kì
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    </Row>
                        
                    <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="lecturer" className="mb-3">
                            <Form.Label>Giảng viên <span className="text-danger">*</span></Form.Label>
                            <Form.Control type='text' placeholder="Giảng viên" required name='lecturer' value={classs.lecturer} onChange={handleInputChange}  />
                            <Form.Control.Feedback type="invalid">
                                Vui lòng nhập Giảng viên
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="maximumCapacity" className="mb-3">
                            <Form.Label>Số lượng SV tối đa <span className="text-danger">*</span></Form.Label>
                            <Form.Control type='number' placeholder="Số lượng SV tối đa" required name='maximumCapacity' value={classs.maximumCapacity} onChange={handleInputChange} min="1"/>
                            <Form.Control.Feedback type="invalid">
                            Số lượng SV tối đa phải lớn hơn 0
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    </Row>
                        
                    <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="schedule" className="mb-3">
                            <Form.Label>Lịch học <span className="text-danger">*</span></Form.Label>
                            <Form.Control type='text' placeholder="Lịch học" required name='schedule' value={classs.schedule} onChange={handleInputChange}  />
                            <Form.Control.Feedback type="invalid">
                                Vui lòng nhập Lịch học
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="classroom" className="mb-3">
                            <Form.Label>Phòng học <span className="text-danger">*</span></Form.Label>
                            <Form.Control type='text' placeholder="Phòng học" required name='classroom' value={classs.classroom} onChange={handleInputChange}  />
                            <Form.Control.Feedback type="invalid">
                                Vui lòng nhập Phòng học
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    </Row>

                    <Form.Group controlId="prerequisites" className="mb-3">
                        <Form.Label>Khoá học <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Tìm kiếm khoá học"
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
                                {filteredCourses.map((item) => (
                                    <div
                                        key={item.courseId}
                                        className="d-flex justify-content-between align-items-center mt-2"
                                    >
                                        <span>{item.name} ({item.courseId})</span>
                                        <Button
                                            size="sm"
                                            variant="success"
                                            disabled={classs.courseId === item.courseId}
                                            onClick={() => {
                                                addCourseId(item.courseId)
                                            }}
                                        >
                                            Thêm
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mt-3">
                            <h6>Khoá học: </h6>
                            {classs.courseId ? (        
                            <div className="d-flex justify-content-between align-items-center mt-2">
                                <span>{classs.courseId}</span>
                                <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => removeCourseId(classs.classId)}
                                >
                                    Xoá
                                </Button>
                            </div>
                            ) : (
                                <span className="text-danger">Vui lòng chọn khoá học!</span>
                            )}
                        </div>
                    </Form.Group>

                    <div className="d-flex gap-2">
                    <Button type="submit" variant="primary">Submit</Button>
                    <Button variant="danger">Cancel</Button>
                    </div>
                </Form>
            </Col>   
        </Row>    
        <ToastContainer />
    </div>
    )
}
