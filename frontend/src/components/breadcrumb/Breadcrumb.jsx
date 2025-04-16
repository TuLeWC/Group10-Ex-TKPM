import React from 'react';

export const Breadcrumb = ({ title, items }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3 bg-white p-3 rounded shadow-sm">
      <h5 className="text-primary fw-bold">{title}</h5>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb mb-0">
          {items.map((item, index) => (
            <li
              key={index}
              className={`breadcrumb-item ${item.active ? 'active text-primary fw-semibold' : ''}`}
              aria-current={item.active ? 'page' : undefined}
            >
              {item.href && !item.active ? (
                <a href={item.href} className="text-muted text-decoration-none">
                  {item.label}
                </a>
              ) : (
                item.label
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};
