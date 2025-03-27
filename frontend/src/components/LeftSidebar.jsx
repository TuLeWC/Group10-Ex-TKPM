import React from 'react'
import {Nav, Col } from "react-bootstrap";

export const LeftSidebar = () => {
  return (
    <>
        <h6 className="text-muted">Manage</h6>
        <Nav className="flex-column">
        <Nav.Link href="/">👩‍🎓 Danh sách SV</Nav.Link>
        <Nav.Link href="/faculty">👔 Quản lý Khoa</Nav.Link>
        <Nav.Link href="/student-status">💾 Quản lý tình trạng SV</Nav.Link>
        <Nav.Link href="/program">📚 Quản lý Chương trình</Nav.Link>
        <hr />
        <h6 className="text-muted">Settings</h6>
        <Nav.Link href="#">📧 Mail Domain</Nav.Link>
        <Nav.Link href="#">📊 Analytics</Nav.Link>
        <Nav.Link href="#">💬 Chat</Nav.Link>
        </Nav>
    </>
  )
}
