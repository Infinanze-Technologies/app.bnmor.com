import { useEffect, useState } from "react";
import {
  Button,
  Select,
  Form,
  Input,
 Space, Upload, Image, Spin, Skeleton 
} from "antd";
const { Option } = Select;
import { getRequest, postRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
import Router from 'next/router'
import SalaryTable from "./SubComponent/Salary/SalaryTable";
import OvertimeTable from "./SubComponent/Overtime/OvertimeTable";
import AllowanceTable from "./SubComponent/Allowance/AllowanceTable";
import CommissionTable from "./SubComponent/Commission/CommissionTable";
import SaturationDeductionTable from "./SubComponent/SaturationDeduction/SaturationDeductionTable";
import OtherPaymentTable from "./SubComponent/OtherPayment/OtherPaymentTable";


const AddStaff = (props) => {
  let {employee_id,session} = props
  let jwt = session?.jwt;

  const [form] = Form.useForm();






 



  

  return (
    <>
   
  


   <div>
    <div className="page-header">
  <div className="row align-items-center">
    <div className="col">
      {/* <h3 className="page-title">Create Employee </h3> */}
      <ul className="breadcrumb">
        <li className="breadcrumb-item">
          <a href="">Create</a>
        </li>
        <li className="breadcrumb-item active">Employee Set Salary </li>
      </ul>
    </div>
    <div className="col-auto float-end ms-auto">
    <div className='submit-button'>
    <Button
    shape='round'
    onClick={() => Router.back()}
    >
  

    Go Back
  
    </Button>
    
    </div>
   
    </div>
  </div>
</div>




<div className="row">


{/* Employee Salary */}

  <div className="col-md-6">
 

 <SalaryTable employee_id={employee_id} jwt={jwt} />
  </div>



  {/* Allowance */}

  <div className="col-md-6">
  
  <AllowanceTable employee_id={employee_id} jwt={jwt}/>

  </div>


  {/* Commission */}

  <div className="col-md-6">
 <CommissionTable employee_id={employee_id} jwt={jwt}/>
  </div>



  {/* Overtime */}

  <div className="col-md-6">
<OvertimeTable employee_id={employee_id} jwt={jwt}/>
  </div>




  {/* Saturation Deduction */}

  <div className="col-md-6">
<SaturationDeductionTable employee_id={employee_id} jwt={jwt}/>

  </div>




  {/* Other Payment */}

  <div className="col-md-6">
<OtherPaymentTable employee_id={employee_id} jwt={jwt}/>
  </div>





</div>








            </div>



     
    </>
  );
};

export default AddStaff;
