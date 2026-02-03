import React from 'react'
import { Select } from 'antd'
const { Option } = Select;
const FilterOptions = (props) => {
  let { setfilterUserData } = props;
  return (
    <>
      <div className="col-sm-6 col-md-3 offset-md-9">
        <div className="form-group custom-select">
          <Select
            showSearch
            style={{
              width: 200,
            }}
            placeholder="Search to Filter"
            optionFilterProp="children"
            onChange={(e) => setfilterUserData(e)}
          >
            <Option value="ALL">All Users</Option>
            <Option value={0} key={0}>Inactive Users</Option>
            <Option value={1} key={1}>Active Users</Option>
          </Select>
        </div>
      </div>
    </>
  )
}

export default FilterOptions