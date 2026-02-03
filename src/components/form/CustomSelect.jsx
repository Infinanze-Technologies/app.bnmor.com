import React from 'react';
import { Form, Select } from 'antd';

const { Option } = Select;
const FIELD_STYLE = { width: '100%', height: 50, borderRadius: 10 };

const CustomSelect = ({
  label,
  name,
  rules,
  placeholder,
  options = [],
  style,
  onChange,
  ...rest
}) => (
  <Form.Item
    label={label}
    name={name}
    rules={rules}
    {...rest.formItemProps}
  >
    <Select
      showSearch
      filterOption={(input, option) =>
        (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
      }
      placeholder={placeholder}
      style={{ ...FIELD_STYLE, ...style }}
      onChange={onChange}
      {...rest.selectProps}
    >
      {options.map(opt => (
        <Option key={opt.value} value={opt.value}>{opt.label}</Option>
      ))}
    </Select>
  </Form.Item>
);

export default CustomSelect; 