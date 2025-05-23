import React, { useEffect, useState } from 'react'
import useFetch from '../hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Container, Form, Modal, Row, Table } from 'react-bootstrap';
import { postDataToAPI, putDataToAPI } from '../ultis/api';
import { ToastContainer, toast } from 'react-toastify';
import { LeftSidebar } from '../components/sidebar/LeftSidebar';
import { useTranslation } from 'react-i18next';

export const Faculty = () => {
    const { data: initialFaculties, isLoading, error } = useFetch("/api/faculties/");
    const [faculties, setFaculties] = useState([]);
    const navigate = useNavigate();
    const notify = (text) => toast(text);
    const { t } = useTranslation('faculty'); // Sử dụng namespace 'faculty'

    // Cập nhật danh sách khi API fetch xong
    useEffect(() => {
        if (initialFaculties) {
            setFaculties(initialFaculties);
        }
    }, [initialFaculties]);
  
    // Modal control
    const [showModal, setShowModal] = useState(false);
  
    // New faculity form data
    const [newFaculty, setNewFaculty] = useState("");
  
    // Form validation
    const [validated, setValidated] = useState(false);
  
    // Handle form input changes
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewFaculty(value);
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
    
        // Add new faculty
        try {
            const response = await postDataToAPI("/api/faculties/", { name: newFaculty });
            setFaculties((prev) => [...prev, {_id: response._id, name: response.name}]);
            notify("Thêm khoa thành công!");
            // Chỉ reset khi không có lỗi
            setNewFaculty("");
            setValidated(false);
            setShowModal(false);
        } catch (error) {
            notify(error.message || "Thêm khoa thất bại!");
            console.log(error);
        }
    
    };

    // Modal for update faculty
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    // Update faculity form data
    const [updateFaculty, setUpdateFaculty] = useState({ id: null, name: "" });

    // Form update validation
    const [formUpdateValidated, setFormUpdateValidated] = useState(false);
  
    // Handle update form input changes
    const handleInputChangeFormUpdate = (e) => {
        const { name, value } = e.target;
        setUpdateFaculty((prev) => ({
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
    
        // Add new faculty
        try {
            const response = await putDataToAPI(`/api/faculties/${updateFaculty.id}`, { name: updateFaculty.name });
            setFaculties((prev) =>
                prev.map((faculty) =>
                    faculty._id === updateFaculty.id
                        ? { ...faculty, name: response.name } // Cập nhật tên khoa
                        : faculty
                )
            );
            notify("Cập nhật khoa thành công!");
            // Chỉ reset khi không có lỗi
            setUpdateFaculty({ id: null, name: "" });
            setFormUpdateValidated(false);
            setShowUpdateModal(false);
        } catch (error) {
            notify(error.message || "Cập nhật khoa thất bại!");
            console.log(error);
        }
    
    };
  
    return (
      <div>
        <Row>
            <Col md={2} className="">
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
                            {t('add_faculty')}
                        </button>
                    </div>
                </div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>{t('table_headers.id')}</th>
                        <th>{t('table_headers.name')}</th>
                        <th>{t('table_headers.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {error && <p className="text-danger">{t('notifications.error_occurred')}: {error}</p>}
                        {!isLoading && !error && faculties &&
                        faculties.map((faculty, index) => (
                            <tr key={index}>
                            <td>{faculty._id}</td>
                            <td>{faculty.name}</td>
                            <td>
                                <button
                                type="button"
                                className="btn btn-warning"
                                onClick={() => {
                                    setShowUpdateModal(true);
                                    setUpdateFaculty({ id: faculty._id, name: faculty.name });
                                }}
                                >
                                {t('actions.update')}
                                </button>
                            </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
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
            <Modal.Title>{t('modals.add_title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                        <Form.Label>
                            {t('form.name')} <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            required
                            type="text"
                            name="id"
                            value={newFaculty}
                            onChange={handleInputChange}
                            placeholder={t('form.placeholder')}
                        />
                        <Form.Control.Feedback type="invalid">
                            {t('form.validation_error')}
                        </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2 mt-4">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    {t('buttons.cancel')}
                </Button>
                <Button variant="primary" type="submit">
                    {t('buttons.save')}
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
            <Modal.Title>{t('modals.update_title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form noValidate validated={formUpdateValidated} onSubmit={handleSubmitFormUpdate}>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                        <Form.Label>
                            {t('form.name')} <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            required
                            type="text"
                            name="name"
                            value={updateFaculty.name}
                            onChange={handleInputChangeFormUpdate}
                            placeholder={t('form.placeholder')}
                        />
                        <Form.Control.Feedback type="invalid">
                            {t('form.validation_error')}
                        </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2 mt-4">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    {t('buttons.cancel')}
                </Button>
                <Button variant="primary" type="submit">
                    {t('buttons.save')}
                </Button>
                </div>
            </Form>
            </Modal.Body>
        </Modal>
        <ToastContainer />
      </div>
    );
}
