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
  let {jwt,paySlipmonths,setPaySlipMonths,paySlipyears,setPaySlipYears,StaffDataObject,setpage,CoaForPayslipData } = props;
  const { toastError } = useToastMessage();
  const [loadingPayslip, setLoadingPayslip] = useState(false);
  const [fundingAccountId, setFundingAccountId] = useState(null);
  const { handleRequestError,handleRequestResponse} = useHandleResponse()
  let coaForPayslipData = CoaForPayslipData?.data;
  const handleBulkPaySlip = () => {
  
    if(paySlipmonths != null && paySlipyears != null && fundingAccountId != null){
      try {
        let values =  {
          month : paySlipmonths,
          year : paySlipyears,
          funding_account_id: fundingAccountId
        }
        
                setLoadingPayslip(true);
                postRequest(URL_GENERATE_PAYSLIP,{...values},jwt)
                  .then((res) => {
                    setLoadingPayslip(false);
                    handleRequestResponse(res)
                    setpage(0)
                    StaffDataObject?.refetch()
                    // setPaySlipMonths(null)
                    // setPaySlipYears(null)
                 
                  }).finally(() => {
                    setLoadingPayslip(false);
                    
                  })
                  .catch((err) => {
                    handleRequestError(err);
                  
                    
                  });
                
              } catch (error) {
                setLoadingPayslip(false);
                console.log(error)
                
              }
    }else{
      return toastError("month, year and funding account fields are required");
    
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

  let FundingAccountOptions = coaForPayslipData?.map(item => {
    let data = {
      label: item?.acc_name,
      value: item?.id
    }
    return data;
  })



  // console.log(YearOption);

  return (
    <>

      <div className="card card-table flex-fill" style={{ marginBottom:'25px'}}>




        <div className="card-body">
          <div className='py-3'>
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
                    onChange={(e) => setPaySlipMonths(e)}
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
                    onChange={(e) => setPaySlipYears(e)}
                    name="type"
                    options={YearOption}
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
                    placeholder="Select Funding Account"
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={(e) => setFundingAccountId(e)}
                    name="fundingAccount"
                    options={FundingAccountOptions}
                  />
                  

                </div>

            </div>

            <div className="d-flex justify-content-end mt-3">
                <div className="submit_buttom">
                  
                        <Button
                        loading={loadingPayslip}
                          type="primary"
                          shape='default'
                          style={{ 
                            height:'40px',
                            minWidth:'120px',
                            fontSize: '14px'
                          }}
                          onClick={() => handleBulkPaySlip()}
                        >
                          Generate Payslip
                        </Button>
                      
                    </div>
            </div>
          </div>




        </div>


      </div>
    </>
  )
}

export default GeneratePayslipOption