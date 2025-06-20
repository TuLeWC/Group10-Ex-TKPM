import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { LeftSidebar } from '../../components/sidebar/LeftSidebar'
import { FaColonSign, FaFolderPlus, FaGraduationCap, FaHeart, FaKey } from 'react-icons/fa6'
import { Breadcrumb } from '../../components/breadcrumb/Breadcrumb'
import useFetch from '../../hooks/useFetch'
import { useNavigate } from 'react-router-dom'
import { deleteDataAPI } from '../../ultis/api'
import { ToastContainer, toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import ReactPaginate from 'react-paginate'
import i18n from 'i18next';
import Spinner from '../../components/spinner/Spinner'
import { CourseCard } from '../../components/course/CoursesCard'

export const CoursesTable = () => {
    const language = i18n.language;
    const {
        data: initialCourses,
        isLoading: isLoadingInitialCourses,
        error: errorInitialCourses,
    } = useFetch(`/api/courses?lang=${language}`);
    const [courses, setCourses] = useState([]);

    const notify = (text) => toast(text);

    useEffect(() => {
        if (initialCourses) {
            setCourses(initialCourses);
        }
    }, [initialCourses]);
    
    const navigate = useNavigate();
    const { t } = useTranslation('course_table');

    const handleDelete = async (courseId) => {
        console.log(courseId);
        if (!window.confirm(`Bạn có chắc muốn xóa lớp học ${courseId}?`))
          return;
    
        try {
            const response = await deleteDataAPI(`/api/courses/${courseId}`);
            console.log(response);
            notify(response?.message || "Xoá khoá học thành công!");
        
            // Cập nhật danh sách lớp học sau khi xóa thành công
            setCourses((prevCourses) =>
            {
                if (response?.message === "Course deleted successfully") {
                    return prevCourses.filter((course) => course.courseId !== courseId)
                } else {
                    return prevCourses.map((course) => {
                        if (course.courseId === courseId) {
                            return { ...course, isActive: false }; // Đánh dấu lớp học là không hoạt động
                        }
                        return course;
                    });
                }
            }
            );
        } catch (error) {
            notify(error.message || "Xoá khoá học thất bại!");
            console.error("Lỗi khi xóa khoá học:", error);
        }
    };

    // pagination
    const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
    const studentsPerPage = 8;
    
    // Tính toán hiển thị dựa trên trang hiện tại
    const offset = currentPage * studentsPerPage;
    const currentCourses = courses?.slice(offset, offset + studentsPerPage);
    const pageCount = Math.ceil(courses?.length / studentsPerPage);
    
    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    return (
    <div>
        <Row>
            <Col md={2}>
                <LeftSidebar />
            </Col>
            
            <Col md={10} className="p-4 bg-light">
                <Breadcrumb
                    title={t('breadcrumb.title')}
                    items={[
                        { label: t('breadcrumb.courses'), href: '#' },
                        { label: t('breadcrumb.all_courses'), active: true }
                    ]}
                />
                <Row className="d-flex justify-content-end">
                    <Col xs="auto">
                        <button className="btn btn-primary mb-3" onClick={() => window.location.href='/add-course'}>
                            <FaFolderPlus className='me-2'/> {t('add_course')}
                        </button>            
                    </Col>
                </Row>
                <Row className="g-4">
                    {isLoadingInitialCourses && <Spinner />}
                    {currentCourses && currentCourses.length> 0 && currentCourses.map((course, index) => (
                        <CourseCard
                            key={index}
                            course={course}
                            onDelete={handleDelete}
                            t={t}
                        />
                    ))}
                </Row>
                {/* Phân trang */}
                <ReactPaginate
                    previousLabel="Previous"
                    nextLabel="Next"
                    breakLabel="..."
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName="pagination justify-content-end mt-3"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    activeClassName="active"
                />
            </Col>   
        </Row>
        <ToastContainer/>
    </div>
    )
}
