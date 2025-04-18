import React, { useEffect, useState } from 'react'
import { Col, Container, Form, Row, Button} from 'react-bootstrap'
import { LeftSidebar } from '../../components/sidebar/LeftSidebar'
import { FaGraduationCap, FaHeart } from 'react-icons/fa6'
import { Breadcrumb } from '../../components/breadcrumb/Breadcrumb'
import useFetch from '../../hooks/useFetch'
import { postDataToAPI} from '../../ultis/api'
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from 'react-router-dom'

export const AddCourse = () => {
    const {
        data: faculties,
        isLoading: isLoadingFaculties,
        error: errorFaculties,
    } = useFetch("/api/faculties/");

    const {
        data: courses,
        isLoading: isLoadingCourses,
        error: errorCourses,
    } = useFetch("/api/courses/");

    const navigate = useNavigate();

    // handle alert
    const notify = (text) => toast(text);

    // new information of course
    const [course, setCourse] = useState({
        courseId: '',
        name: '',
        credits: '',
        faculty: '', // id of faculty
        description: '',
        prerequisites: [],
    });

    // handle prerequisite change
    const [allCourses, setAllCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCourses, setFilteredCourses] = useState([]);

    useEffect(() => {
        if (courses) {
            setAllCourses(courses);
            setFilteredCourses(courses);
        }
    }, [courses]);

    const handlePrerequisiteChange = (e) => {
        setSearchTerm(e.target.value);
        const filtered = allCourses.filter((course) =>
            course.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
            course.courseId.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredCourses(filtered);
    };

    const addPrerequisite = (courseId) => {
        setCourse((prev) => ({
            ...prev,
            prerequisites: [...prev.prerequisites, courseId],
        }));
    };

    const removePrerequisite = (courseId) => {
        setCourse((prev) => ({
            ...prev,
            prerequisites: prev.prerequisites.filter((id) => id !== courseId),
        }));
    };

    // Form validation
    const [validated, setValidated] = useState(false);
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCourse((prev) => ({
          ...prev,
          [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }  
        console.log(course);

        try {
            const response = await postDataToAPI(`/api/courses`, course);
            console.log(response);
            notify("Thêm khoá học thành công");

            // Chỉ reset khi không có lỗi
            setValidated(false);
            setTimeout(() => {
                navigate('/courses')
            }, 1200);
        } catch (error) {
            notify(error.message || "Thêm khoá học thất bại!");
            console.log(error);
        }
    };

    return (
    <div>
        <Container>
            <Row>
                <Col md={2}>
                    <LeftSidebar />
                </Col>
                
                <Col md={10} className="p-4 bg-light">
                    <Breadcrumb
                        title="Add Course"
                        items={[
                            { label: 'Courses', href: '#' },
                            { label: 'All Courses', href: '/courses' },
                            { label: 'Add course', active: true }
                        ]}
                    />
                    <Form className="bg-white p-4 rounded shadow-sm" noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="courseId">
                                <Form.Label>Mã khoá học <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="text" placeholder="Mã khoá học" required name='courseId' value={course.courseId} onChange={handleInputChange} />
                                <Form.Control.Feedback type="invalid">
                                    Vui lòng nhập mã khoá học
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="name">
                                <Form.Label>Tên khoá học <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="text" placeholder="Tên khoá học" required name='name' value={course.name} onChange={handleInputChange}  />
                                <Form.Control.Feedback type="invalid">
                                    Vui lòng nhập tên khoá học
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        </Row>

                        <Form.Group controlId="description" className="mb-3">
                            <Form.Label>Mô tả <span className="text-danger">*</span></Form.Label>
                            <Form.Control as="textarea" rows={4} placeholder="Mô tả" required name='description' value={course.description} onChange={handleInputChange}  />
                            <Form.Control.Feedback type="invalid">
                                Vui lòng nhập mô tả
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="credits">
                                <Form.Label>Tín chỉ <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="number" placeholder='Tín chỉ' required name='credits' value={course.credits} onChange={handleInputChange}  min="2"/>
                                <Form.Control.Feedback type="invalid">
                                    Vui lòng nhập số tín chỉ (lớn hơn 1)
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                            <Form.Label>
                                Khoa <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Select
                                required
                                name="faculty"
                                value={course.faculty}
                                onChange={handleInputChange}
                            >
                                <option value="">
                                Chọn khoa
                                </option>
                                {isLoadingFaculties && !faculties ? (
                                <option disabled>Đang tải danh sách khoa...</option>
                                ) : (
                                faculties?.map((faculty) => (
                                    <option key={faculty?._id} value={faculty?._id}>
                                    {faculty.name}
                                    </option>
                                ))
                                )}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Vui lòng chọn khoa
                            </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        </Row>

                        <Form.Group controlId="prerequisites" className="mb-3">
                            <Form.Label>Môn tiên quyết</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Tìm kiếm môn tiên quyết"
                                value={searchTerm}
                                onChange={handlePrerequisiteChange}
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
                                                disabled={course.prerequisites.includes(String(item.courseId))}
                                                onClick={() => {
                                                    addPrerequisite(item.courseId)
                                                }}
                                            >
                                                Thêm
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="mt-3">
                                <h6>Danh sách môn tiên quyết đã chọn:</h6>
                                {course.prerequisites.map((id) => (
                                    <div key={id} className="d-flex justify-content-between align-items-center mt-2">
                                        <span>{id}</span>
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => removePrerequisite(id)}
                                        >
                                            Xoá
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </Form.Group>

                        <div className="d-flex gap-2">
                        <Button type="submit" variant="primary">Submit</Button>
                        <Button variant="danger" onClick={()=>navigate("/courses")}>Cancel</Button>
                        </div>
                    </Form>
                </Col>   
            </Row>    
                
            
        </Container>
        <ToastContainer />
    </div>
    )
}
