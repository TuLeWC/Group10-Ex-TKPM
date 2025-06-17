import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en_sidebar from './locales/en/sidebar.json';
import en_student_table from './locales/en/student_table.json';
import en_faculty from './locales/en/faculty.json';
import en_student_status from './locales/en/student_status.json';
import en_program from './locales/en/program.json';
import en_mail_domain from './locales/en/mail_domain.json';
import en_phone_code from './locales/en/phone_code.json';
import en_student_status_rule from './locales/en/student_status_rule.json';
import en_general_settings from './locales/en/general_setting.json';
import en_course_table from './locales/en/course_table.json';
import en_class_table from './locales/en/class_table.json';
import en_student_detail from './locales/en/student_detail.json';
import en_import from './locales/en/import.json';
import en_student_enrollment from './locales/en/student_enrollment.json';

import vi_sidebar from './locales/vi/sidebar.json';
import vi_student_table from './locales/vi/student_table.json';
import vi_faculty from './locales/vi/faculty.json';
import vi_student_status from './locales/vi/student_status.json';
import vi_program from './locales/vi/program.json';
import vi_mail_domain from './locales/vi/mail_domain.json';
import vi_phone_code from './locales/vi/phone_code.json';
import vi_student_status_rule from './locales/vi/student_status_rule.json';
import vi_general_settings from './locales/vi/general_setting.json';
import vi_course_table from './locales/vi/course_table.json';
import vi_class_table from './locales/vi/class_table.json';
import vi_student_detail from './locales/vi/student_detail.json';
import vi_import from './locales/vi/import.json';
import vi_student_enrollment from './locales/vi/student_enrollment.json';


const resources = {
    en: {
        sidebar: en_sidebar,
        student_table: en_student_table, 
        faculty: en_faculty,
        student_status: en_student_status,
        program: en_program,
        mail_domain: en_mail_domain,
        phone_code: en_phone_code,
        student_status_rule: en_student_status_rule,
        general_settings: en_general_settings,
        course_table: en_course_table,
        class_table: en_class_table,
        student_detail: en_student_detail,
        import: en_import,
        student_enrollment: en_student_enrollment,
    },
    vi: {
        sidebar: vi_sidebar,
        student_table: vi_student_table,
        faculty: vi_faculty,
        student_status: vi_student_status,
        program: vi_program,
        mail_domain: vi_mail_domain,
        phone_code: vi_phone_code,
        student_status_rule: vi_student_status_rule,
        general_settings: vi_general_settings,
        course_table: vi_course_table,
        class_table: vi_class_table,
        student_detail: vi_student_detail,
        import: vi_import,
        student_enrollment: vi_student_enrollment,
    },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'vi',
    interpolation: { escapeValue: false },
      ns: ['sidebar', 'student_table', 'faculty', 'student_status', 'program', 'mail_domain', 'phone_code',
          'student_status_rule', 'general_settings', 'course_table', 'class_table', 'student_detail', 'import',
          'student_enrollment'],
    defaultNS: 'sidebar',
    });

export default i18n;