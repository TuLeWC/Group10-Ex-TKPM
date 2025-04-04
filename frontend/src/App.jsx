import './App.scss';
import StudentTable from './pages/StudentTable';
import EditStudent from './pages/EditStudent';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {StudentProvider} from './contexts/StudentContext';
import { Faculty } from './pages/Faculty';
import { StudentStatus } from './pages/StudentStatus';
import { Program } from './pages/Program';
import StudentDetail from './pages/StudentDetail';
import Import from './pages/Import';
import { MailDomain } from './pages/MailDomain';
import { PhoneCode } from './pages/PhoneCode';
import { StudentStatusRule } from './pages/StudentStatusRule';
import { Header } from './components/header/Header';

function App() {
  return (
    <StudentProvider>
      <Router>
        <Header/>
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
