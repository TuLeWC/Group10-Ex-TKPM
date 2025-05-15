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
import { CoursesTable } from './pages/Courses/CoursesTable';
import { AddCourse } from './pages/Courses/AddCourse';
import { EditCourse } from './pages/Courses/EditCourse';
import { ClassTable } from './pages/Class/ClassTable';
import { AddClass } from './pages/Class/AddClass';
import StudentEnrollment from './pages/StudentEnrollment';
import { GeneralSettings } from './pages/Settings/GeneralSettings';

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
          <Route path="/courses" element={<CoursesTable/>} />
          <Route path="/add-course" element={<AddCourse/>} />
          <Route path="/edit-courses/:id" element={<EditCourse/>} />
          <Route path="/classes" element={<ClassTable/>} />
          <Route path="/add-class" element={<AddClass/>} />
          <Route path="/student-enrollment/:id" element={<StudentEnrollment/>} />
          <Route path="/general-settings" element={<GeneralSettings/>} />
        </Routes>
      </Router>
    </StudentProvider>
  );
}

export default App;
