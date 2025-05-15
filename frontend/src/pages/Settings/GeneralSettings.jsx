import React, { useEffect, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { LeftSidebar } from '../../components/sidebar/LeftSidebar';
import i18n from 'i18next';

export const GeneralSettings = () => {
    const notify = (text) => toast(text);
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        notify(`Language changed to ${lng === 'en' ? 'English' : 'Tiếng Việt'}`);
    };
  
    return (
      <div>
        <Row>
            <Col md={2}>
                <LeftSidebar />
            </Col>
            <Col md={10} className="p-4 bg-light">
                <div className="d-flex justify-content-between mb-2">
                    <h4>Cài đặt chung</h4>
                </div>
                
            <div className="mt-4 bg-white py-4 px-4 rounded shadow-sm">
                {/* Language Settings Section */}
                <div>
                    <h6 className="fw-semibold">Cài đặt ngôn ngữ</h6>
                    <Form>
                        <Form.Group>
                            <Form.Select
                                onChange={(e) => changeLanguage(e.target.value)}
                                defaultValue={i18n.language}
                            >
                                <option value="en">English</option>
                                <option value="vi">Tiếng Việt</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </div>
            </div>    
            </Col>
        </Row>
        
        <ToastContainer />
      </div>
    );
}
