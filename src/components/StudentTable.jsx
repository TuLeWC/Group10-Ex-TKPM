import { useContext, useState } from 'react';
import Table from 'react-bootstrap/Table';
import StudentContext from '../contexts/StudentContext';

const StudentTable = () => {
  const { students } = useContext(StudentContext);

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
    <>
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
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
};

export default StudentTable;
