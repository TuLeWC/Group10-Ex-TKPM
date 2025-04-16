import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { LeftSidebar } from '../../components/sidebar/LeftSidebar'
import { FaColonSign, FaFolderPlus, FaGraduationCap, FaHeart, FaKey, FaPencil, FaTrash } from 'react-icons/fa6'
import { Breadcrumb } from '../../components/breadcrumb/Breadcrumb'
import useFetch from '../../hooks/useFetch'
import { useNavigate } from 'react-router-dom'
import { deleteDataAPI } from '../../ultis/api'
import { ToastContainer, toast } from 'react-toastify'

export const ClassTable = () => {
    const {
        data: classes,
        isLoading: isLoadingClasses,
        error: errorClasses,
    } = useFetch("/api/classes/"); 
    const navigate = useNavigate();

    return (
        <div>
        {/* <Container> */}
            <Row>
                <Col md={2}>
                    <LeftSidebar />
                </Col>
                
                <Col md={10} className="p-4 bg-light">
                    <Breadcrumb
                        title="All Classes"
                        items={[
                            { label: 'Classes', href: '#' },
                            { label: 'All Classes', active: true }
                        ]}
                    />
                    
                    <Row className="g-4 mt-4">
                    <div className="container mt-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4>Danh sách lớp học</h4>
                            <button className="btn btn-primary" onClick={() => {navigate('/add-class')}}>+ Thêm lớp học</button>
                        </div>

                        <div className="table-responsive shadow-sm rounded bg-white p-3">
                            <table className="table table-hover">
                            <thead>
                                <tr>
                                <th>Mã lớp</th>
                                <th>Khoá học</th>
                                <th>Năm học</th>
                                <th>Học kì</th>
                                <th>Giảng viên</th>
                                <th>SLTĐ</th>
                                <th>SLHT</th>
                                <th>Lịch học</th>
                                <th>Phòng</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classes && classes.length > 0 && classes.map((item) => (
                                <tr key={item.classId}>
                                    <td><strong>{item.classId}</strong></td>
                                    <td><strong>{item?.course?.name}</strong></td>
                                    <td>{item?.academicYear}</td>
                                    <td>{item?.semester?.semesterId}</td>
                                    <td className="fw-bold">{item?.lecturer}</td>
                                    <td>{item?.maximumCapacity}</td>
                                    <td>{item?.currentCapacity}</td>
                                    <td>{item?.schedule}</td>
                                    <td>{item?.classroom}</td>
                                    <td>
                                    <button className="btn btn-sm btn-primary me-2">
                                        <FaPencil/>
                                    </button>
                                    <button className="btn btn-sm btn-danger">
                                        <FaTrash/>
                                    </button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                        </div>
                    </Row>
                </Col>   
            </Row>    
                
            
        {/* </Container> */}
        <ToastContainer/>
    </div>
    )
}
