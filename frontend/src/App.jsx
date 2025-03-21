import './App.scss';
import StudentTable from './components/StudentTable';
import EditStudent from './components/EditStudent';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {StudentProvider} from './contexts/StudentContext';
import { Faculty } from './components/Faculty';
import { StudentStatus } from './components/StudentStatus';
import { Program } from './components/Program';
import StudentDetail from './components/StudentDetail';

function App() {
  return (
    <StudentProvider>
      <Router>
        <Routes>
          <Route path="/" element={<StudentTable />} />
          <Route path="/students/:id" element={<StudentDetail />} />
          <Route path="/edit/:id" element={<EditStudent />} />
          <Route path="/faculty" element={<Faculty/>} />
          <Route path="/student-status" element={<StudentStatus/>} />
          <Route path="/program" element={<Program/>} />
        </Routes>
      </Router>
    </StudentProvider>
  );
}

export default App;
