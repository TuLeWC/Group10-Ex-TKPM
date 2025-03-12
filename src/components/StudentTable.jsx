import { useContext, useState } from "react";
import Table from "react-bootstrap/Table";
import { Container, Modal, Form, Button, Row, Col, ListGroup } from "react-bootstrap";
import StudentContext from "../contexts/StudentContext";
import { useNavigate } from "react-router-dom";

const StudentTable = () => {
  const { students, setStudents } = useContext(StudentContext);
  const navigate = useNavigate();

  // Filter student list by search query
  const [searchQuery, setSearchQuery] = useState("");
  const trimmedSearchQuery = searchQuery.trim();
  const filteredStudents = trimmedSearchQuery
    ? students.filter(
        (student) =>
          student.fullName
            .toLowerCase()
            .includes(trimmedSearchQuery.toLowerCase()) ||
          student.id.toString().includes(trimmedSearchQuery)
      )
    : students;

  // Modal control
  const [showModal, setShowModal] = useState(false);

  // New student form data
  const [newStudent, setNewStudent] = useState({
    id: "",
    fullName: "",
    dateOfBirth: "",
    gender: "Nam",
    faculty: "",
    batch: "",
    program: "",
    address: "",
    email: "",
    phone: "",
    status: "Đang học",
  });

  // Form validation
  const [validated, setValidated] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    // Add new student to context
    setStudents((prev) => [...prev, newStudent]);

    // Reset form and close modal
    setNewStudent({
      id: "",
      fullName: "",
      dateOfBirth: "",
      gender: "Nam",
      faculty: "",
      batch: "",
      program: "",
      address: "",
      email: "",
      phone: "",
      status: "Đang học",
    });
    setValidated(false);
    setShowModal(false);
  };

  // Modal cho xoá sinh viên
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSearchQuery, setDeleteSearchQuery] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  /// Lọc danh sách sinh viên theo ID để xoá.
  const filteredStudentsToDelete = deleteSearchQuery.trim()
    ? students.filter((student) => {
        // Kiểm tra student và id không null/undefined và chuyển id thành chuỗi
        return (
          student &&
          student.id !== undefined &&
          student.id.toString().includes(deleteSearchQuery.trim())
        );
      })
    : [];

  // Xử lý khi người dùng chọn/bỏ chọn sinh viên để xoá
  const handleStudentSelection = (studentId) => {
    setSelectedStudents((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  // Xử lý khi người dùng nhấn nút xoá
  const handleDeleteStudents = () => {
    if (selectedStudents.length === 0) {
      return;
    }

    // Lọc ra các sinh viên không nằm trong danh sách cần xoá
    const updatedStudents = students.filter(
      (student) => !selectedStudents.includes(student.id)
    );
    setStudents(updatedStudents);

    // Reset và đóng modal
    setSelectedStudents([]);
    setDeleteSearchQuery("");
    setShowDeleteModal(false);
  };

  // Hàm mở modal xoá sinh viên
  const openDeleteModal = () => {
    setSelectedStudents([]);
    setDeleteSearchQuery("");
    setShowDeleteModal(true);
  };

  return (
    <div className="mt-5">
      <Container>
        <div className="d-flex justify-content-between mb-2">
          <h2>Danh sách sinh viên:</h2>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              Thêm sinh viên
            </button>
            <button
              onClick={openDeleteModal}
              type="button"
              className="btn btn-danger"
            >
              Xoá sinh viên
            </button>
          </div>
        </div>
        <div className="col-4">
          <input
            className="form-control mb-2 "
            type="text"
            placeholder="Tìm kiếm theo họ tên hoặc MSSV"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>MSSV</th>
              <th>Họ tên</th>
              <th>Ngày sinh</th>
              <th>Giới tính</th>
              <th>Khoa</th>
              <th>Khoá</th>
              <th>Chương trình</th>
              <th>Địa chỉ</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Tình trạng</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents &&
              filteredStudents.map((student, index) => (
                <tr key={index}>
                  <td>{student.id}</td>
                  <td>{student.fullName}</td>
                  <td>{student.dateOfBirth}</td>
                  <td>{student.gender}</td>
                  <td>{student.faculty}</td>
                  <td>{student.batch}</td>
                  <td>{student.program}</td>
                  <td>{student.address}</td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>{student.status}</td>
                  <td>
                    <button
                      type="button"
                      class="btn btn-warning"
                      onClick={() => navigate(`/edit/${student.id}`)}
                    >
                      Cập nhật
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
        {/* Add Student Modal */}
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          backdrop="static"
          size="lg"
          centered
        >
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>Thêm sinh viên mới</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      MSSV <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="id"
                      value={newStudent.id}
                      onChange={handleInputChange}
                      placeholder="Nhập MSSV"
                    />
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập MSSV
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Họ tên <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="fullName"
                      value={newStudent.fullName}
                      onChange={handleInputChange}
                      placeholder="Nhập họ tên sinh viên"
                    />
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập họ tên
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Ngày sinh <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      required
                      type="date"
                      name="dateOfBirth"
                      value={newStudent.dateOfBirth}
                      onChange={handleInputChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Vui lòng chọn ngày sinh
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Giới tính <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      required
                      name="gender"
                      value={newStudent.gender}
                      onChange={handleInputChange}
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Khoa <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      required
                      name="faculty"
                      value={newStudent.faculty}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>
                        Chọn khoa
                      </option>
                      <option value="Luật">Luật</option>
                      <option value="Tiếng Anh thương mại">
                        Tiếng Anh thương mại
                      </option>
                      <option value="Tiếng Nhật">Tiếng Nhật</option>
                      <option value="Tiếng Pháp">Tiếng Pháp</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Vui lòng chọn khoa
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Khóa <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="batch"
                      value={newStudent.batch}
                      onChange={handleInputChange}
                      placeholder="Ví dụ: 2020"
                    />
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập khóa
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Chương trình <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="program"
                      value={newStudent.program}
                      onChange={handleInputChange}
                      placeholder="Ví dụ: Chuẩn"
                    />
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập chương trình học
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>
                  Địa chỉ <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  required
                  as="textarea"
                  name="address"
                  value={newStudent.address}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Nhập địa chỉ"
                />
                <Form.Control.Feedback type="invalid">
                  Vui lòng nhập địa chỉ
                </Form.Control.Feedback>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Email <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      required
                      type="email"
                      name="email"
                      pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                      value={newStudent.email}
                      onChange={handleInputChange}
                      placeholder="example@gmail.com"
                    />
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập email hợp lệ
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Số điện thoại <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      required
                      type="tel"
                      pattern="^0\d{9}$"
                      name="phone"
                      value={newStudent.phone}
                      onChange={handleInputChange}
                      placeholder="Nhập số điện thoại"
                    />
                    <Form.Control.Feedback type="invalid">
                      Số điện thoại không hợp lệ
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>
                  Tình trạng <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  required
                  name="status"
                  value={newStudent.status}
                  onChange={handleInputChange}
                >
                  <option value="Đang học">Đang học</option>
                  <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
                  <option value="Thôi học">Đã thôi học</option>
                  <option value="Tạm dừng">Tạm dừng</option>
                </Form.Select>
              </Form.Group>

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

        {/* Modal xoá sinh viên */}
        <Modal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          backdrop="static"
          centered
        >
          <Modal.Header closeButton className="bg-danger text-white">
            <Modal.Title>Xoá sinh viên</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nhập MSSV để tìm kiếm sinh viên cần xoá</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ví dụ: 20120123"
                value={deleteSearchQuery}
                onChange={(e) => setDeleteSearchQuery(e.target.value)}
                autoFocus
              />
            </Form.Group>

            {filteredStudentsToDelete.length > 0 ? (
              <>
                <div className="mb-2">Chọn sinh viên để xoá:</div>
                <ListGroup
                  className="mb-3 student-delete-list"
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
                  {filteredStudentsToDelete.map((student) => (
                    <ListGroup.Item
                      key={student.id}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`check-${student.id}`}
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => handleStudentSelection(student.id)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`check-${student.id}`}
                        >
                          {student.id} - {student.fullName}
                        </label>
                      </div>
                      <div className="text-muted small">
                        {student.faculty}, {student.batch}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>

                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Huỷ
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleDeleteStudents}
                    disabled={selectedStudents.length === 0}
                  >
                    Xoá{" "}
                    {selectedStudents.length > 0
                      ? `(${selectedStudents.length})`
                      : ""}
                  </Button>
                </div>
              </>
            ) : deleteSearchQuery.trim() ? (
              <div className="alert alert-info">
                Không tìm thấy sinh viên nào với MSSV chứa "{deleteSearchQuery}"
              </div>
            ) : null}
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default StudentTable;
