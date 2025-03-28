import React, { useEffect, useState } from 'react'
import useFetch from '../hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Container, Form, Modal, Row, Table } from 'react-bootstrap';
import { deleteDataAPI, postDataToAPI, putDataToAPI } from '../ultis/api';
import { ToastContainer, toast } from 'react-toastify';
import { LeftSidebar } from './LeftSidebar';

export const StudentStatusRule = () => {
    const { data: initialStatusTransitions, isLoading, error } = useFetch("/api/status-transitions/");
    const { data: listStatus, isLoading: isLoadingListStatus, error: errorListStatus } = useFetch("/api/student-statuses/");
    const [statusTransitions, setStatusTransitions] = useState([]);
    const navigate = useNavigate();
    const notify = (text) => toast(text);

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
  
    return (
      <div className="mt-5">
        <Container>
            <Row>
                <Col md={2} className="bg-light vh-100 p-3">
                    <LeftSidebar />
                </Col>
                <Col md={10} className="p-4">
                    <div className="d-flex justify-content-between mb-2">
                        <h4>Quy tắc thay đổi tình trạng sinh viên</h4>
                        <div className="d-flex gap-2">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => setShowModal(true)}
                                >
                                Thêm mới
                            </button>
                        </div>
                    </div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                            <th>Id</th>
                            <th>Trạng thái trước</th>
                            <th>Trạng thái sau</th>
                            <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {error && <p className="text-danger">Có lỗi xảy ra: {error}</p>}
                            {!isLoading && !error && statusTransitions &&
                            statusTransitions.map((status, index) => (
                                <tr key={index}>
                                <td>{status._id}</td>
                                <td>{status?.fromStatus.status}</td>
                                <td>{status?.toStatus.status}</td>
                                <td>
                                    <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => {
                                        handleDeleteStatusTransition(status._id);
                                    }}
                                    >
                                    Xoá
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
        </Container>
        <ToastContainer />
      </div>
    );
}
