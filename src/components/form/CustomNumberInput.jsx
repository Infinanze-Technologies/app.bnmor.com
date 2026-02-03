import React from 'react';
import { InputNumber, Form } from 'antd';

const FIELD_STYLE = { width: '100%', height: 50, borderRadius: 10, display: 'flex', alignItems: 'center' };

const CustomNumberInput = ({
  label,
  name,
  rules = [],
  style = {},
  addonBefore,
  addonAfter,
  min,
  max,
  step,
  placeholder,
  ...rest
}) => (
  <Form.Item label={label} name={name} rules={rules} style={{ marginBottom: 16 }}>
    <InputNumber
      style={{ 
        ...FIELD_STYLE, 
        ...style,
        textAlign: 'left',
        lineHeight: '50px'
      }}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      addonBefore={addonBefore}
      addonAfter={addonAfter}
      {...rest}
    />
  </Form.Item>
);

export default CustomNumberInput; 