import React, { useEffect, useState } from 'react'
import useFetch from '../hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Container, Form, Modal, Row, Table } from 'react-bootstrap';
import { postDataToAPI, putDataToAPI } from '../ultis/api';
import { ToastContainer, toast } from 'react-toastify';

export const Program = () => {
    const { data: initialPrograms, isLoading, error } = useFetch("/api/programs/");
    const [programs, setPrograms] = useState([]);
    const navigate = useNavigate();
    const notify = (text) => toast(text);

    // Cập nhật danh sách khi API fetch xong
    useEffect(() => {
        if (initialPrograms) {
            setPrograms(initialPrograms);
        }
    }, [initialPrograms]);
  
    // Modal control
    const [showModal, setShowModal] = useState(false);
  
    // New program form data
    const [newProgram, setNewProgram] = useState("");
  
    // Form validation
    const [validated, setValidated] = useState(false);
  
    // Handle form input changes
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewProgram(value);
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
            setPrograms((prev) => [...prev, {_id: response._id, name: response.name}]);
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
    const [updateProgram, setUpdateProgram] = useState({ id: null, name: "" });

    // Form update validation
    const [formUpdateValidated, setFormUpdateValidated] = useState(false);
  
    // Handle update form input changes
    const handleInputChangeFormUpdate = (e) => {
        const { name, value } = e.target;
        setUpdateProgram((prev) => ({
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
    
        // Update program
        try {
            const response = await putDataToAPI(`/api/programs/${updateProgram.id}`, { name: updateProgram.name });
            setPrograms((prev) =>
                prev.map((program) =>
                    program._id === updateProgram.id
                        ? { ...program, name: response.name } // Cập nhật tên khoa
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
                    onClick={() => navigate(`/student-status`)}
                    type="button"
                    className="btn btn-success"
                >
                    Quản lý tình trạng SV
                </button>
            </div>
            <div className="d-flex justify-content-between mb-2">
                <h2>Danh sách Chương trình:</h2>
                <div className="d-flex gap-2">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setShowModal(true)}
                        >
                        Thêm chương trình
                    </button>
                </div>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Id</th>
                    <th>Tên chương trình</th>
                    <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {error && <p className="text-danger">Có lỗi xảy ra: {error}</p>}
                    {!isLoading && !error && programs &&
                    programs.map((program, index) => (
                        <tr key={index}>
                        <td>{program._id}</td>
                        <td>{program.name}</td>
                        <td>
                            <button
                            type="button"
                            className="btn btn-warning"
                            onClick={() => {
                                setShowUpdateModal(true);
                                setUpdateProgram({ id: program._id, name: program.name });
                            }}
                            >
                            Cập nhật
                            </button>
                        </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
                
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
                                Tên chương trình <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                required
                                type="text"
                                name="id"
                                value={newProgram}
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
                <Modal.Title>Cập nhật tên khoa</Modal.Title>
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
                                name="name"
                                value={updateProgram.name}
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
        <ToastContainer />
      </div>
    );
}
