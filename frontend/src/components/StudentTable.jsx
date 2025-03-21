import { useContext, useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import {
  Container,
  Modal,
  Form,
  Button,
  Row,
  Col,
  ListGroup,
} from 'react-bootstrap';
import StudentContext from '../contexts/StudentContext';
import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { deleteDataAPI, postDataToAPI } from '../ultis/api';
import { ToastContainer, toast } from 'react-toastify';

const StudentTable = () => {
  // const { students, setStudents } = useContext(StudentContext);
  const { data: initialStudents, isLoading: isLoadingStudents, error: errorStudents } = useFetch("/api/students/");
  const { data: faculties, isLoading: isLoadingFaculties, error: errorFaculties } = useFetch("/api/faculties/");
  const { data: programs, isLoading: isLoadingPrograms, error: errorPrograms } = useFetch("/api/programs/");
  const { data: listStatus, isLoading: isLoadingListStatus, error: errorListStatus } = useFetch("/api/student-statuses/");

  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchInput, setSearchInput] = useState(""); // MSSV hoặc Họ tên
  const [searchFaculty, setSearchFaculty] = useState(""); // Khoa
  const notify = (text) => toast(text);

  useEffect(() => {
    if (initialStudents) {
      setStudents(initialStudents);
      setFilteredStudents(initialStudents);
    }
  }, [initialStudents]);

  const handleSearch = () => {
    let result = students;
    console.log(searchInput, searchFaculty);

    if (searchInput) {
      result = result.filter(
        (student) =>
          student.studentId.includes(searchInput) || 
          student.fullName.toLowerCase().includes(searchInput.toLowerCase())
      );
    }

    if (searchFaculty) {
      result = result.filter((student) => 
      (student.faculty?.name ?? "").toLowerCase().includes(searchFaculty.toLowerCase())
      );
    }

    setFilteredStudents(result);
  };
    

  // Modal control
  const [showModal, setShowModal] = useState(false);

  // New student form data
  const [newStudent, setNewStudent] = useState({
    id: '',
    fullName: '',
    dateOfBirth: '',
    gender: 'Nam',
    faculty: '',
    batch: '',
    program: '',
    addresses: {
      permanent: { houseNumber: "", street: "", district: "", city: "", country: "" },
      temporary: { houseNumber: "", street: "", district: "", city: "", country: "" },
      mailing: { houseNumber: "", street: "", district: "", city: "", country: "" },
    },
    email: '',
    phone: '',
    status: '',
    idDocument: {
      type: "CCCD",
      idNumber: "",
      issuedDate: "",
      expiryDate: "",
      issuedPlace: "",
      hasChip: false, // Chỉ áp dụng cho CCCD
      issuedCountry: "", // Chỉ áp dụng cho Passport
      notes: "", // Chỉ áp dụng cho Passport
    },
    nationality: ''
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

  // Handle form input address change
  const handleAddressChange = (e, type) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({
      ...prev,
      addresses: {
        ...prev.addresses,
        [type]: { ...prev.addresses[type], [name]: value },
      },
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

    // Add new student to context
    const studentData = {
      studentId: newStudent.id,
      fullName: newStudent.fullName,
      dateOfBirth: newStudent.dateOfBirth,
      gender: newStudent.gender,
      faculty: newStudent.faculty,
      program: newStudent.program, // Chương trình học
      studentStatus: newStudent.status, // Trạng thái sinh viên (_id)
      addresses: newStudent.addresses, // Địa chỉ sinh viên
      idDocument: newStudent.idDocument, // Thông tin giấy tờ
      email: newStudent.email,
      phoneNumber: newStudent.phone,
      nationality: newStudent.nationality,
    };

    console.log(studentData);

    try {
      const response = await postDataToAPI("/api/students/", studentData);
      console.log(response);
      setStudents((prevStudents) => [...prevStudents, response]);
      setFilteredStudents((prevFiltered) => [...prevFiltered, response]);
      notify("Thêm sinh viên thành công!");

      // Chỉ reset khi không có lỗi
      setValidated(false);
      setShowModal(false);
    } catch (error) {
      notify(error.message || "Thêm sinh viên thất bại!");
      console.log(error);
    }

    // Reset form and close modal
    setNewStudent({
      id: '',
      fullName: '',
      dateOfBirth: '',
      gender: 'Nam',
      faculty: '',
      batch: '',
      program: '',
      addresses: {
        permanent: { houseNumber: "", street: "", district: "", city: "", country: "" },
        temporary: { houseNumber: "", street: "", district: "", city: "", country: "" },
        mailing: { houseNumber: "", street: "", district: "", city: "", country: "" },
      },
      email: '',
      phone: '',
      status: '',
      idDocument: {
        type: "CCCD",
        idNumber: "",
        issuedDate: "",
        expiryDate: "",
        issuedPlace: "",
        hasChip: false, // Chỉ áp dụng cho CCCD
        issuedCountry: "", // Chỉ áp dụng cho Passport
        notes: "", // Chỉ áp dụng cho Passport
      },
      nationality: ''
    });
    setValidated(false);
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Bạn có chắc muốn xóa sinh viên có mssv ${id}?`)) return;
  
    try {
      const response = await deleteDataAPI(`/api/students/${id}`);
      console.log(response);
      notify("Xoá sinh viên thành công!");

      // Cập nhật danh sách sinh viên sau khi xóa thành công
      setStudents((prevStudents) => prevStudents.filter((student) => student.studentId !== id));
      setFilteredStudents((prevFiltered) => prevFiltered.filter((student) => student.studentId !== id));

    } catch (error) {
      notify(error.message || "Xoá sinh viên thất bại!");
      console.error("Lỗi khi xóa sinh viên:", error);
    }
  };

  return (
    <div className="mt-5">
      <Container>
        <div className="d-flex justify-content-between mb-2">
          <h2>Danh sách sinh viên:</h2>
          <div className="d-flex gap-2">
            <button
              onClick={() => navigate(`/faculty`)}
              type="button"
              className="btn btn-success"
            >
              Quản lý Khoa
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
        </div>
        <div className="d-flex justify-content-between mb-2">
          <div className="col-8 d-flex align-items-center">
            <input
              className="form-control mb-2 "
              type="text"
              placeholder="Tìm kiếm theo tên hoặc mssv"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
            />

            <select className='form-control ms-2' value={searchFaculty} onChange={(e) => setSearchFaculty(e.target.value)}>
              <option value="">Chọn khoa</option>
              {faculties && faculties.map((faculty) => (
                <option key={faculty._id} value={faculty.name}>{faculty.name}</option>
              ))}
            </select>

            <Button className='ms-2' onClick={handleSearch}>Tìm kiếm</Button>
          </div>
          <div className="col-4 d-flex gap-2 justify-content-end">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              Thêm sinh viên
            </button>
          </div>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>MSSV</th>
              <th>Họ tên</th>
              <th>Ngày sinh</th>
              <th>Giới tính</th>
              <th>Khoa</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {errorStudents && <p className="text-danger">Có lỗi xảy ra: {errorStudents || ""}</p>}
            {!isLoadingStudents && !errorStudents && filteredStudents &&
              filteredStudents.map((student, index) => (
                <tr key={index}>
                  <td>{student.studentId}</td>
                  <td>{student.fullName}</td>
                  <td>{new Date(student.dateOfBirth).toLocaleDateString("vi-VN")}</td>
                  <td>{student.gender}</td>
                  <td>{student.faculty ? student.faculty.name : "null"}</td>
                  <td>{student.email}</td>
                  <td>{student.phoneNumber}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-info me-2"
                      onClick={() => navigate(`/students/${student.studentId}`)}
                    >
                      Xem chi tiết
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning me-2"
                      onClick={() => navigate(`/edit/${student.studentId}`)}
                    >
                      Cập nhật
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleDelete(student.studentId)}
                    >
                      Xoá
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
                {/* MSSV */}
                <Col md={4}>
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

                {/* Name */}
                <Col md={4}>
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

                {/* nationality */}
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Quốc tịch <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="nationality"
                      value={newStudent.nationality}
                      onChange={handleInputChange}
                      placeholder="Nhập Quốc tịch"
                    />
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập quốc tịch
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                {/* DOB */}
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

                {/* Gender */}
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
                {/* Faculty */}
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
                      {isLoadingFaculties && !faculties ? (
                        <option disabled>Đang tải danh sách khoa...</option>
                      ) : (
                        faculties?.map((faculty) => (
                          <option key={faculty._id} value={faculty._id}>
                            {faculty.name}
                          </option>
                        ))
                      )}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Vui lòng chọn khoa
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Batch */}
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

                {/* Program */}
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Chương trình <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      required
                      name="program"
                      value={newStudent.program}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>
                        Chọn chương trình
                      </option>
                      {isLoadingPrograms && !programs ? (
                        <option disabled>Đang tải danh sách chương trình...</option>
                      ) : (
                        programs?.map((program) => (
                          <option key={program._id} value={program._id}>
                            {program.name}
                          </option>
                        ))
                      )}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập chương trình học
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              {/* permanent address */}
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-1">
                    <Form.Label>
                      Địa chỉ thường trú <span className="text-danger">*</span>
                    </Form.Label>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      required
                      type="text"
                      name="houseNumber"
                      value={newStudent.addresses.permanent.houseNumber}
                      onChange={(e) => handleAddressChange(e, "permanent")}
                      placeholder="Số nhà"
                    />
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập số nhà
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      required
                      type="text"
                      name="street"
                      value={newStudent.addresses.permanent.street}
                      onChange={(e) => handleAddressChange(e, "permanent")}
                      placeholder="Tên đường"
                    />
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập tên đường
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      required
                      type="text"
                      name="district"
                      value={newStudent.addresses.permanent.district}
                      onChange={(e) => handleAddressChange(e, "permanent")}
                      placeholder="Quận/Huyện"
                    />
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập quận/huyện
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      required
                      type="text"
                      name="city"
                      value={newStudent.addresses.permanent.city}
                      onChange={(e) => handleAddressChange(e, "permanent")}
                      placeholder="Thành phố"
                    />
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập thành phố
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      required
                      type="text"
                      name="country"
                      value={newStudent.addresses.permanent.country}
                      onChange={(e) => handleAddressChange(e, "permanent")}
                      placeholder="Quốc gia"
                    />
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập quốc gia
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              {/* temporary address */}
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-1">
                    <Form.Label>
                      Địa chỉ tạm trú
                    </Form.Label>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      name="houseNumber"
                      value={newStudent.addresses.temporary.houseNumber}
                      onChange={(e) => handleAddressChange(e, "temporary")}
                      placeholder="Số nhà"
                    />
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập số nhà
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      name="street"
                      value={newStudent.addresses.temporary.street}
                      onChange={(e) => handleAddressChange(e, "temporary")}
                      placeholder="Tên đường"
                    />
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập tên đường
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      name="district"
                      value={newStudent.addresses.temporary.district}
                      onChange={(e) => handleAddressChange(e, "temporary")}
                      placeholder="Quận/Huyện"
                    />
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập quận/huyện
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      name="city"
                      value={newStudent.addresses.temporary.city}
                      onChange={(e) => handleAddressChange(e, "temporary")}
                      placeholder="Thành phố"
                    />
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập thành phố
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      name="country"
                      value={newStudent.addresses.temporary.country}
                      onChange={(e) => handleAddressChange(e, "temporary")}
                      placeholder="Quốc gia"
                    />
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập quốc gia
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              {/* mailing address */}
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-1">
                    <Form.Label>
                      Địa chỉ nhận thư <span className="text-danger">*</span>
                    </Form.Label>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      required
                      type="text"
                      name="houseNumber"
                      value={newStudent.addresses.mailing.houseNumber}
                      onChange={(e) => handleAddressChange(e, "mailing")}
                      placeholder="Số nhà"
                    />
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập số nhà
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      required
                      type="text"
                      name="street"
                      value={newStudent.addresses.mailing.street}
                      onChange={(e) => handleAddressChange(e, "mailing")}
                      placeholder="Tên đường"
                    />
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập tên đường
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      required
                      type="text"
                      name="district"
                      value={newStudent.addresses.mailing.district}
                      onChange={(e) => handleAddressChange(e, "mailing")}
                      placeholder="Quận/Huyện"
                    />
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập quận/huyện
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      required
                      type="text"
                      name="city"
                      value={newStudent.addresses.mailing.city}
                      onChange={(e) => handleAddressChange(e, "mailing")}
                      placeholder="Thành phố"
                    />
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập thành phố
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      required
                      type="text"
                      name="country"
                      value={newStudent.addresses.mailing.country}
                      onChange={(e) => handleAddressChange(e, "mailing")}
                      placeholder="Quốc gia"
                    />
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập quốc gia
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              {/* Option idDocument */}
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2}>Loại giấy tờ:</Form.Label>
                <Col sm={10}>
                  <Form.Select
                    required
                    value={newStudent.idDocument.type}
                    onChange={(e) => setNewStudent(prev => ({
                      ...prev,
                      idDocument: { ...prev.idDocument, type: e.target.value }
                    }))}
                  >
                    <option value="CMND">Chứng minh nhân dân</option>
                    <option value="CCCD">Căn cước công dân</option>
                    <option value="Passport">Hộ chiếu</option>
                  </Form.Select>
                </Col>
              </Form.Group>

              {newStudent.idDocument.type && (
                <>
                  {/* Số giấy tờ */}
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>Số giấy tờ:</Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        required
                        type="text"
                        value={newStudent.idDocument.idNumber}
                        onChange={(e) => setNewStudent(prev => ({
                          ...prev, idDocument: { ...prev.idDocument, idNumber: e.target.value }
                        }))}
                      />
                    </Col>
                  </Form.Group>

                  {/* Ngày cấp - Ngày hết hạn */}
                  <Row className="mb-3">
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label>Ngày cấp:</Form.Label>
                        <Form.Control
                          required
                          type="date"
                          value={newStudent.idDocument.issuedDate}
                          onChange={(e) => setNewStudent(prev => ({
                            ...prev, idDocument: { ...prev.idDocument, issuedDate: e.target.value }
                          }))}
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label>Ngày hết hạn:</Form.Label>
                        <Form.Control
                          required
                          type="date"
                          value={newStudent.idDocument.expiryDate}
                          onChange={(e) => setNewStudent(prev => ({
                            ...prev, idDocument: { ...prev.idDocument, expiryDate: e.target.value }
                          }))}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Nơi cấp */}
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>Nơi cấp:</Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        required
                        type="text"
                        value={newStudent.idDocument.issuedPlace}
                        onChange={(e) => setNewStudent(prev => ({
                          ...prev, idDocument: { ...prev.idDocument, issuedPlace: e.target.value }
                        }))}
                      />
                    </Col>
                  </Form.Group>
                </>
              )}

              {newStudent.idDocument.type === "CCCD" && (
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={2}>Có gắn chip:</Form.Label>
                  <Col sm={10}>
                    <Form.Check
                      type="checkbox"
                      checked={newStudent.idDocument.hasChip}
                      onChange={(e) => setNewStudent(prev => ({
                        ...prev, idDocument: { ...prev.idDocument, hasChip: e.target.checked }
                      }))}
                    />
                  </Col>
                </Form.Group>
              )}

              {newStudent.idDocument.type === "Passport" && (
                <>
                  {/* Quốc gia cấp */}
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>Quốc gia cấp:</Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        required
                        type="text"
                        value={newStudent.idDocument.issuedCountry}
                        onChange={(e) => setNewStudent(prev => ({
                          ...prev, idDocument: { ...prev.idDocument, issuedCountry: e.target.value }
                        }))}
                      />
                    </Col>
                  </Form.Group>

                  {/* Ghi chú */}
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>Ghi chú:</Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        type="text"
                        value={newStudent.idDocument.notes}
                        onChange={(e) => setNewStudent(prev => ({
                          ...prev, idDocument: { ...prev.idDocument, notes: e.target.value }
                        }))}
                      />
                    </Col>
                  </Form.Group>
                </>
              )}

              <Row>
                {/* Email */}
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

                {/* Phone */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Số điện thoại <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      required
                      type="tel"
                      pattern="^\d+$"
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
              
              {/* Status */}
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
        {/* <Modal
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
                  style={{ maxHeight: '300px', overflowY: 'auto' }}
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
                    Xoá{' '}
                    {selectedStudents.length > 0
                      ? `(${selectedStudents.length})`
                      : ''}
                  </Button>
                </div>
              </>
            ) : deleteSearchQuery.trim() ? (
              <div className="alert alert-info">
                Không tìm thấy sinh viên nào với MSSV chứa "{deleteSearchQuery}"
              </div>
            ) : null}
          </Modal.Body>
        </Modal> */}
      </Container>
      <ToastContainer />
    </div>
  );
};

export default StudentTable;
