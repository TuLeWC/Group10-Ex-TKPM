import React from 'react'
import { Nav, Col } from "react-bootstrap";
import "./style.css"
import { FaBookBookmark, FaBuffer, FaClipboardUser, FaFolderPlus, FaPeopleGroup, FaPhoneVolume, FaRulerHorizontal, FaTable } from "react-icons/fa6";
import { FaBookReader, FaMailBulk } from "react-icons/fa";

export const LeftSidebar = () => {
  return (
    <div className="sidebar vh-100 p-3">
      <h6 className="text-muted">Manage</h6>
      <Nav className="flex-column">
      <Nav.Link href="/"><FaPeopleGroup className='me-2'/> Danh sách SV</Nav.Link>
      <Nav.Link href="/faculty"><FaBuffer className='me-2'/> Quản lý khoa</Nav.Link>
      <Nav.Link href="/student-status"><FaClipboardUser className='me-2'/> Quản lý tình trạng SV</Nav.Link>
      <Nav.Link href="/program"><FaBookBookmark className='me-2'/> Quản lý Chương trình</Nav.Link>
      <hr />
      <h6 className="text-muted">Settings</h6>
      <Nav.Link href="/mail-domain"><FaMailBulk className='me-2'/> Quản lý tên miền</Nav.Link>
      <Nav.Link href="/phone-code"><FaPhoneVolume className='me-2'/> Quản lý SĐT</Nav.Link>
      <Nav.Link href="/student-status-rule"><FaRulerHorizontal className='me-2'/> Quy tắc tình trạng SV</Nav.Link>
      <hr />
      <h6 className="text-muted">Courses</h6>
      <Nav.Link href="/courses"><FaBookReader className='me-2'/> Quản lý khoá học</Nav.Link>
      <Nav.Link href="/classes"><FaTable className='me-2'/> Quản lý lớp học</Nav.Link>
      </Nav>
    </div>
  )
}