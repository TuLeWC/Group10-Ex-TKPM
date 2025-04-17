import React, { useEffect, useState } from 'react'
import useFetch from '../hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Container, Form, Modal, Row, Table } from 'react-bootstrap';
import { deleteDataAPI, postDataToAPI, putDataToAPI } from '../ultis/api';
import { ToastContainer, toast } from 'react-toastify';
import { LeftSidebar } from '../components/sidebar/LeftSidebar';

export const PhoneCode = () => {
    const { data: initialPhoneConfigs, isLoading, error } = useFetch("/api/phone-configs/");
    console.log(initialPhoneConfigs);
    const [phoneConfigs, setPhoneConfigs] = useState([]);
    const navigate = useNavigate();
    const notify = (text) => toast(text);

    // Cập nhật danh sách khi API fetch xong
    useEffect(() => {
        if (initialPhoneConfigs) {
            setPhoneConfigs(initialPhoneConfigs);
        }
    }, [initialPhoneConfigs]);
  
    // Modal control
    const [showModal, setShowModal] = useState(false);
  
    // New faculity form data
    const [newPhoneConfig, setNewPhoneConfig] = useState({
        country: "",
        regexPattern: "",
    });
  
    // Form validation
    const [validated, setValidated] = useState(false);
  
    // Handle form input changes
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewPhoneConfig((prev) => ({
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
    
        // Add new faculty
        try {
            const response = await postDataToAPI("/api/phone-configs/", { country: newPhoneConfig.country, regexPattern: newPhoneConfig.regexPattern });
            setPhoneConfigs((prev) => [...prev, response?.newConfig]);
            notify("Thêm SDT thành công!");
            // Chỉ reset khi không có lỗi
            setNewPhoneConfig("");
            setValidated(false);
            setShowModal(false);
        } catch (error) {
            notify(error.message || "Thêm SDT thất bại!");
            console.log(error);
        }
    
    };

    const handleDeletePhoneConfig = async ({id, country}) => {
        if (!window.confirm(`Bạn có chắc muốn xóa sdt của quốc gia ${country}?`))
            return;
        try {
            const response = await deleteDataAPI(`/api/phone-configs/${id}`);
            setPhoneConfigs((prevConfigs) =>
                prevConfigs.filter((config) => config._id !== id)
            );
            notify("Xoá SĐT thành công!");
        } catch (error) {
            notify(error.message || "Xoá SĐT thất bại!");
            console.log(error);
        }
    
    };
  
    return (
      <div>
        <Row>
            <Col md={2}>
                <LeftSidebar />
            </Col>
            <Col md={10} className="p-4 bg-light">
                <div className="d-flex justify-content-between mb-2">
                    <h4>Cấu hình SDT hợp lệ</h4>
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
                        <th>Quốc gia</th>
                        <th>Regex Pattern</th>
                        <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {error && <p className="text-danger">Có lỗi xảy ra: {error}</p>}
                        {!isLoading && !error && phoneConfigs &&
                        phoneConfigs.map((phoneConfig, index) => (
                            <tr key={index}>
                            <td>{phoneConfig._id}</td>
                            <td>{phoneConfig.country}</td>
                            <td>{phoneConfig.regexPattern}</td>
                            <td>
                                <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => {
                                    handleDeletePhoneConfig({ id: phoneConfig._id, country: phoneConfig.country });
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
            
        {/* Add Phone Configs Modal */}
        <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            backdrop="static"
            size="lg"
            centered
        >
            <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>Thêm mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                        <Form.Label>
                            Tên quốc gia <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            required
                            type="text"
                            name="country"
                            value={newPhoneConfig.country}
                            onChange={handleInputChange}
                            placeholder="Nhập tên quốc gia"
                        />
                        <Form.Control.Feedback type="invalid">
                            Vui lòng nhập tên quốc gia
                        </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                        <Form.Label>
                            Regex Pattern <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            required
                            type="text"
                            name="regexPattern"
                            value={newPhoneConfig.regexPattern}
                            onChange={handleInputChange}
                            placeholder="Nhập regex pattern"
                        />
                        <Form.Control.Feedback type="invalid">
                            Vui lòng nhập regex pattern
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
