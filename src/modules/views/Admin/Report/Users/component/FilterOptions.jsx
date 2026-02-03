import React from 'react'
import {Button,Select,Dropdown, Menu, Space,Popconfirm,Form, Input,DatePicker,Typography } from 'antd'
const { Option } = Select;
import { formatDateHuman } from '@/config/DateFormat';
import _ from "lodash";
const { RangePicker } = DatePicker;
import { AiOutlineCalendar } from "react-icons/ai";
import moment from 'moment';
import CustomDate from './CustomDate';
import { useState } from 'react';
import ModalComponent from '@/components/ModalComponent';
const FilterOptions = (props) => {
  let {setFilterStatus,setSearch,setstateDate,setendDate} =  props
  const [form] = Form.useForm();

  const onFinish = (values) => {
   let status = typeof(values?.status) == 'undefined' ? 'ALL' : values?.status;
   let search = typeof(values?.search)  == 'undefined' ? 'ALL' : values?.search;
   setFilterStatus(status)
   setSearch(search)

  };



  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const [record, setRecord] = useState({})
  const showModal = (value, record) => {

     if(value == "custom_date"){
      // console.log(record)
      setRecord(record);
      setIsModalVisible(true);
     setModalTitle(<CustomDateTitle/>);
      setModalWidth(400);
       setModalContent(<CustomDate setstateDate={setstateDate} setendDate={setendDate} setIsModalVisible={setIsModalVisible}/>)
    }
    else {
      return false;
    }
  };


  const CustomDateTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700}}>
    <h6>Select Date Range</h6>

  </div>
  )


  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const [filerDate, setFilerDate] = useState('');


  const handleData = (value) => {
  
    if(value == "Today"){
      let today = moment().format("YYYY-MM-DD")
      setFilerDate("Today");
      setstateDate(today)
      setendDate(today)
    }else if(value == "Yesterday"){
      let yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
      setFilerDate("Yesterday");
      setstateDate(yesterday)
      setendDate(yesterday)
    }
    else if(value == "Last7Days"){
      let current = moment().format("YYYY-MM-DD")
      let last7days = moment().subtract(6, 'days').startOf('day').format('YYYY-MM-DD')
      setFilerDate("Last7Days");
      setstateDate(last7days)
      setendDate(current)
    }
    else if(value == "Last30Days"){
      let current = moment().format("YYYY-MM-DD")
      let last30days = moment().subtract(29, 'days').startOf('day').format('YYYY-MM-DD')
      setFilerDate("Last30Days");
      setstateDate(last30days)
      setendDate(current)
    }
    else if(value == "ThisMonth"){
      const startOfMonth = moment().clone().startOf('month').format('YYYY-MM-DD');
  const endOfMonth   = moment().clone().endOf('month').format('YYYY-MM-DD');
      setFilerDate("ThisMonth");
      setstateDate(startOfMonth)
      setendDate(endOfMonth)
    }
    
    else if(value == "LastMonth"){
      const lastmonthlastdate=moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD')
  const lastmonthfirstdate=moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD')
      setFilerDate("LastMonth");
      setstateDate(lastmonthlastdate)
      setendDate(lastmonthfirstdate)
    }
    else if(value == "Year"){
      const startOfYear = moment().clone().startOf('year').format('YYYY-MM-DD');
  const endOfyear   = moment().clone().endOf('year').format('YYYY-MM-DD');
      setFilerDate("Year");
      setstateDate(startOfYear)
      setendDate(endOfyear)
    }
    else if(value == "Custom"){
      setFilerDate("Custom");
      showModal("custom_date",record)
    }
    else if(value == "Reset"){
      setFilerDate("Reset");
      setstateDate('');
      setendDate('');
    }else{
      setstateDate('');
      setendDate(''); 
      setFilerDate("");
    }
   
  }

  const filterContent = (

    <div className="pt-4">
        <div class="ranges">
        <ul>
        <li className={filerDate == "Today" ? 'activeData' : ''} onClick={()=>handleData("Today")} ><a>
        Today
        </a>
        </li>
        <li className={filerDate == "Yesterday" ? 'activeData' : ''} onClick={()=>handleData("Yesterday")} ><a>Yesterday</a></li>
        <li className={filerDate == "Last7Days" ? 'activeData' : ''} onClick={()=>handleData("Last7Days")}><a>Last 7 Days</a></li>
        <li className={filerDate == "Last30Days" ? 'activeData' : ''} onClick={()=>handleData("Last30Days")}><a>Last 30 Days</a></li>
        <li className={filerDate == "ThisMonth" ? 'activeData' : ''} onClick={()=>handleData("ThisMonth")}><a>This Month</a></li>
        <li className={filerDate == "LastMonth" ? 'activeData' : ''} onClick={()=>handleData("LastMonth")} ><a>Last Month</a></li>
        <li className={filerDate == "Year" ? 'activeData' : ''} onClick={()=>handleData("Year")}><a>Current financial year</a></li>
        <li className={filerDate == "Custom" ? 'activeData' : ''} onClick={()=>handleData("Custom")}><a>Custom Range</a></li>
        <li className={filerDate == "Reset" ? '' : ''} onClick={()=>handleData("Reset")} ><a>Reset</a></li>
        </ul>
        </div>

    </div>
     
  );
  return (
    <>
    <Form onFinish={onFinish} form={form} name="basic" size="middle">
    <div className='row'>


    <div className=" col-sm-5">
    <div className='row'>
    <div className=" col-sm-12">
    <div className="form-group custom-select">
    <Form.Item
                name="search"
               
              >
                <Input className="form-control" type="text" style={{ height:"50px"}} placeholder="Search here..."/>
              </Form.Item>
   
    </div>
</div>

<div className=" col-sm-12 d-none">
    <div className="d-grid">

<div className="submit_buttom " >
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
  
  </div>


    <div className="col-sm-4">
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
    onChange = {(e) => setFilterStatus(e)}
  >
   <Option value="ALL" key={1}>All</Option>
        <Option value="active" key={1}>Active</Option>
          <Option value="suspense" key={1}>Suspense</Option>
        <Option value="ban" key={1}>Ban</Option>
                  
  </Select>
  </Form.Item>
   
    </div>
  </div>








  <div className="col-sm-3">
  <Dropdown overlay={filterContent} trigger={["click"]}>
                <Button 
                  style={{background: "#535150",border:"none", width: '100%',height:"50px",color:"white",marginTop:"0px",borderColor:"#535150 !important" }}
      shape="shape" 
                 onClick={(e) => e.preventDefault()}><span   style={{marginLeft:"4px" }}> Filter By Date</span> </Button>
              </Dropdown>
 
  </div>

    </div>
        




  </Form>

  <ModalComponent
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
        title={modalTitle}
        width={modalWidth}
      >
        {modalContent}
      </ModalComponent>
    </>
  )
}

export default FilterOptions