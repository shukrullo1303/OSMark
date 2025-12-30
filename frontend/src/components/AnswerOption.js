import React from 'react';
import { Form } from 'react-bootstrap';

const AnswerOption = ({ option, checked, onChange }) => (
    <Form.Check
        type={option.is_multiple ? 'checkbox' : 'radio'}
        id={`opt-${option.id}`}
        label={option.text}
        checked={checked}
        onChange={() => onChange(option.id)}
    />
);

export default AnswerOption;
