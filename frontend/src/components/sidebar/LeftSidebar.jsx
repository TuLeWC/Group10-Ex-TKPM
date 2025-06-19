import React, { useState } from 'react'
import { Nav, Col } from "react-bootstrap";
import "./style.css"
import { FaBookBookmark, FaBuffer, FaClipboardUser, FaCompactDisc, FaFolderPlus, FaPeopleGroup, FaPhoneVolume, FaRulerHorizontal, FaTable } from "react-icons/fa6";
import { FaBookReader, FaMailBulk } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

export const LeftSidebar = () => {
  const { t } = useTranslation('sidebar');
  const location = useLocation(); // Get the current URL path

  return (
    <div className="sidebar vh-100 p-3">
      <h6 className="text-muted">{t('manage')}</h6>
      <Nav className="flex-column">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          <FaPeopleGroup className='me-2' /> {t('menu.student_list')}
        </Link>
        <Link to="/faculty" className={`nav-link ${location.pathname === '/faculty' ? 'active' : ''}`}>
          <FaBuffer className='me-2' /> {t('menu.faculty_management')}
        </Link>
        <Link to="/student-status" className={`nav-link ${location.pathname === '/student-status' ? 'active' : ''}`}>
          <FaClipboardUser className='me-2' /> {t('menu.student_status_management')}
        </Link>
        <Link to="/program" className={`nav-link ${location.pathname === '/program' ? 'active' : ''}`}>
          <FaBookBookmark className='me-2' /> {t('menu.program_management')}
        </Link>
        <hr />
        <h6 className="text-muted">{t('settings')}</h6>
        <Link to="/mail-domain" className={`nav-link ${location.pathname === '/mail-domain' ? 'active' : ''}`}>
          <FaMailBulk className='me-2' /> {t('menu.mail_domain_management')}
        </Link>
        <Link to="/phone-code" className={`nav-link ${location.pathname === '/phone-code' ? 'active' : ''}`}>
          <FaPhoneVolume className='me-2' /> {t('menu.phone_code_management')}
        </Link>
        <Link to="/student-status-rule" className={`nav-link ${location.pathname === '/student-status-rule' ? 'active' : ''}`}>
          <FaRulerHorizontal className='me-2' /> {t('menu.student_status_rule')}
        </Link>
        <Link to="/general-settings" className={`nav-link ${location.pathname === '/general-settings' ? 'active' : ''}`}>
          <FaCompactDisc className='me-2' /> {t('menu.general_settings')}
        </Link>
        <hr />
        <h6 className="text-muted">{t('courses')}</h6>
        <Link to="/courses" className={`nav-link ${location.pathname === '/courses' ? 'active' : ''}`}>
          <FaBookReader className='me-2' /> {t('menu.course_management')}
        </Link>
        <Link to="/classes" className={`nav-link ${location.pathname === '/classes' ? 'active' : ''}`}>
          <FaTable className='me-2' /> {t('menu.class_management')}
        </Link>
      </Nav>
    </div>
  );
}