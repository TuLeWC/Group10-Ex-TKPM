import React from 'react'
import { Nav, Col } from "react-bootstrap";
import "./style.css"
import { FaBookBookmark, FaBuffer, FaClipboardUser, FaCompactDisc, FaFolderPlus, FaPeopleGroup, FaPhoneVolume, FaRulerHorizontal, FaTable } from "react-icons/fa6";
import { FaBookReader, FaMailBulk } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

export const LeftSidebar = () => {
  const { t } = useTranslation('sidebar');
  return (
    <div className="sidebar vh-100 p-3">
      <h6 className="text-muted">{t('manage')}</h6>
      <Nav className="flex-column">
        <Nav.Link href="/"><FaPeopleGroup className='me-2'/> {t('menu.student_list')}</Nav.Link>
        <Nav.Link href="/faculty"><FaBuffer className='me-2'/> {t('menu.faculty_management')}</Nav.Link>
        <Nav.Link href="/student-status"><FaClipboardUser className='me-2'/> {t('menu.student_status_management')}</Nav.Link>
        <Nav.Link href="/program"><FaBookBookmark className='me-2'/> {t('menu.program_management')}</Nav.Link>
        <hr />
        <h6 className="text-muted">{t('settings')}</h6>
        <Nav.Link href="/mail-domain"><FaMailBulk className='me-2'/> {t('menu.mail_domain_management')}</Nav.Link>
        <Nav.Link href="/phone-code"><FaPhoneVolume className='me-2'/> {t('menu.phone_code_management')}</Nav.Link>
        <Nav.Link href="/student-status-rule"><FaRulerHorizontal className='me-2'/> {t('menu.student_status_rule')}</Nav.Link>
        <Nav.Link href="/general-settings"><FaCompactDisc className='me-2'/> {t('menu.general_settings')}</Nav.Link>
        <hr />
        <h6 className="text-muted">{t('courses')}</h6>
        <Nav.Link href="/courses"><FaBookReader className='me-2'/> {t('menu.course_management')}</Nav.Link>
        <Nav.Link href="/classes"><FaTable className='me-2'/> {t('menu.class_management')}</Nav.Link>
      </Nav>
    </div>
  )
}