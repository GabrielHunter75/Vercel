// src/components/FormField.js
import React from 'react';
import '../../Register/style/FormField.css';

export default function FormField({ type, placeholder, label, multiline, ...rest }) {
  return (
    <div className="form-field">
      {label && <label className="form-field-label">{label}</label>}
      {multiline ? (
        <textarea
          className="form-field-input"
          type={type}
          placeholder={placeholder}
          {...rest}
        />
      ) : (
        <input
          className="form-field-input"
          type={type}
          placeholder={placeholder}
          {...rest}
        />
      )}
    </div>
  );
}
