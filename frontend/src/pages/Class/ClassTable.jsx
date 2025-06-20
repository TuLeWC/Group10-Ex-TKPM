import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { LeftSidebar } from '../../components/sidebar/LeftSidebar'
import { FaColonSign, FaFolderPlus, FaGraduationCap, FaHeart, FaKey, FaPencil, FaTrash } from 'react-icons/fa6'
import { Breadcrumb } from '../../components/breadcrumb/Breadcrumb'
import useFetch from '../../hooks/useFetch'
import { useNavigate } from 'react-router-dom'
import { deleteDataAPI } from '../../ultis/api'
import { ToastContainer, toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import ReactPaginate from 'react-paginate'
import Spinner from '../../components/spinner/Spinner'

export const ClassTable = () => {
    const {
        data: initialClasses,
        isLoading: isLoadingInitialClasses,
        error: errorInitialClasses,
    } = useFetch("/api/classes/"); 
    const navigate = useNavigate();
    const { t } = useTranslation('class_table');
    const [classes, setClasses] = useState([]);
    const notify = (text) => toast(text);

    useEffect(() => {
        if (initialClasses) {
            setClasses(initialClasses);
        }
    }, [initialClasses]);

    // pagination
    const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
    const studentsPerPage = 10;
    
    // Tính toán hiển thị dựa trên trang hiện tại
    const offset = currentPage * studentsPerPage;
    const currentClasses = classes?.slice(offset, offset + studentsPerPage);
    const pageCount = Math.ceil(classes?.length / studentsPerPage);
    
    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    console.log("Classes:", classes);
    const handleDelete = async (classId, currentAmount) => {
        if (currentAmount > 0) {
            notify("Không thể xóa lớp học đã có sinh viên đăng ký!");
            return;
        }

        if (!window.confirm(`Bạn có chắc muốn xóa lớp học ${classId}?`))
            return;
    
        try {
            const response = await deleteDataAPI(`/api/classes/${classId}`);
            console.log(response);
            notify(response?.message || "Xoá lớp học thành công!");
        
            // Cập nhật danh sách lớp học sau khi xóa thành công
            setClasses((prevClasses) =>
                {
                    if (response?.message === "Class deleted successfully") {
                        return prevClasses.filter((classs) => classs.classId !== classId)
                    } 
                }
                );
        } catch (error) {
            notify(error.message || "Xoá lớp học thất bại!");
            console.error("Lỗi khi xóa lớp học:", error);
        }
    };

    return (
        <div>
        {/* <Container> */}
            <Row>
                <Col md={2}>
                    <LeftSidebar />
                </Col>
                
                <Col md={10} className="p-4 bg-light">
                    <Breadcrumb
                        title={t('breadcrumb.title')}
                        items={[
                            { label: t('breadcrumb.classes'), href: '#' },
                            { label: t('breadcrumb.all_classes'), active: true }
                        ]}
                    />
                    
                    <Row className="g-4 mt-1">
                    <div className="container mt-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4>{t('title')}</h4>
                            <button className="btn btn-primary" onClick={() => {navigate('/add-class')}}>+ {t('add_class')}</button>
                        </div>

                        <div className="table-responsive shadow-sm rounded bg-white p-3">
                            {isLoadingInitialClasses && <Spinner />}
                            <table className="table table-hover">
                            <thead>
                                <tr>
                                <th>{t('table_headers.class_id')}</th>
                                <th>{t('table_headers.course')}</th>
                                <th>{t('table_headers.academic_year')}</th>
                                <th>{t('table_headers.semester')}</th>
                                <th>{t('table_headers.lecturer')}</th>
                                <th>{t('table_headers.max_capacity')}</th>
                                <th>{t('table_headers.current_capacity')}</th>
                                <th>{t('table_headers.schedule')}</th>
                                <th>{t('table_headers.classroom')}</th>
                                <th>{t('table_headers.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentClasses && currentClasses.length > 0 && currentClasses.map((item) => (
                                <tr key={item.classId}>
                                    <td><strong>{item.classId}</strong></td>
                                    <td><strong>{item?.course?.name}</strong></td>
                                    <td>{item?.academicYear}</td>
                                    <td>{item?.semester?.semesterId}</td>
                                    <td className="fw-bold">{item?.lecturer}</td>
                                    <td>{item?.maximumCapacity}</td>
                                    <td>{item?.currentCapacity}</td>
                                    <td>{item?.schedule}</td>
                                    <td>{item?.classroom}</td>
                                    <td>
                                    <button className="btn btn-sm btn-primary me-2">
                                        <FaPencil/>
                                    </button>
                                    <button className="btn btn-sm btn-danger"
                                        onClick={() => {
                                            handleDelete(item?.classId, item?.currentCapacity)
                                        }}
                                    >
                                        <FaTrash/>
                                    </button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                    </div>
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
                
            
        {/* </Container> */}
        <ToastContainer/>
    </div>
    )
}
