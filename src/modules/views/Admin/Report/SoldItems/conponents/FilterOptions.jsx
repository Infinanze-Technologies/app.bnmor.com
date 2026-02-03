import React from 'react'
import {Button,Select,Dropdown, Menu, Space,Popconfirm,Form, Input } from 'antd'
const { Option } = Select;
const FilterOptions = (props) => {
  let {setFilterStatus,setSearch} =  props
  const [form] = Form.useForm();

  const onFinish = (values) => {
   let status = typeof(values?.status) == 'undefined' ? 'ALL' : values?.status;
   let search = typeof(values?.search)  == 'undefined' ? 'ALL' : values?.search;
   setFilterStatus(status)
   setSearch(search)

  };
  return (
    <>
    <Form onFinish={onFinish} form={form} name="basic" size="middle">
    <div className='row'>




  <div className=" col-sm-7">
    <div className="form-group custom-select">
    <Form.Item
                name="search"
               
              >
                <Input className="form-control" type="text" style={{ height:"50px" }} placeholder="Search here..."/>
              </Form.Item>
   
    </div>
  </div>


    <div className="col-sm-3">
    <div className="form-group custom-select">
    <Form.Item
                name="status"
               
              >
    <Select
    showSearch
    style={{
      width: 200,
    }}
    placeholder="Search to Select"
    optionFilterProp="children"
    filterOption={(input, option) => option.children.includes(input)}
    filterSort={(optionA, optionB) =>
      optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
      
    }
    allowClear
    onChange = {(e) => setFilterStatus(e)}
  >
   <Option value="ALL" key={1}>All</Option>
        <Option value="active" key={1}>Approved</Option>
          <Option value="review" key={1}>Review</Option>
        <Option value="rejected" key={1}>Rejected</Option>
                  
  </Select>
  </Form.Item>
   
    </div>
  </div>




  <div className="col-sm-2">

    <div className="d-grid">

    <div className="submit_buttom  w-100" >
                    <Form.Item>
                      <Button
                        // loading={isloadingSubmit}
                        type="primary"
                        htmlType="submit"
                        style={{ height:"50px" }}
                      >
                        Search
                      </Button>
                    </Form.Item>
                  </div>

      {/* <a href="#" className="btn btn-success w-100">
        Search
      </a> */}
    </div>
  </div>

    </div>
        




  </Form>
    </>
  )
}

export default FilterOptions