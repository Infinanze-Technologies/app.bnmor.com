import React from 'react';
import { Form, Select } from 'antd';

const { Option } = Select;
const FIELD_STYLE = { width: '100%', height: 50, borderRadius: 10 };

const CustomMultiSelect = ({
  label,
  name,
  rules,
  placeholder,
  options = [],
  style,
  mode = "multiple",
  maxTagCount = "responsive",
  loading = false,
  showSearch = true,
  filterOption = true,
  allowClear = true,
  ...rest
}) => (
  <Form.Item
    label={label}
    name={name}
    rules={rules}
    {...rest.formItemProps}
  >
    <Select
      mode={mode}
      maxTagCount={maxTagCount}
      loading={loading}
      showSearch={showSearch}
      allowClear={allowClear}
      filterOption={filterOption ? (input, option) =>
        (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
      : undefined}
      placeholder={placeholder}
      style={{ ...FIELD_STYLE, ...style }}
      {...rest.selectProps}
    >
      {options.map(opt => (
        <Option key={opt.value} value={opt.value}>{opt.label}</Option>
      ))}
    </Select>
  </Form.Item>
);

export default CustomMultiSelect;
