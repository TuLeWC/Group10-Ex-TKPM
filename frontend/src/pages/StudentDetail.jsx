import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { fetchDataFromAPI } from '../ultis/api';
import { Col, Form, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

const StudentDetail = () => {
    const language = i18n.language;
    const { t } = useTranslation('student_detail');
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setStudent(null);
            setError(null);
            try {
                const response = await fetchDataFromAPI(`/api/students/${id}?lang=${language}`);
                console.log(response);
                setStudent(response);
            } catch (error) {
                setError(error?.message || "API call failed");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]); 

    return (
        <div className="container-xl px-4 mt-4">
        <button
            className="btn btn-primary"
            type="button"
            onClick={() => navigate('/')}
        >
            {t('buttons.back')}
        </button>
        <h4 className="mt-4">{t('title_detail')}</h4>
        <hr className="mt-0 mb-4" />
        <div className="row">
            <div className="col-xl-4">
            <div className="card mb-4 mb-xl-0">
                <div className="card-header">{t('profile_picture')}</div>
                <div className="card-body text-center">
                <img
                    className="img-account-profile rounded-circle mb-2"
                    src="http://bootdey.com/img/Content/avatar/avatar1.png"
                    alt=""
                />
                </div>
            </div>
            </div>
            <div className="col-xl-8">
            <div className="card mb-4">
                <div className="card-header">{t('details')}</div>
                <div className="card-body">
                {error && <p className="text-danger">{t('notifications.error_occurred')}: {error}</p>}
                    {!isLoading && student && 
                    (
                    <Form>
                        <Row>
                            {/* MSSV */}
                            <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    {t('fields.student_id')} <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    readOnly
                                    type="text"
                                    name="id"
                                    value={student.studentId}
                                />
                            </Form.Group>
                            </Col>

                            {/* Name */}
                            <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    {t('fields.full_name')} <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    readOnly
                                    type="text"
                                    name="fullName"
                                    value={student.fullName}
                                />
                            </Form.Group>
                            </Col>

                            {/* nationality */}
                            <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    {t('fields.nationality')} <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    readOnly
                                    type="text"
                                    name="nationality"
                                    value={student.nationality}
                                    placeholder={t('fields.enter_nationality')}
                                />
                            </Form.Group>
                            </Col>
                        </Row>
              
                        <Row>
                            {/* DOB */}
                            <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    {t('fields.date_of_birth')} <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    readOnly
                                    type="date"
                                    name="dateOfBirth"
                                    value={student?.dateOfBirth && !isNaN(new Date(student.dateOfBirth)) ? new Date(student.dateOfBirth).toISOString().split("T")[0] : ""}
                                />
                            </Form.Group>
                            </Col>

                            {/* Gender */}
                            <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    {t('fields.gender')} <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    required
                                    name="gender"
                                    value={student.gender}
                                >
                                </Form.Control>
                            </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            {/* Faculty */}
                            <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                {t('fields.faculty')} <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    readOnly
                                    name="faculty"
                                    value={student?.faculty?.name}
                                >
                                </Form.Control>
                            </Form.Group>
                            </Col>

                            {/* Batch */}
                            <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                {t('fields.batch')} <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    name="batch"
                                    value="2022"
                                    placeholder={t('fields.enter_batch')}
                                />
                            </Form.Group>
                            </Col>

                            {/* Program */}
                            <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                {t('fields.program')} <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    readOnly
                                    name="program"
                                    value={student?.program?.name}
                                >
                                </Form.Control>
                            </Form.Group>
                            </Col>
                        </Row>
              
                        {/* permanent address */}
                        <Row>
                            <Col md={12}>
                            <Form.Group className="mb-1">
                                <Form.Label>
                                {t('fields.permanent_address')} <span className="text-danger">*</span>
                                </Form.Label>
                            </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                required
                                type="text"
                                name="houseNumber"
                                value={student.addresses.permanent.houseNumber}
                                onChange={(e) => handleAddressChange(e, "permanent")}
                                placeholder={t('fields.house_number')}
                                />
                                <Form.Control.Feedback type="invalid">
                                {t('validation.house_number')}
                                </Form.Control.Feedback>
                            </Form.Group>
                            </Col>
                            <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                required
                                type="text"
                                name="street"
                                value={student.addresses.permanent.street}
                                onChange={(e) => handleAddressChange(e, "permanent")}
                                placeholder={t('fields.street')}
                                />
                                <Form.Control.Feedback type="invalid">
                                {t('validation.street')}
                                </Form.Control.Feedback>
                            </Form.Group>
                            </Col>
                            <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                required
                                type="text"
                                name="district"
                                value={student.addresses.permanent.district}
                                onChange={(e) => handleAddressChange(e, "permanent")}
                                placeholder={t('fields.district')}
                                />
                                <Form.Control.Feedback type="invalid">
                                {t('validation.district')}
                                </Form.Control.Feedback>
                            </Form.Group>
                            </Col>
                            <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                required
                                type="text"
                                name="city"
                                value={student.addresses.permanent.city}
                                onChange={(e) => handleAddressChange(e, "permanent")}
                                placeholder={t('fields.city')}
                                />
                                <Form.Control.Feedback type="invalid">
                                {t('validation.city')}
                                </Form.Control.Feedback>
                            </Form.Group>
                            </Col>
                            <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                required
                                type="text"
                                name="country"
                                value={student.addresses.permanent.country}
                                onChange={(e) => handleAddressChange(e, "permanent")}
                                placeholder={t('fields.country')}
                                />
                                <Form.Control.Feedback type="invalid">
                                {t('validation.country')}
                                </Form.Control.Feedback>
                            </Form.Group>
                            </Col>
                        </Row>

                        {/* temporary address */}
                        <Row>
                            <Col md={12}>
                            <Form.Group className="mb-1">
                                <Form.Label>
                                {t('fields.temporary_address')}
                                </Form.Label>
                            </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                type="text"
                                name="houseNumber"
                                value={student.addresses.temporary.houseNumber}
                                onChange={(e) => handleAddressChange(e, "temporary")}
                                placeholder={t('fields.house_number')}
                                />
                                <Form.Control.Feedback type="invalid">
                                {t('validation.house_number')}
                                </Form.Control.Feedback>
                            </Form.Group>
                            </Col>
                            <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                type="text"
                                name="street"
                                value={student.addresses.temporary.street}
                                onChange={(e) => handleAddressChange(e, "temporary")}
                                placeholder={t('fields.street')}
                                />
                                <Form.Control.Feedback type="invalid">
                                {t('validation.street')}
                                </Form.Control.Feedback>
                            </Form.Group>
                            </Col>
                            <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                type="text"
                                name="district"
                                value={student.addresses.temporary.district}
                                onChange={(e) => handleAddressChange(e, "temporary")}
                                placeholder={t('fields.district')}
                                />
                                <Form.Control.Feedback type="invalid">
                                {t('validation.district')}
                                </Form.Control.Feedback>
                            </Form.Group>
                            </Col>
                            <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                type="text"
                                name="city"
                                value={student.addresses.temporary.city}
                                onChange={(e) => handleAddressChange(e, "temporary")}
                                placeholder={t('fields.city')}
                                />
                                <Form.Control.Feedback type="invalid">
                                {t('validation.city')}
                                </Form.Control.Feedback>
                            </Form.Group>
                            </Col>
                            <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                type="text"
                                name="country"
                                value={student.addresses.temporary.country}
                                onChange={(e) => handleAddressChange(e, "temporary")}
                                placeholder={t('fields.country')}
                                />
                                <Form.Control.Feedback type="invalid">
                                {t('validation.country')}
                                </Form.Control.Feedback>
                            </Form.Group>
                            </Col>
                        </Row>

                        {/* mailing address */}
                        <Row>
                            <Col md={12}>
                            <Form.Group className="mb-1">
                                <Form.Label>
                                {t('fields.mailing_address')} <span className="text-danger">*</span>
                                </Form.Label>
                            </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                required
                                type="text"
                                name="houseNumber"
                                value={student.addresses.mailing.houseNumber}
                                onChange={(e) => handleAddressChange(e, "mailing")}
                                placeholder={t('fields.house_number')}
                                />
                                <Form.Control.Feedback type="invalid">
                                {t('validation.house_number')}
                                </Form.Control.Feedback>
                            </Form.Group>
                            </Col>
                            <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                required
                                type="text"
                                name="street"
                                value={student.addresses.mailing.street}
                                onChange={(e) => handleAddressChange(e, "mailing")}
                                placeholder={t('fields.street')}
                                />
                                <Form.Control.Feedback type="invalid">
                                {t('validation.street')}
                                </Form.Control.Feedback>
                            </Form.Group>
                            </Col>
                            <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                required
                                type="text"
                                name="district"
                                value={student.addresses.mailing.district}
                                onChange={(e) => handleAddressChange(e, "mailing")}
                                placeholder={t('fields.district')}
                                />
                                <Form.Control.Feedback type="invalid">
                                {t('validation.district')}
                                </Form.Control.Feedback>
                            </Form.Group>
                            </Col>
                            <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                required
                                type="text"
                                name="city"
                                value={student.addresses.mailing.city}
                                onChange={(e) => handleAddressChange(e, "mailing")}
                                placeholder={t('fields.city')}
                                />
                                <Form.Control.Feedback type="invalid">
                                {t('validation.city')}
                                </Form.Control.Feedback>
                            </Form.Group>
                            </Col>
                            <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                required
                                type="text"
                                name="country"
                                value={student.addresses.mailing.country}
                                onChange={(e) => handleAddressChange(e, "mailing")}
                                placeholder={t('fields.country')}
                                />
                                <Form.Control.Feedback type="invalid">
                                {t('validation.country')}
                                </Form.Control.Feedback>
                            </Form.Group>
                            </Col>
                        </Row>
              
                        {/* Option idDocument */}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={2}>{t('fields.id_document_type')}:</Form.Label>
                            <Col sm={10}>
                            <Form.Control
                                required
                                value={student.idDocument.type}
                            >
                            </Form.Control>
                            </Col>
                        </Form.Group>

                        {student.idDocument.type && (
                            <>
                            {/* Số giấy tờ */}
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm={2}>{t('fields.id_document_number')}:</Form.Label>
                                <Col sm={10}>
                                <Form.Control
                                    required
                                    type="text"
                                    value={student.idDocument.idNumber}
                                />
                                </Col>
                            </Form.Group>

                            {/* Ngày cấp - Ngày hết hạn */}
                            <Row className="mb-3">
                                <Col sm={6}>
                                <Form.Group>
                                    <Form.Label>{t('fields.issued_date')}:</Form.Label>
                                    <Form.Control
                                    required
                                    type="date"
                                    value={student?.idDocument?.issuedDate && !isNaN(new Date(student.idDocument.issuedDate)) ? new Date(student.idDocument.issuedDate).toISOString().split("T")[0] : ""}
                                    />
                                </Form.Group>
                                </Col>
                                <Col sm={6}>
                                <Form.Group>
                                    <Form.Label> {t('fields.expiry_date')}:</Form.Label>
                                    <Form.Control
                                    required
                                    type="date"
                                    value={student.idDocument.expiryDate && !isNaN(new Date(student.idDocument.expiryDate)) ? new Date(student.idDocument.expiryDate).toISOString().split("T")[0] : ""}
                                    />
                                </Form.Group>
                                </Col>
                            </Row>

                            {/* Nơi cấp */}
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm={2}>{t('fields.issued_place')}:</Form.Label>
                                <Col sm={10}>
                                <Form.Control
                                    required
                                    type="text"
                                    value={student.idDocument.issuedPlace}
                                />
                                </Col>
                            </Form.Group>
                            </>
                        )}

                        {student.idDocument.type === "CCCD" && (
                            <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={2}>{t('fields.has_chip')}:</Form.Label>
                            <Col sm={10}>
                                <Form.Check
                                required
                                type="checkbox"
                                checked={student.idDocument.hasChip}
                                />
                            </Col>
                            </Form.Group>
                        )}

                        {student.idDocument.type === "Passport" && (
                            <>
                            {/* Quốc gia cấp */}
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm={2}>{t('fields.issued_country')}:</Form.Label>
                                <Col sm={10}>
                                <Form.Control
                                    required
                                    type="text"
                                    value={student.idDocument.issuedCountry}
                                />
                                </Col>
                            </Form.Group>

                            {/* Ghi chú */}
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm={2}>{t('fields.notes')}:</Form.Label>
                                <Col sm={10}>
                                <Form.Control
                                    type="text"
                                    value={student.idDocument.notes}
                                />
                                </Col>
                            </Form.Group>
                            </>
                        )}

                        <Row>
                            {/* Email */}
                            <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                {t('fields.email')} <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                required
                                type="email"
                                name="email"
                                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                                value={student.email}
                            
                                placeholder="example@gmail.com"
                                />
                                <Form.Control.Feedback type="invalid">
                                {t('validation.email')}
                                </Form.Control.Feedback>
                            </Form.Group>
                            </Col>

                            {/* Phone */}
                            <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                {t('fields.phone')} <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                required
                                type="tel"
                                pattern="^0\d{9}$"
                                name="phone"
                                value={student.phoneNumber}
                            
                                placeholder={t('fields.phone_placeholder')}
                                />
                            </Form.Group>
                            </Col>
                        </Row>
              
                        {/* Status */}
                        <Form.Group className="mb-3">
                            <Form.Label>
                            {t('fields.status')} <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                            required
                            name="status"
                            value={student?.studentStatus?.status}
                        
                            >
                            </Form.Control>
                        </Form.Group>

              <div className="d-flex justify-content-end gap-2 mt-4">
                
              </div>
            </Form> 
                        )    
                    }
                </div>
            </div>
            </div>
        </div>
        </div>
  );
};

export default StudentDetail;
