import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { LeftSidebar } from '../../components/sidebar/LeftSidebar'
import { FaColonSign, FaFolderPlus, FaGraduationCap, FaHeart, FaKey } from 'react-icons/fa6'
import { Breadcrumb } from '../../components/breadcrumb/Breadcrumb'
import useFetch from '../../hooks/useFetch'
import { useNavigate } from 'react-router-dom'
import { deleteDataAPI } from '../../ultis/api'
import { ToastContainer, toast } from 'react-toastify'

export const CoursesTable = () => {
    const {
        data: initialCourses,
        isLoading: isLoadingInitialCourses,
        error: errorInitialCourses,
    } = useFetch("/api/courses/");
    const [courses, setCourses] = useState([]);

    const notify = (text) => toast(text);

    useEffect(() => {
        if (initialCourses) {
            setCourses(initialCourses);
        }
    }, [initialCourses]);
    
    const navigate = useNavigate();

    const handleDelete = async (courseId) => {
        console.log(courseId);
        if (!window.confirm(`Bạn có chắc muốn xóa lớp học ${courseId}?`))
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
        <Container>
            <Row>
                <Col md={2}>
                    <LeftSidebar />
                </Col>
                
                <Col md={10} className="p-4 bg-light">
                    <Breadcrumb
                        title="All Courses"
                        items={[
                            { label: 'Courses', href: '#' },
                            { label: 'All Courses', active: true }
                        ]}
                    />
                    <Row className="d-flex justify-content-end">
                        <Col xs="auto">
                            <button className="btn btn-primary mb-3" onClick={() => window.location.href='/add-course'}>
                                <FaFolderPlus className='me-2'/> Thêm khoá học
                            </button>            
                        </Col>
                    </Row>
                    <Row className="g-4">
                        {courses && courses.length> 0 && courses.map((course, index) => (
                        <Col key={index} xs={12} sm={6} lg={4} xl={3}>   
                            <div className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden">
                                <img src="https://vtiacademy.edu.vn/upload/images/jb2-32.png" className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <div className="mb-2">
                                        <div className="d-flex justify-content-between text-muted small mb-2">
                                        <span>{new Date(course?.updatedAt).toLocaleDateString("vi-VN")}</span>
                                        <span><FaKey className="me-1" style={{ color: 'yellow' }}/>Credits: {course?.credits}</span>
                                        </div>
                                        <h6 className="fw-semibold">{course?.courseId}</h6>
                                        <h6 className="fw-semibold">{course?.name}</h6>
                                    </div>
                            
                                    <div className="mb-2">
                                        <p className="mb-1 small">Mô tả: <span className="fw-semi">{course?.description}</span></p>
                                        <p className="mb-1 small">Khoa: <span className="fw-bold">{course?.faculty?.name}</span></p>
                                        <p className="mb-1 small">
                                            Môn tiên quyết: 
                                            {course?.prerequisites && course.prerequisites.length > 0 ? (
                                                course.prerequisites.map((prerequisite, index) => (
                                                    <span key={index} className="fw-bold"> {prerequisite?.name}{index < course.prerequisites.length - 1 ? ', ' : ''}</span>
                                                ))
                                            ) : (
                                                <span className="fw-bold"> Không có</span>
                                            )}
                                        </p>
                                        <p className="mb-1 small">Trạng thái: <span className="fw-bold">{course?.isActive ? "đang mở" : "đang đóng"}</span></p>
                                    </div>
                                    <Row>
                                        <Col md={6} className="text-center">  
                                            <button
                                                className="btn btn-primary w-100 mt-2"
                                                onClick={() => navigate(`/edit-courses/${course?.courseId}`)}
                                            >
                                                Edit
                                            </button>
                                        </Col>
                                        <Col md={6} className="text-center">  
                                            <button
                                                className="btn btn-danger w-100 mt-2"
                                                    onClick={() => {
                                                        console.log(course);
                                                        handleDelete(course?.courseId)
                                                    }}
                                            >
                                                Delete
                                            </button>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Col> 
                        ))}
                    </Row>
                </Col>   
            </Row>    
                
            
        </Container>
        <ToastContainer/>
    </div>
    )
}
