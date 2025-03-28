import './App.scss';
import StudentTable from './components/StudentTable';
import EditStudent from './components/EditStudent';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {StudentProvider} from './contexts/StudentContext';
import { Faculty } from './components/Faculty';
import { StudentStatus } from './components/StudentStatus';
import { Program } from './components/Program';
import StudentDetail from './components/StudentDetail';
import Import from './components/Import';
import { MailDomain } from './components/MailDomain';
import { PhoneCode } from './components/PhoneCode';
import { StudentStatusRule } from './components/StudentStatusRule';

function App() {
  return (
    <StudentProvider>
      <Router>
        <Routes>
          <Route path="/" element={<StudentTable />} />
          <Route path="/students/:id" element={<StudentDetail />} />
          <Route path='/import' element={<Import />} />
          <Route path="/edit/:id" element={<EditStudent />} />
          <Route path="/faculty" element={<Faculty/>} />
          <Route path="/student-status" element={<StudentStatus/>} />
          <Route path="/program" element={<Program/>} />
          <Route path="/mail-domain" element={<MailDomain/>} />
          <Route path="/phone-code" element={<PhoneCode />} />
          <Route path="/student-status-rule" element={<StudentStatusRule/>} />
        </Routes>
      </Router>
    </StudentProvider>
  );
}

export default App;
