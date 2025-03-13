import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import StudentContext from '../contexts/StudentContext';
import { useParams, useNavigate } from 'react-router-dom';

const EditStudent = () => {
  const { students, setStudents } = useContext(StudentContext);
  const { id } = useParams();
  const navigate = useNavigate();

  // const studentToEdit = students.find((s) => s.id === parseInt(id));
  const [student, setStudent] = useState({});

  useEffect(() => {
    const studentToEdit = students.find((s) => String(s.id) === String(id));
    if (studentToEdit) {
      setStudent(studentToEdit);
    }
  }, [students, id]);

  const faculties = [
    'Luật',
    'Tiếng Anh thương mại',
    'Tiếng Nhật',
    'Tiếng Pháp',
  ];
  const statuses = ['Đang học', 'Đã tốt nghiệp', 'Đã thôi học', 'Tạm dừng học'];

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]+$/;

    if (!emailRegex.test(student.email)) {
      alert('Email không hợp lệ!');
      return false;
    }

    if (!phoneRegex.test(student.phone)) {
      alert('Số điện thoại không hợp lệ!');
      return false;
    }

    if (!faculties.includes(student.faculty)) {
      alert('Tên khoa không hợp lệ!');
      return false;
    }

    if (!statuses.includes(student.status)) {
      alert('Tình trạng sinh viên không hợp lệ!');
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    setStudents((prevStudents) =>
      prevStudents.map((s) => (s.id === student.id ? student : s))
    );

    navigate('/');
  };

  return (
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
              <form>
                <div className="mb-3">
                  <label className="small mb-1" htmlFor="inputMSSV">
                    MSSV
                  </label>
                  <input
                    className="form-control"
                    id="inputMSSV"
                    type="text"
                    placeholder="Nhập MSSV"
                    value={student.id || ''}
                    readOnly
                  />
                </div>
                <div className="row gx-3 mb-3">
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="inputName">
                      Họ tên
                    </label>
                    <input
                      className="form-control"
                      id="inputName"
                      type="text"
                      placeholder="Nhập Họ tên"
                      value={student.fullName || ''}
                      onChange={(e) =>
                        setStudent({ ...student, fullName: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="inputLastName">
                      Ngày sinh
                    </label>
                    <input
                      className="form-control"
                      id="inputLastName"
                      type="date"
                      placeholder="Chọn Ngày sinh"
                      value={student.dateOfBirth || ''}
                      onChange={(e) =>
                        setStudent({ ...student, dateOfBirth: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="row gx-3 mb-3">
                  <div className="col-md-6">
                    <label className="small mb-1 me-2" htmlFor="inputOrgName">
                      Giới tính:{' '}
                    </label>
                    <select
                      value={student.gender || ''}
                      onChange={(e) =>
                        setStudent({ ...student, gender: e.target.value })
                      }
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="small mb-1 me-2" htmlFor="inputLocation">
                      Khoa
                    </label>
                    <select
                      value={student.faculty || ''}
                      onChange={(e) =>
                        setStudent({ ...student, faculty: e.target.value })
                      }
                    >
                      {faculties.map((faculty) => (
                        <option key={faculty} value={faculty}>
                          {faculty}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="row gx-3 mb-3">
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="inputOrgName">
                      Khoá
                    </label>
                    <input
                      className="form-control"
                      id="inputOrgName"
                      type="number"
                      placeholder="Chọn Khoá"
                      value={student.batch || ''}
                      onChange={(e) =>
                        setStudent({ ...student, batch: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="inputLocation">
                      Chương trình
                    </label>
                    <input
                      className="form-control"
                      id="inputLocation"
                      type="text"
                      placeholder="Chọn Chương trình"
                      value={student.program || ''}
                      onChange={(e) =>
                        setStudent({ ...student, program: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="small mb-1" htmlFor="inputEmailAddress">
                    Địa chỉ
                  </label>
                  <input
                    className="form-control"
                    id="inputEmailAddress"
                    type="email"
                    placeholder="Nhập Địa chỉ"
                    value={student.address || ''}
                    onChange={(e) =>
                      setStudent({ ...student, address: e.target.value })
                    }
                  />
                </div>
                <div className="row gx-3 mb-3">
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="inputPhone">
                      Email
                    </label>
                    <input
                      className="form-control"
                      id="inputPhone"
                      type="email"
                      placeholder="Nhập Email"
                      value={student.email || ''}
                      onChange={(e) =>
                        setStudent({ ...student, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="inputBirthday">
                      SĐT
                    </label>
                    <input
                      className="form-control"
                      id="inputBirthday"
                      type="text"
                      name="birthday"
                      placeholder="Nhập SĐT"
                      value={student.phone || ''}
                      onChange={(e) =>
                        setStudent({ ...student, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label
                    className="small mb-1 me-2"
                    htmlFor="inputEmailAddress"
                  >
                    Tình trạng
                  </label>
                  <select
                    value={student.status || ''}
                    onChange={(e) =>
                      setStudent({ ...student, status: e.target.value })
                    }
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleSave}
                >
                  Save changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStudent;
