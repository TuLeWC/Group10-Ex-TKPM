import './App.scss';
import StudentTable from './components/StudentTable';
import EditStudent from './components/EditStudent';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {StudentProvider} from './contexts/StudentContext';

function App() {
  return (
    <StudentProvider>
      <Router>
        <Routes>
          <Route path="/" element={<StudentTable />} />
          <Route path="/edit/:id" element={<EditStudent />} />
        </Routes>
      </Router>
    </StudentProvider>
  );
}

export default App;
