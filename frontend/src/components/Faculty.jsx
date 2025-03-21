import React, { useEffect, useState } from 'react'
import useFetch from '../hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Container, Form, Modal, Row, Table } from 'react-bootstrap';
import { postDataToAPI, putDataToAPI } from '../ultis/api';

export const Faculty = () => {
    const { data: initialFaculties, isLoading, error } = useFetch("/api/faculties/");
    const [faculties, setFaculties] = useState([]);
    const navigate = useNavigate();

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

            // Chỉ reset khi không có lỗi
            setNewFaculty("");
            setValidated(false);
            setShowModal(false);
        } catch (error) {
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

            // Chỉ reset khi không có lỗi
            setUpdateFaculty({ id: null, name: "" });
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
                    onClick={() => navigate(`/`)}
                    type="button"
                    className="btn btn-success"
                >
                    Danh sách SV
                </button>
                <button
                    onClick={() => navigate(`/student-status`)}
                    type="button"
                    className="btn btn-success"
                >
                    Quản lý tình trạng SV
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
                <h2>Danh sách khoa:</h2>
                <div className="d-flex gap-2">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setShowModal(true)}
                        >
                        Thêm khoa
                    </button>
                </div>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Id</th>
                    <th>Tên Khoa</th>
                    <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
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
                            Cập nhật
                            </button>
                        </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
                
            {/* Add Faculty Modal */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                backdrop="static"
                size="lg"
                centered
            >
                <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>Thêm khoa mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                            <Form.Label>
                                Tên khoa <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                required
                                type="text"
                                name="id"
                                value={newFaculty}
                                onChange={handleInputChange}
                                placeholder="Nhập tên khoa"
                            />
                            <Form.Control.Feedback type="invalid">
                                Vui lòng nhập tên khoa
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
                <Modal.Title>Cập nhật tên khoa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form noValidate validated={formUpdateValidated} onSubmit={handleSubmitFormUpdate}>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                            <Form.Label>
                                Tên khoa <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                required
                                type="text"
                                name="name"
                                value={updateFaculty.name}
                                onChange={handleInputChangeFormUpdate}
                                placeholder="Nhập tên khoa"
                            />
                            <Form.Control.Feedback type="invalid">
                                Vui lòng nhập tên khoa
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
