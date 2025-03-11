import { createContext, useState } from 'react';

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([
    {
      id: 21120569,
      fullName: 'Lê Văn Luyện',
      dateOfBirth: '6/9/2003',
      gender: 'Nam',
      faculty: 'Luật',
      batch: 2021,
      program: 'Đại trà',
      address: 'phường Linh Trung, Thành phố Thủ Đức, Thành Phố Hồ Chí Minh',
      email: 'levanluyen@gmail.com',
      phone: '0123456789',
      status: 'Đang học',
    },
  ]);

  const value = {
    students,
    setStudents,
  };
  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  );
};

export default StudentContext;
