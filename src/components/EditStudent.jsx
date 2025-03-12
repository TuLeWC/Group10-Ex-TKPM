import React, { useState } from 'react'
import { useContext} from 'react';
import StudentContext from '../contexts/StudentContext';
import { useParams, useNavigate } from "react-router-dom";

const EditStudent = () => {
    const { students, setStudents} = useContext(StudentContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const studentToEdit = students.find((s) => s.id === parseInt(id));
    const [student, setStudent] = useState(studentToEdit || {});

    const faculties = ["Luật", "Tiếng Anh thương mại", "Tiếng Nhật", "Tiếng Pháp"];
    const statuses = ["Đang học", "Đã tốt nghiệp", "Đã thôi học", "Tạm dừng học"];

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]+$/;
    
        if (!emailRegex.test(student.email)) {
          alert("Email không hợp lệ!");
          return false;
        }
    
        if (!phoneRegex.test(student.phone)) {
          alert("Số điện thoại không hợp lệ!");
          return false;
        }
    
        if (!faculties.includes(student.faculty)) {
          alert("Tên khoa không hợp lệ!");
          return false;
        }
    
        if (!statuses.includes(student.status)) {
          alert("Tình trạng sinh viên không hợp lệ!");
          return false;
        }
    
        return true;
    };
    
    const handleSave = () => {
        if (!validateForm()) return;

        setStudents((prevStudents) =>
            prevStudents.map((s) => (s.id === student.id ? student : s))
        );

        navigate("/");
    };

    return (
        <div class="container-xl px-4 mt-4">
            <button class="btn btn-primary" type="button" onClick={() => navigate("/")}>Back</button>
            <h4 class="mt-4">Cập nhật sinh viên</h4>
        <hr class="mt-0 mb-4"/>
        <div class="row">
            <div class="col-xl-4">
                <div class="card mb-4 mb-xl-0">
                    <div class="card-header">Profile Picture</div>
                    <div class="card-body text-center">
                        <img class="img-account-profile rounded-circle mb-2" src="http://bootdey.com/img/Content/avatar/avatar1.png" alt=""/>
                    </div>
                </div>
            </div>
            <div class="col-xl-8">
                <div class="card mb-4">
                    <div class="card-header">Thông tin chi tiết</div>
                    <div class="card-body">
                        <form>
                            <div class="mb-3">
                                <label class="small mb-1" for="inputMSSV">MSSV</label>
                                <input class="form-control" id="inputMSSV" type="text" placeholder="Nhập MSSV" value={student.id || ""} readOnly/>
                            </div>
                            <div class="row gx-3 mb-3">
                                <div class="col-md-6">
                                    <label class="small mb-1" for="inputName">Họ tên</label>
                                    <input class="form-control" id="inputName" type="text" placeholder="Nhập Họ tên" value={student.fullName || ""}
                                        onChange={(e) => setStudent({ ...student, fullName: e.target.value })}
                                    />
                                </div>
                                <div class="col-md-6">
                                    <label class="small mb-1" for="inputLastName">Ngày sinh</label>
                                    <input class="form-control" id="inputLastName" type="date" placeholder="Chọn Ngày sinh" value={student.dateOfBirth || ""}
                                        onChange={(e) => setStudent({ ...student, dateOfBirth: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div class="row gx-3 mb-3">
                                <div class="col-md-6">
                                    <label class="small mb-1 me-2" for="inputOrgName">Giới tính: </label>
                                    <select
                                        value={student.gender || ""}
                                        onChange={(e) => setStudent({ ...student, gender: e.target.value })}
                                        >
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="small mb-1 me-2" for="inputLocation">Khoa</label>
                                    <select
                                        value={student.faculty || ""}
                                        onChange={(e) => setStudent({ ...student, faculty: e.target.value })}
                                        >
                                        {faculties.map((faculty) => (
                                            <option key={faculty} value={faculty}>
                                            {faculty}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div class="row gx-3 mb-3">
                                <div class="col-md-6">
                                    <label class="small mb-1" for="inputOrgName">Khoá</label>
                                    <input class="form-control" id="inputOrgName" type="number" placeholder="Chọn Khoá" value={student.batch || ""}
                                        onChange={(e) => setStudent({ ...student, batch: e.target.value })}
                                    />
                                </div>
                                <div class="col-md-6">
                                    <label class="small mb-1" for="inputLocation">Chương trình</label>
                                    <input class="form-control" id="inputLocation" type="text" placeholder="Chọn Chương trình" value={student.program || ""}
                                        onChange={(e) => setStudent({ ...student, program: e.target.value })} 
                                    />
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="small mb-1" for="inputEmailAddress">Địa chỉ</label>
                                <input class="form-control" id="inputEmailAddress" type="email" placeholder="Nhập Địa chỉ" value={student.address || ""}
                                    onChange={(e) => setStudent({ ...student, address: e.target.value })} 
                                />
                            </div>
                            <div class="row gx-3 mb-3">
                                <div class="col-md-6">
                                    <label class="small mb-1" for="inputPhone">Email</label>
                                    <input class="form-control" id="inputPhone" type="email" placeholder="Nhập Email" value={student.email || ""}
                                        onChange={(e) => setStudent({ ...student, email: e.target.value })} 
                                    />
                                </div>
                                <div class="col-md-6">
                                    <label class="small mb-1" for="inputBirthday">SĐT</label>
                                    <input class="form-control" id="inputBirthday" type="text" name="birthday" placeholder="Nhập SĐT" value={student.phone || ""}
                                        onChange={(e) => setStudent({ ...student, phone: e.target.value })} 
                                    />
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="small mb-1 me-2" for="inputEmailAddress">Tình trạng</label>
                                <select
                                    value={student.status || ""}
                                    onChange={(e) => setStudent({ ...student, status: e.target.value })}
                                    >
                                    {statuses.map((status) => (
                                        <option key={status} value={status}>
                                        {status}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button class="btn btn-primary" type="button" onClick={handleSave}>Save changes</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default EditStudent;
