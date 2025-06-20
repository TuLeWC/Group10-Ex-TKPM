import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { FaKey } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

export const CourseCard = ({ course, onDelete, t }) => {
  const navigate = useNavigate();

  return (
    <Col xs={12} sm={6} lg={4} xl={3}>
      <div className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden">
        <img
          src="https://foundr.com/wp-content/uploads/2021/09/Best-online-course-platforms.png"
          className="card-img-top"
          style={{ height: '200px', objectFit: 'cover' }}
        />
        <div className="card-body d-flex flex-column justify-content-between">
          <div className="mb-2">
            <div className="d-flex justify-content-between text-muted small mb-2">
              <span>{new Date(course?.updatedAt).toLocaleDateString("vi-VN")}</span>
              <span>
                <FaKey className="me-1" style={{ color: 'yellow' }} />
                {t('credits')}: {course?.credits}
              </span>
            </div>
            <h6 className="fw-semibold">{course?.courseId}</h6>
            <h6 className="fw-semibold">{course?.name}</h6>
          </div>

          <div className="mb-2">
            <p className="mb-1 small">
              {t('description')}: <span className="fw-semi">{course?.description}</span>
            </p>
            <p className="mb-1 small">
              {t('faculty')}: <span className="fw-bold">{course?.faculty?.name}</span>
            </p>
            <p className="mb-1 small">
              {t('prerequisites')}:
              {course?.prerequisites && course.prerequisites.length > 0 ? (
                course.prerequisites.map((prerequisite, index) => (
                  <span key={index} className="fw-bold">
                    {prerequisite?.name}
                    {index < course.prerequisites.length - 1 ? ', ' : ''}
                  </span>
                ))
              ) : (
                <span className="fw-bold"> {t('no_prerequisites')}</span>
              )}
            </p>
            <p className="mb-1 small">
              {t('status')}: <span className="fw-bold">{course?.isActive ? t('status_open') : t('status_closed')}</span>
            </p>
          </div>
          <Row>
            <Col md={6} className="text-center">
              <button
                className="btn btn-primary w-100 mt-2"
                onClick={() => navigate(`/edit-courses/${course?.courseId}`)}
              >
                {t('actions.edit')}
              </button>
            </Col>
            <Col md={6} className="text-center">
              <button
                className="btn btn-danger w-100 mt-2"
                onClick={() => onDelete(course?.courseId)}
              >
                {t('actions.delete')}
              </button>
            </Col>
          </Row>
        </div>
      </div>
    </Col>
  );
};