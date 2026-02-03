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
  let {jwt,paymentmonths,setPaymentMonths,paymentyears,setPaymentYears,refetch } = props;
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
            refetch()
          }).finally(() => {
            setLoadingPayemnt(false);
            refetch()
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

   




        <div className="card-body">
          <div className='py-2 px-3' style={{ marginTop:'20px' }}>
            <div className="d-flex justify-content-end">
            
            <div className="col-sm-3" style={{ marginRight:'5px' }}>
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


              <div className="col-sm-3" style={{ marginRight:'5px' }}>
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


              <div className="col-sm-3" style={{ display:'contents' }}>
              <div className="submit_buttom ml-2">
                
                      <Button
                          loading={loadingPayment}
                        type="primary"
                        shape='default'
                        style={{ height:'50px',width:'100px' }}
                        onClick={() => handleBulkPayment()}
                      >
                        Bulk Payment
                      </Button>
                    
                  </div>
              </div>


            </div>
          </div>







      </div>
    </>
  )
}

export default GenerateBulkPaymentOption