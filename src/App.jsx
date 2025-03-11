import './App.scss';
import { Container } from 'react-bootstrap';
import StudentTable from './components/StudentTable';

function App() {
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
            <button type="button" class="btn btn-warning">
              Cập nhật sinh viên
            </button>
          </div>
        </div>

        <StudentTable />
      </Container>
    </div>
  );
}

export default App;
