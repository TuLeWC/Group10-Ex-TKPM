import React, { useEffect, useState } from 'react'
import useFetch from '../hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Container, Form, Modal, Row, Table } from 'react-bootstrap';
import { deleteDataAPI, postDataToAPI, putDataToAPI } from '../ultis/api';
import { ToastContainer, toast } from 'react-toastify';
import { LeftSidebar } from '../components/sidebar/LeftSidebar';
import { useTranslation } from 'react-i18next';
import ReactPaginate from 'react-paginate';
import { FaRegTrashCan } from 'react-icons/fa6';

export const MailDomain = () => {
    const { data: initialEmailDomains, isLoading, error } = useFetch("/api/email-configs/");
    console.log(initialEmailDomains);
    const [emailDomains, setEmailDomains] = useState();
    const navigate = useNavigate();
    const notify = (text) => toast(text);
    const { t } = useTranslation('mail_domain');

    // Cập nhật danh sách khi API fetch xong
    useEffect(() => {
        if (initialEmailDomains) {
            setEmailDomains(initialEmailDomains);
        }
    }, [initialEmailDomains]);
  
    // Modal control
    const [showModal, setShowModal] = useState(false);
  
    // New faculity form data
    const [newDomain, setNewDomain] = useState("");
  
    // Form validation
    const [validated, setValidated] = useState(false);
  
    // Handle form input changes
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewDomain(value);
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
    
        // Add new domain
        try {
            const response = await postDataToAPI("/api/email-configs/", { domain: newDomain });
            setEmailDomains((prev) => [...prev, {_id: response?.newDomain._id, domain: response?.newDomain.domain}]);
            notify("Thêm miền email thành công!");
            // Chỉ reset khi không có lỗi
            setNewDomain("");
            setValidated(false);
            setShowModal(false);
        } catch (error) {
            notify(error.message || "Thêm miền email thất bại!");
            console.log(error);
        }
    
    };

    const handleDeleteDomain = async ({id, domain}) => {
        if (!window.confirm(`Bạn có chắc muốn xóa tên miền ${domain}?`))
            return;
        try {
            const response = await deleteDataAPI(`/api/email-configs/${id}`);
            setEmailDomains((prevDomains) =>
                prevDomains.filter((domain) => domain._id !== id)
            );
            notify("Xoá miền email thành công!");
        } catch (error) {
            notify(error.message || "Xoá miền email thất bại!");
            console.log(error);
        }
    
    };

    // pagination
    const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
    const studentsPerPage = 5;
    
    // Tính toán hiển thị dựa trên trang hiện tại
    const offset = currentPage * studentsPerPage;
    const currentEmailDomains = emailDomains?.slice(offset, offset + studentsPerPage);
    const pageCount = Math.ceil(emailDomains?.length / studentsPerPage);
    
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
                            {t('add_domain')}
                        </button>
                    </div>
                </div>
                <div className="table-responsive shadow-sm rounded bg-white p-3">
                <Table className="table table-hover ">
                    <thead>
                        <tr>
                        <th>{t('table_headers.id')}</th>
                        <th>{t('table_headers.domain')}</th>
                        <th>{t('table_headers.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {error && <p className="text-danger">Có lỗi xảy ra: {error}</p>}
                        {!isLoading && !error && currentEmailDomains &&
                        currentEmailDomains.map((emailDomain, index) => (
                            <tr key={index}>
                            <td>{emailDomain._id}</td>
                            <td>{emailDomain.domain}</td>
                            <td>
                                <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => {
                                    handleDeleteDomain({id: emailDomain._id, domain: emailDomain.domain});
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
            
        {/* Add Mail Domain Modal */}
        <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            backdrop="static"
            size="lg"
            centered
        >
            <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>Thêm tên miền mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                        <Form.Label>
                            Tên miền <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            required
                            type="text"
                            name="id"
                            value={newDomain}
                            onChange={handleInputChange}
                            placeholder="Thêm tên miền"
                        />
                        <Form.Control.Feedback type="invalid">
                            Vui lòng nhập tên miền
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
