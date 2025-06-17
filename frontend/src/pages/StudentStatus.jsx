import React, { useEffect, useState } from 'react'
import useFetch from '../hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Container, Form, Modal, Row, Table } from 'react-bootstrap';
import { postDataToAPI, putDataToAPI } from '../ultis/api';
import { ToastContainer, toast } from 'react-toastify';
import { LeftSidebar } from '../components/sidebar/LeftSidebar';
import { useTranslation } from 'react-i18next';
import ReactPaginate from 'react-paginate';

export const StudentStatus = () => {
    const { data: initialListStatus, isLoading, error } = useFetch("/api/student-statuses/");
    const [listStatus, setListStatus] = useState([]);
    const navigate = useNavigate();
    const notify = (text) => toast(text);
    const { t } = useTranslation('student_status');

    // Cập nhật danh sách khi API fetch xong
    useEffect(() => {
        if (initialListStatus) {
            setListStatus(initialListStatus);
        }
    }, [initialListStatus]);
  
    // Modal control
    const [showModal, setShowModal] = useState(false);
  
    // New Student Status form data
    const [newStatus, setNewStatus] = useState("");
  
    // Form validation
    const [validated, setValidated] = useState(false);
  
    // Handle form input changes
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewStatus(value);
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
    
        // Add new status
        try {
            const response = await postDataToAPI("/api/student-statuses/", { status: newStatus });
            setListStatus((prev) => [...prev, {_id: response._id, status: response.status}]);
            notify("Thêm tình trạng thành công!");
            // Chỉ reset khi không có lỗi
            setNewStatus("");
            setValidated(false);
            setShowModal(false);
        } catch (error) {
            notify(error.message || "Thêm tình trạng thất bại!");
            console.log(error);
        }
    
    };

    // Modal for update student status
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    // Update student status form data
    const [updateStatus, setUpdateStatus] = useState({ id: null, status: "" });

    // Form update validation
    const [formUpdateValidated, setFormUpdateValidated] = useState(false);
  
    // Handle update form input changes
    const handleInputChangeFormUpdate = (e) => {
        const { name, value } = e.target;
        setUpdateStatus((prev) => ({
            ...prev,
            [name]: value, // Chỉ cập nhật field thay đổi
        }));
    };

    // Handle update form submission
    const handleSubmitFormUpdate = async (e) => {
        e.preventDefault();
    
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setFormUpdateValidated(true);
            return;
        }
    
        // Update new status
        try {
            const response = await putDataToAPI(`/api/student-statuses/${updateStatus.id}`, { status: updateStatus.status });
            setListStatus((prev) =>
                prev.map((status) =>
                    status._id === updateStatus.id
                        ? { ...status, status: response.status } // Cập nhật tên khoa
                        : status
                )
            );
            notify("Cập nhật tình trạng thành công!");
            // Chỉ reset khi không có lỗi
            setUpdateStatus({ id: null, status: "" });
            setFormUpdateValidated(false);
            setShowUpdateModal(false);
        } catch (error) {
            notify(error.message || "Cập nhật tình trạng thất bại!");
            console.log(error);
        }
    
    };

    // pagination
    const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
    const studentsPerPage = 5;
    
    // Tính toán hiển thị dựa trên trang hiện tại
    const offset = currentPage * studentsPerPage;
    const currentListStatus = listStatus?.slice(offset, offset + studentsPerPage);
    const pageCount = Math.ceil(listStatus?.length / studentsPerPage);
    
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
                <div className="d-flex justify-content-between mb-2">
                    <h2>{t('title')}</h2>
                    <div className="d-flex gap-2">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => setShowModal(true)}
                            >
                            {t('add_status')}
                        </button>
                    </div>
                </div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>{t('table_headers.id')}</th>
                        <th>{t('table_headers.status')}</th>
                        <th>{t('table_headers.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {error && <p className="text-danger">Có lỗi xảy ra: {error}</p>}
                        {!isLoading && !error && currentListStatus &&
                        currentListStatus.map((studentStatus, index) => (
                            <tr key={index}>
                            <td>{studentStatus._id}</td>
                            <td>{studentStatus.status}</td>
                            <td>
                                <button
                                type="button"
                                className="btn btn-warning"
                                onClick={() => {
                                    setShowUpdateModal(true);
                                    setUpdateStatus({ id: studentStatus._id, status: studentStatus.status });
                                }}
                                >
                                {t('actions.update')}
                                </button>
                            </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
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
            
        {/* Add Student Status Modal */}
        <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            backdrop="static"
            size="lg"
            centered
        >
            <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>Thêm tình trạng sinh viên mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                        <Form.Label>
                            Tên tình trạng <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            required
                            type="text"
                            name="id"
                            value={newStatus}
                            onChange={handleInputChange}
                            placeholder="Nhập tên"
                        />
                        <Form.Control.Feedback type="invalid">
                            Vui lòng nhập tên
                        </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2 mt-4">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Hủy
                </Button>
                <Button variant="primary" type="submit">
                    Lưu
                </Button>
                </div>
            </Form>
            </Modal.Body>
        </Modal>
        
        {/* Update Status Modal */}
        <Modal
            show={showUpdateModal}
            onHide={() => setShowUpdateModal(false)}
            backdrop="static"
            size="lg"
            centered
        >
            <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>Cập nhật tên chương trình</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form noValidate validated={formUpdateValidated} onSubmit={handleSubmitFormUpdate}>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                        <Form.Label>
                            Tên chương trình <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            required
                            type="text"
                            name="status"
                            value={updateStatus.status}
                            onChange={handleInputChangeFormUpdate}
                            placeholder="Nhập tên chương trình"
                        />
                        <Form.Control.Feedback type="invalid">
                            Vui lòng nhập tên
                        </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2 mt-4">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Hủy
                </Button>
                <Button variant="primary" type="submit">
                    Lưu
                </Button>
                </div>
            </Form>
            </Modal.Body>
        </Modal>
        <ToastContainer />
      </div>
    );
}
