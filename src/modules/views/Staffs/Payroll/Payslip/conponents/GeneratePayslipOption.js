import React from 'react'
import { Button, Select } from 'antd'
import { useState } from 'react';
import { useEffect } from 'react';
const { Option } = Select;
import Months from "@/components/json/months.json"
import Years from "@/components/json/years.json"
import useToastMessage from "@/hooks/useToastMessage";
import { URL_GENERATE_PAYSLIP } from '@/config/api-paths';
import useHandleResponse from '@/hooks/useHandleResponse';
import { postRequest } from '@/hooks/apiService';

const GeneratePayslipOption = (props) => {
  let {jwt,setPaymentMonths,setPaymentYears } = props;
  const { toastError } = useToastMessage();
  const { handleRequestError,handleRequestResponse} = useHandleResponse()



  let MonthOptions = Months?.map(item => {
    let data = {
      label: item?.name,
      value: item?.name
    }
    return data;
  })

  let YearOption = Years?.map(item => {
    let data = {
      label: item,
      value: item
    }
    return data;
  })



  // console.log(YearOption);

  return (
    <>

    

      <div className="card card-table flex-fill" style={{ marginBottom:'25px'}}>




        <div className="card-body">
          <div className='py-3'>
        
        
            <div className="d-flex justify-content-between">
            
            <div>
      <h3 className="card-title mb-0" style={{ marginTop:'15px' }}>Find Employee Payslip </h3>      
      </div>
     
            
      <div className="d-flex justify-content-end">
            <div className="col-sm-12" style={{ marginRight:'5px' }}>
                <div className="form-group custom-select">
                  <Select

                    showSearch
                    style={{
                      width: 200,
                    }}

                    className="basic-single"
                    classNamePrefix="select"
                    placeholder="Select Month"
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={(e) => setPaymentMonths(e)}
                    name="type"
                    options={MonthOptions}
                  />
                  

                </div>
              </div>


              <div className="col-sm-12" style={{ marginRight:'5px' }}>
                <div className="form-group custom-select">
                  <Select

                    showSearch
                    style={{
                      width: 200,
                    }}

                    className="basic-single"
                    classNamePrefix="select"
                    placeholder="Select Year"
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={(e) => setPaymentYears(e)}
                    name="type"
                    options={YearOption}
                  />
                  
</div>
                </div>
              </div>


             

            </div>
          </div>




        </div>


      </div>
    </>
  )
}

export default GeneratePayslipOption