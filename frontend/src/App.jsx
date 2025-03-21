import './App.scss';
import StudentTable from './components/StudentTable';
import EditStudent from './components/EditStudent';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {StudentProvider} from './contexts/StudentContext';
import Import from './components/Import';

function App() {
  return (
    <StudentProvider>
      <Router>
        <Routes>
          <Route path="/" element={<StudentTable />} />
          <Route path='/import' element={<Import />} />
          <Route path="/edit/:id" element={<EditStudent />} />
        </Routes>
      </Router>
    </StudentProvider>
  );
}

export default App;
