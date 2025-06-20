import React, { useEffect, useState } from 'react'
import useFetch from '../hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Container, Form, Modal, Row, Table } from 'react-bootstrap';
import { postDataToAPI, putDataToAPI } from '../ultis/api';
import { ToastContainer, toast } from 'react-toastify';
import { LeftSidebar } from '../components/sidebar/LeftSidebar';
import { useTranslation } from 'react-i18next';
import ReactPaginate from 'react-paginate';
import i18n from 'i18next';
import { FaPen } from 'react-icons/fa6';

export const Program = () => {
    const language = i18n.language;
    const { data: initialPrograms, isLoading, error } = useFetch(`/api/programs/?lang=${language}`);
    const [programs, setPrograms] = useState([]);
    const navigate = useNavigate();
    const notify = (text) => toast(text);
    const { t } = useTranslation('program');

    // Cập nhật danh sách khi API fetch xong
    useEffect(() => {
        if (initialPrograms) {
            setPrograms(initialPrograms);
        }
    }, [initialPrograms]);
  
    // Modal control
    const [showModal, setShowModal] = useState(false);
  
    // New program form data
    const [newProgram, setNewProgram] = useState({vi: "", en: ""});
  
    // Form validation
    const [validated, setValidated] = useState(false);
  
    // Handle form input changes
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewProgram((prev) => ({
        ...prev,
        [name]: value, // Cập nhật giá trị theo key (vi hoặc en)
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
    
        // Add new program
        try {
            const response = await postDataToAPI("/api/programs/", { name: newProgram });
            const programName = language === 'vi' ? response.name.vi : response.name.en;
            setPrograms((prev) => [...prev, {_id: response._id, name: programName}]);
            notify("Thêm chương trình thành công!");
            // Chỉ reset khi không có lỗi
            setNewProgram("");
            setValidated(false);
            setShowModal(false);
        } catch (error) {
            notify(error.message || "Thêm chương trình thất bại!");
            console.log(error);
        }
    
    };

    // Modal for update program
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    // Update program form data
    const [updateProgram, setUpdateProgram] = useState({ id: null, name: {vi: "", en: ""} });

    // Form update validation
    const [formUpdateValidated, setFormUpdateValidated] = useState(false);
  
    // Handle update form input changes
    const handleInputChangeFormUpdate = (e) => {
        const { name, value } = e.target;
        setUpdateProgram((prev) => ({
            ...prev,
            name: {
                ...prev.name,
                [name]: value, // Cập nhật giá trị theo key (vi hoặc en)
            }
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
    
        // Update program
        try {
            const response = await putDataToAPI(`/api/programs/${updateProgram.id}`, { name: updateProgram.name });
            const programName = language === 'vi' ? response.name.vi : response.name.en;
            setPrograms((prev) =>
                prev.map((program) =>
                    program._id === updateProgram.id
                        ? { ...program, name: programName } // Cập nhật tên khoa
                        : program
                )
            );
            notify("Cập nhật chương trình thành công!");
            // Chỉ reset khi không có lỗi
            setUpdateProgram({ id: null, name: "" });
            setFormUpdateValidated(false);
            setShowUpdateModal(false);
        } catch (error) {
            notify(error.message || "Cập nhật chương trình thất bại!");
            console.log(error);
        }
    
    };

    // pagination
    const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
    const studentsPerPage = 5;
    
    // Tính toán hiển thị dựa trên trang hiện tại
    const offset = currentPage * studentsPerPage;
    const currentPrograms = programs?.slice(offset, offset + studentsPerPage);
    const pageCount = Math.ceil(programs?.length / studentsPerPage);
    
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
                            {t('add_program')}
                        </button>
                    </div>
                </div>
                <div className="table-responsive shadow-sm rounded bg-white p-3">
                <Table className="table table-hover ">
                    <thead>
                        <tr>
                        <th>{t('table_headers.id')}</th>
                        <th>{t('table_headers.name')}</th>
                        <th>{t('table_headers.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {error && <p className="text-danger">Có lỗi xảy ra: {error}</p>}
                        {!isLoading && !error && currentPrograms &&
                        currentPrograms.map((program, index) => (
                            <tr key={index}>
                            <td>{program._id}</td>
                            <td>{program.name}</td>
                            <td>
                                <button
                                type="button"
                                className="btn btn-warning"
                                onClick={() => {
                                    setShowUpdateModal(true);
                                    setUpdateProgram({ id: program._id, name: {[language]: program.name} });
                                }}
                                >
                                <FaPen/>
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
            
        {/* Add Program Modal */}
        <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            backdrop="static"
            size="lg"
            centered
        >
            <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>Thêm chương trình mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                        <Form.Label>
                            Tên chương trình tiếng Việt <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            required
                            type="text"
                            name="vi"
                            value={newProgram.vi}
                            onChange={handleInputChange}
                            placeholder="Nhập tên"
                        />
                        <Form.Control.Feedback type="invalid">
                            Vui lòng nhập tên
                        </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                        <Form.Label>
                            Tên chương trình tiếng Anh <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            required
                            type="text"
                            name="en"
                            value={newProgram.en}
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
        
        {/* Update Faculty Modal */}
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
                            name="vi"
                            value={updateProgram.name.vi}
                            onChange={handleInputChangeFormUpdate}
                            placeholder="Nhập tên chương trình"
                        />
                        <Form.Control.Feedback type="invalid">
                            Vui lòng nhập tên
                        </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                        <Form.Label>
                            Tên chương trình tiếng Anh <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            required
                            type="text"
                            name="en"
                            value={updateProgram.name.en}
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
