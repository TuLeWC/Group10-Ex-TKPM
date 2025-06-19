import React, { useEffect, useState } from 'react'
import useFetch from '../hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Container, Form, Modal, Row, Table } from 'react-bootstrap';
import { deleteDataAPI, postDataToAPI, putDataToAPI } from '../ultis/api';
import { ToastContainer, toast } from 'react-toastify';
import { LeftSidebar } from '../components/sidebar/LeftSidebar';
import { useTranslation } from 'react-i18next';
import ReactPaginate from 'react-paginate';
import i18n from 'i18next';
import { FaRegTrashCan } from 'react-icons/fa6';

export const StudentStatusRule = () => {
    const language = i18n.language;
    const { data: initialStatusTransitions, isLoading, error } = useFetch("/api/status-transitions/");
    const { data: listStatus, isLoading: isLoadingListStatus, error: errorListStatus } = useFetch(`/api/student-statuses/?lang=${language}`);
    const [statusTransitions, setStatusTransitions] = useState([]);
    const navigate = useNavigate();
    const notify = (text) => toast(text);
    const { t } = useTranslation('student_status_rule');

    // Cập nhật danh sách khi API fetch xong
    useEffect(() => {
        if (initialStatusTransitions) {
            setStatusTransitions(initialStatusTransitions);
        }
    }, [initialStatusTransitions]);
  
    // Modal control
    const [showModal, setShowModal] = useState(false);
  
    // New faculity form data
    const [newStatusTransition, setNewStatusTransition] = useState({
        _id: "",
        fromStatus: "",
        toStatus: "",
    });
  
    // Form validation
    const [validated, setValidated] = useState(false);
  
    // Handle form input changes
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewStatusTransition((prev) => ({
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
    
        // Add new Status
        try {
            const response = await postDataToAPI("/api/status-transitions/", { fromStatus: newStatusTransition.fromStatus, toStatus: newStatusTransition.toStatus });
            setStatusTransitions((prev) => [...prev, response?.newTransition]);
            notify("Thêm trạng thái mới thành công!");
            // Chỉ reset khi không có lỗi
            setNewStatusTransition("");
            setValidated(false);
            setShowModal(false);
        } catch (error) {
            notify(error.message || "Thêm trạng thái mới thất bại!");
            console.log(error);
        }
    
    };

    const handleDeleteStatusTransition = async (id) => {
        if (!window.confirm(`Bạn có chắc muốn xóa trạng thái này?`))
            return;
        try {
            const response = await deleteDataAPI(`/api/status-transitions/${id}`);
            setStatusTransitions((prevConfigs) =>
                prevConfigs.filter((config) => config._id !== id)
            );
            notify("Xoá trạng thái thành công!");
        } catch (error) {
            notify(error.message || "Xoá trạng thái thất bại!");
            console.log(error);
        }
    
    };

    // pagination
    const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
    const studentsPerPage = 5;
    
    // Tính toán hiển thị dựa trên trang hiện tại
    const offset = currentPage * studentsPerPage;
    const currentStatusTransitions = statusTransitions?.slice(offset, offset + studentsPerPage);
    const pageCount = Math.ceil(statusTransitions?.length / studentsPerPage);
    
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
                    <h4>{t('title')}</h4>
                    <div className="d-flex gap-2">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => setShowModal(true)}
                            >
                            {t('add_rule')}
                        </button>
                    </div>
                </div>
                <div className="table-responsive shadow-sm rounded bg-white p-3">
                <Table className="table table-hover ">
                    <thead>
                        <tr>
                        <th>{t('table_headers.id')}</th>
                        <th>{t('table_headers.from_status')}</th>
                        <th>{t('table_headers.to_status')}</th>
                        <th>{t('table_headers.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {error && <p className="text-danger">Có lỗi xảy ra: {error}</p>}
                        {!isLoading && !error && currentStatusTransitions &&
                        currentStatusTransitions.map((status, index) => (
                            <tr key={index}>
                            <td>{status._id}</td>
                            <td>{language == "vi" ? status?.fromStatus.status.vi : status?.fromStatus.status.en}</td>
                            <td>{language == "vi" ? status?.toStatus.status.vi : status?.toStatus.status.en}</td>
                            <td>
                                <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => {
                                    handleDeleteStatusTransition(status._id);
                                }}
                                >
                                <FaRegTrashCan/>
                                </button>
                            </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                </div>
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
            
        {/* Add Faculty Modal */}
        <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            backdrop="static"
            size="lg"
            centered
        >
            <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>Thêm quy tắc tình trạng mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Tình trạng trước <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Select
                                required
                                name="fromStatus"
                                value={newStatusTransition.fromStatus}
                                onChange={handleInputChange}
                                >
                                <option value="">
                                    Chọn tình trạng
                                </option>
                                {isLoadingListStatus && !listStatus ? (
                                    <option disabled>Đang tải danh sách tình trạng...</option>
                                ) : (
                                    listStatus?.map((status) => (
                                    <option key={status._id} value={status._id}>
                                        {status.status}
                                    </option>
                                    ))
                                )}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Tình trạng sau <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Select
                                required
                                name="toStatus"
                                value={newStatusTransition.toStatus}
                                onChange={handleInputChange}
                                >
                                <option value="">
                                    Chọn tình trạng
                                </option>    
                                {isLoadingListStatus && !listStatus ? (
                                    <option disabled>Đang tải danh sách tình trạng...</option>
                                ) : (
                                    listStatus?.map((status) => (
                                    <option key={status._id} value={status._id}>
                                        {status.status}
                                    </option>
                                    ))
                                )}
                            </Form.Select>
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
