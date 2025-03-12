import { useContext, useState } from 'react';
import Table from 'react-bootstrap/Table';
import StudentContext from '../contexts/StudentContext';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const StudentTable = () => {
  const { students } = useContext(StudentContext);
  const navigate = useNavigate();

  // Filter student list by search query
  const [searchQuery, setSearchQuery] = useState('');
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

  return (
    <div className="mt-5">
      <Container>
        <div className="d-flex justify-content-between mb-2">
            <h2>Danh sách sinh viên:</h2>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-primary">
                Thêm sinh viên
              </button>
              <button type="button" className="btn btn-danger">
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
                  <button type="button" class="btn btn-warning"
                    onClick={() => navigate(`/edit/${student.id}`)}
                  >
                    Cập nhật
                  </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Container>
    </div>
      
  );
};

export default StudentTable;
