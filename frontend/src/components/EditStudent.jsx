import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import StudentContext from '../contexts/StudentContext';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDataFromAPI, putDataToAPI } from '../ultis/api';
import { Button, Col, Form, Row } from 'react-bootstrap';
import useFetch from '../hooks/useFetch';
import { ToastContainer, toast } from 'react-toastify';

const EditStudent = () => {
  const { id } = useParams();
  const [student, setStudent] = useState({
    studentId: '',
    fullName: '',
    dateOfBirth: '',
    gender: '',
    faculty: '',
    batch: '',
    program: '',
    addresses: {
      permanent: { houseNumber: "", street: "", district: "", city: "", country: "" },
      temporary: { houseNumber: "", street: "", district: "", city: "", country: "" },
      mailing: { houseNumber: "", street: "", district: "", city: "", country: "" },
    },
    email: '',
    phoneNumber: '',
    studentStatus: '',
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
    nationality: '',
    country: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: faculties, isLoading: isLoadingFaculties, error: errorFaculties } = useFetch("/api/faculties/");
  const { data: programs, isLoading: isLoadingPrograms, error: errorPrograms } = useFetch("/api/programs/");
  const { data: listStatus, isLoading: isLoadingListStatus, error: errorListStatus } = useFetch("/api/student-statuses/");
  const {
    data: listEmailDomains,
    isLoading: isLoadingEmailDomains,
    error: errorEmailDomains,
  } = useFetch("/api/email-configs/");
  const {
    data: listPhoneConfigs,
    isLoading: isLoadingPhoneConfigs,
    error: errorPhoneConfigs,
  } = useFetch("/api/phone-configs/");
  const {
    data: listStatusTransitions,
    isLoading: isLoadingStatusTransitions,
    error: errorStatusTransitions,
  } = useFetch("/api/status-transitions/");

  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [currentStudentStatusId, setCurrentStudentStatusId] = useState("");
  const notify = (text) => toast(text);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setStudent(null);
      setError(null);
      try {
        const response = await fetchDataFromAPI(`/api/students/${id}`);
        console.log(response);
        setStudent({ ...response, faculty: response?.faculty?._id, program: response?.program?._id, studentStatus: response?.studentStatus?._id });
        setCurrentStudentStatusId(response?.studentStatus?._id);
      } catch (error) {
        setError(error?.message || "API call failed");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (student?.email) {
      validateEmail(student.email);
    }
  }, [student?.email, listEmailDomains]);

  // Form validation
  const [validated, setValidated] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "phoneNumber") {
      validatePhone(value, student.country);
    } else if (name === "country") {
      validatePhone(student.phoneNumber, value);
    } else if (name === "email") {
      validateEmail(value);
    }
  };

  // validate email
  const validateEmail = (email) => {
    if (!listEmailDomains || listEmailDomains.length === 0) {
      setEmailError(""); // Không kiểm tra nếu danh sách domain rỗng
      return;
    }
    
    const emailParts = email.split("@");
    if (emailParts.length === 2) {
      const domain = emailParts[1];
      const isValidDomain = listEmailDomains.some(d => d.domain === domain);
        if (!isValidDomain) {
        setEmailError(`Email phải thuộc các domain: ${listEmailDomains.map(d => d.domain).join(", ")}`);
      } else {
        setEmailError("");
      }
    } else {
      setEmailError("Vui lòng nhập email hợp lệ");
    }
  }

  // Kiểm tra số điện thoại theo regex của quốc gia đã chọn
  const validatePhone = (phone, country) => {
    if (!listPhoneConfigs || listPhoneConfigs.length === 0) {
      setPhoneError(""); // Không kiểm tra nếu danh sách cấu hình phone rỗng
      return;
    }

    const selectedCountry = listPhoneConfigs.find(c => c.country === country);
    if (selectedCountry && !new RegExp(selectedCountry.regexPattern).test(phone)) {
      setPhoneError(`Số điện thoại không hợp lệ cho ${country}`);
    } else {
      setPhoneError("");
    }
  };

  // Handle form input address change
  const handleAddressChange = (e, type) => {
    const { name, value } = e.target;
    setStudent((prev) => ({
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

    if (emailError || phoneError) {
      e.stopPropagation();
      return;
    }

    // Add new student to context
    const studentData = {
      studentId: student.studentId,
      fullName: student.fullName,
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
      faculty: student.faculty || student.faculty?.name,
      program: student.program || student.program?.name, // Chương trình học
      studentStatus: student?.studentStatus  || student?.studentStatus?.status, // Trạng thái sinh viên (_id)
      addresses: student.addresses, // Địa chỉ sinh viên
      idDocument: student.idDocument, // Thông tin giấy tờ
      email: student.email,
      phoneNumber: student.phoneNumber,
      nationality: student.nationality,
    };
    console.log(studentData);

    try {
      const response = await putDataToAPI(`/api/students/${id}`, studentData);
      console.log(response);
      notify("Cập nhật sinh viên thành công");

      // Chỉ reset khi không có lỗi
      setValidated(false);
      setTimeout(() => {
        navigate('/')
      }, 1200);
    } catch (error) {
      notify(error.message || "Thêm khoa thất bại!");
      console.log(error);
    }
  };

  // Lấy ra danh sách các status có thể chuyển đổi từ status hiện tại
  const getValidStatusOptions = () => {
    if (!listStatusTransitions || listStatusTransitions.length === 0 || !currentStudentStatusId) { 
      return listStatus || [];
    }
  
    // Có rule => Lọc theo trạng thái hiện tại
    const filteredStatuses = listStatusTransitions
      .filter(rule => rule?.fromStatus?._id === currentStudentStatusId)
      .map(rule => rule?.toStatus);

    return filteredStatuses.length > 0 ? filteredStatuses : listStatus;
  };
  
  const validStatusOptions = getValidStatusOptions();

  return (
    <>
    <div className="container-xl px-4 mt-4">
      <button
        className="btn btn-primary"
        type="button"
        onClick={() => navigate('/')}
      >
        Back
      </button>
      <h4 className="mt-4">Cập nhật sinh viên</h4>
      <hr className="mt-0 mb-4" />
      <div className="row">
        <div className="col-xl-4">
          <div className="card mb-4 mb-xl-0">
            <div className="card-header">Profile Picture</div>
            <div className="card-body text-center">
              <img
                className="img-account-profile rounded-circle mb-2"
                src="http://bootdey.com/img/Content/avatar/avatar1.png"
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="col-xl-8">
          <div className="card mb-4">
            <div className="card-header">Thông tin chi tiết</div>
            <div className="card-body">
              {error && <p className="text-danger">Có lỗi xảy ra: {error}</p>}
              {!isLoading && student && 
              (
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
                {/* MSSV */}
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      MSSV <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="studentId"
                      value={student.studentId}
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
                      value={student.fullName}
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
                      value={student.nationality}
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
                      value={student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split("T")[0] : ""}
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
                      value={student.gender}
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
                      value={student?.faculty}
                      onChange={handleInputChange}
                    >
                      <option value="">
                        Chọn khoa
                      </option>
                      {isLoadingFaculties && !faculties ? (
                        <option disabled>Đang tải danh sách khoa...</option>
                      ) : (
                        faculties?.map((faculty) => (
                          <option key={faculty?._id} value={faculty?._id}>
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
                      value={student.batch || "2021"}
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
                      value={student.program}
                      onChange={handleInputChange}
                    >
                      <option value="">
                        Chọn chương trình
                      </option>
                      {isLoadingPrograms && !programs ? (
                        <option disabled>Đang tải danh sách chương trình...</option>
                      ) : (
                        programs?.map((program) => (
                          <option key={program?._id} value={program?._id}>
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
                      value={student.addresses.permanent.houseNumber}
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
                      value={student.addresses.permanent.street}
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
                      value={student.addresses.permanent.district}
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
                      value={student.addresses.permanent.city}
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
                      value={student.addresses.permanent.country}
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
                      value={student.addresses.temporary.houseNumber}
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
                      value={student.addresses.temporary.street}
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
                      value={student.addresses.temporary.district}
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
                      value={student.addresses.temporary.city}
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
                      value={student.addresses.temporary.country}
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
                      value={student.addresses.mailing.houseNumber}
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
                      value={student.addresses.mailing.street}
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
                      value={student.addresses.mailing.district}
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
                      value={student.addresses.mailing.city}
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
                      value={student.addresses.mailing.country}
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
                    value={student.idDocument.type}
                    onChange={(e) => setStudent(prev => ({
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

              {student.idDocument.type && (
                <>
                  {/* Số giấy tờ */}
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>Số giấy tờ:</Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        required
                        type="text"
                        value={student.idDocument.idNumber}
                        onChange={(e) => setStudent(prev => ({
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
                          value={student.idDocument.issuedDate ? new Date(student.idDocument.issuedDate).toISOString().split("T")[0] : ""}
                          onChange={(e) => setStudent(prev => ({
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
                          value={student.idDocument.expiryDate ? new Date(student.idDocument.expiryDate).toISOString().split("T")[0] : ""}
                          onChange={(e) => setStudent(prev => ({
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
                        value={student.idDocument.issuedPlace}
                        onChange={(e) => setStudent(prev => ({
                          ...prev, idDocument: { ...prev.idDocument, issuedPlace: e.target.value }
                        }))}
                      />
                    </Col>
                  </Form.Group>
                </>
              )}

              {student.idDocument.type === "CCCD" && (
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={2}>Có gắn chip:</Form.Label>
                  <Col sm={10}>
                    <Form.Check
                      type="checkbox"
                      checked={student.idDocument.hasChip}
                      onChange={(e) => setStudent(prev => ({
                        ...prev, idDocument: { ...prev.idDocument, hasChip: e.target.checked }
                      }))}
                    />
                  </Col>
                </Form.Group>
              )}

              {student.idDocument.type === "Passport" && (
                <>
                  {/* Quốc gia cấp */}
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>Quốc gia cấp:</Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        required
                        type="text"
                        value={student.idDocument.issuedCountry}
                        onChange={(e) => setStudent(prev => ({
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
                        value={student.idDocument.notes}
                        onChange={(e) => setStudent(prev => ({
                          ...prev, idDocument: { ...prev.idDocument, notes: e.target.value }
                        }))}
                      />
                    </Col>
                  </Form.Group>
                </>
              )}

              <Row>
                {/* Email */}
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Email <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      required
                      type="email"
                      name="email"
                      pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                      value={student.email}
                      onChange={handleInputChange}
                      placeholder="example@gmail.com"
                      isInvalid={!!emailError}
                    />
                    <Form.Control.Feedback type="invalid">
                      {emailError}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
                    
              <Row>
                {/* Phone */}
                {listPhoneConfigs && listPhoneConfigs.length > 0 &&        
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Chọn Quốc Gia cho SĐT <span className="text-danger">*</span></Form.Label>
                    <Form.Select name="country" value={student.country} onChange={handleInputChange} required>
                      <option value="">
                        Chọn quốc gia
                      </option>
                      {listPhoneConfigs && listPhoneConfigs.map((c, index) => (
                        <option key={index} value={c.country}>
                          {c.country}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                }
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Số điện thoại <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      required
                      type="tel"
                      pattern="^\d+$"
                      name="phoneNumber"
                      value={student.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Nhập số điện thoại"
                      isInvalid={!!phoneError}
                    />
                    <Form.Control.Feedback type="invalid">
                      {phoneError}
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
                  name="studentStatus"
                  value={student.studentStatus}
                  onChange={handleInputChange}
                >
                  <option value="">
                      Chọn tình trạng
                  </option>
                  {isLoadingListStatus && !listStatus ? (
                    <option disabled>Đang tải danh sách tình trạng...</option>
                  ) : (
                    validStatusOptions?.map((status) => (
                      <option key={status?._id} value={status?._id}>
                        {status.status}
                      </option>
                    ))
                  )}
                </Form.Select>
                </Form.Group>
                  
                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button variant="secondary" onClick={() => navigate('/')}>
                    Hủy
                  </Button>
                  <Button variant="primary" type="submit">
                    Lưu
                  </Button>
                </div>

              </Form>      
              
              )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
    <ToastContainer />
    </>
  );
};

export default EditStudent;
