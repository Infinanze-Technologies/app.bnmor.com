import React from 'react'
import { Button, Select } from 'antd'
import { useState } from 'react';
import { useEffect } from 'react';
const { Option } = Select;
import Months from "@/components/json/months.json"
import Years from "@/components/json/years.json"
import useToastMessage from "@/hooks/useToastMessage";
import { URL_CREATE_BULK_PAYMENT } from '@/config/api-paths';
import useHandleResponse from '@/hooks/useHandleResponse';
import { postRequest } from '@/hooks/apiService';
const GenerateBulkPaymentOption = (props) => {
  let {jwt,paymentmonths,setPaymentMonths,paymentyears,setPaymentYears,refetch,setpage } = props;
  const { toastError } = useToastMessage();
  const [loadingPayment, setLoadingPayemnt] = useState(false);
  const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const handleBulkPayment = () => {
  
    if(paymentmonths != null && paymentyears != null){

      try {
let values =  {
  month : paymentmonths,
  year : paymentyears
}

        setLoadingPayemnt(true);
        postRequest(URL_CREATE_BULK_PAYMENT,{...values},jwt)
          .then((res) => {
            setLoadingPayemnt(false);
            handleRequestResponse(res)
            setpage(0)
            refetch()
          }).finally(() => {
            setLoadingPayemnt(false);
          
          })
          .catch((err) => {
            handleRequestError(err);
          
            
          });
        
      } catch (error) {
        setLoadingPayemnt(false);
        console.log(error)
        
      }

      
    }else{
      return toastError("month and year field are required");
  
    }
  };






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
          <div className='card-body py-3'>
            <div className="d-flex flex-wrap justify-content-center align-items-center gap-3 mb-3">
            
            <div className="form-group custom-select" style={{ minWidth: '200px', flex: '1 1 200px', padding: '8px' }}>
                  <Select

                    showSearch
                    style={{
                      width: '100%'
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

              <div className="form-group custom-select" style={{ minWidth: '200px', flex: '1 1 200px', padding: '8px' }}>
                  <Select

                    showSearch
                    style={{
                      width: '100%'
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

            <div className="d-flex justify-content-end mt-3">
                <div className="submit_buttom">
                  
                        <Button
                        loading={loadingPayment}
                          type="primary"
                          shape='default'
                          style={{ 
                            height:'40px',
                            minWidth:'120px',
                            fontSize: '14px'
                          }}
                          onClick={() => handleBulkPayment()}
                        >
                          Pay Now
                        </Button>
                      
                    </div>
            </div>
          </div>







      </div>
    </>
  )
}

export default GenerateBulkPaymentOption