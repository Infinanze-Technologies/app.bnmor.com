import React from 'react'
import _ from "lodash";
const { RangePicker } = DatePicker;
import { AiOutlineCalendar } from "react-icons/ai";
import {Form, DatePicker,Button} from 'antd';
import moment from 'moment';
function CustomDate(props) {
    const dateFormat = 'YYYY-MM-DD';
    const {setstateDate,setendDate} = props
    const handleChangeDate = (date,dateString) => {
        setstateDate(dateString[0])
        setendDate(dateString[1])
    }
  return (
    <>
           <div className="col-md-12 mx-auto">

           <div className="d-flex justify-content-between">
           <span >From</span>
           <span >-</span>
           <span >To</span> 
  
      </div>
                    <Form.Item name="datepicker" hasFeedback >
                    <RangePicker style={{ width:"100%" }} onChange={(date, dateString) => handleChangeDate(date, dateString)} 
                   format={dateFormat} />
                    </Form.Item>
  
            </div>
    </>
  )
}

export default CustomDate