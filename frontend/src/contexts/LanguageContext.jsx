import { createContext, useState } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('vi'); // Ngôn ngữ mặc định là 'vi'

  return (
      <LanguageContext.Provider value={{ language, setLanguage }}>
          {children}
      </LanguageContext.Provider>
  );
};