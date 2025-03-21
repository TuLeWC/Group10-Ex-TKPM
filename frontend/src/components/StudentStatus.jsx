import React, { useEffect, useState } from 'react'
import useFetch from '../hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Container, Form, Modal, Row, Table } from 'react-bootstrap';
import { postDataToAPI, putDataToAPI } from '../ultis/api';

export const StudentStatus = () => {
    const { data: initialListStatus, isLoading, error } = useFetch("/api/student-statuses/");
    const [listStatus, setListStatus] = useState([]);
    console.log(listStatus);
    const navigate = useNavigate();

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

            // Chỉ reset khi không có lỗi
            setNewStatus("");
            setValidated(false);
            setShowModal(false);
        } catch (error) {
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

            // Chỉ reset khi không có lỗi
            setUpdateStatus({ id: null, status: "" });
            setFormUpdateValidated(false);
            setShowUpdateModal(false);
        } catch (error) {
            console.log(error);
        }
    
    };
  
    return (
      <div className="mt-5">
        <Container>
            <div className="d-flex gap-2 my-3 justify-content-end">
                <button
                    onClick={() => navigate(`/faculty`)}
                    type="button"
                    className="btn btn-success"
                >
                    Quản lý Khoa
                </button>
                <button
                    onClick={() => navigate(`/`)}
                    type="button"
                    className="btn btn-success"
                >
                    Danh sách SV
                </button>
                <button
                    onClick={() => navigate(`/program`)}
                    type="button"
                    className="btn btn-success"
                >
                    Quản lý Chương trình
                </button>
            </div>
            <div className="d-flex justify-content-between mb-2">
                <h2>Danh sách tình trạng sinh viên:</h2>
                <div className="d-flex gap-2">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setShowModal(true)}
                        >
                        Thêm tình trạng
                    </button>
                </div>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Id</th>
                    <th>Tình trạng</th>
                    <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {!isLoading && !error && listStatus &&
                    listStatus.map((studentStatus, index) => (
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
                            Cập nhật
                            </button>
                        </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
                
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
        </Container>
      </div>
    );
}
