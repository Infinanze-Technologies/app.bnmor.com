import { useEffect, useState } from "react";
import {
  Button,
  Select,
  Form,
  Input,
 Space, Spin, Skeleton, Popconfirm 
} from "antd";
const { Option } = Select;
import { deleteRequest, getRequest, postRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
import Router from 'next/router'
import useSelectQuery from "@/hooks/ReactQuery/useSelectQuery";
import useToastMessage from "@/hooks/useToastMessage";
import { URL_DELETE_ALLOWANCE, URL_DELETE_DEDUCTION, URL_GET_ALLOWANCE, URL_GET_EMP_DEDUCTION, URL_GET_QRY_ATTRIBUTE, URL_GET_SALARY } from "@/config/api-paths";
import useFetchQuery from "@/hooks/ReactQuery/useFetchQuery";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";


const AllowanceTable = (props) => {
  let {employee_id,jwt} = props

   const { handleRequestError,handleRequestResponse} = useHandleResponse()

 
  const AttributesDataObject = useSelectQuery({
    url: URL_GET_QRY_ATTRIBUTE,
    jwt: jwt,
    tableKey  : "QryDeductionOption",
    filter : '?attribute_type=Deduction Option'

  })

  const EmpDeductionObject = useFetchQuery({
    url: URL_GET_EMP_DEDUCTION,
    jwt: jwt,
    tableKey  : "EmpDeductionObject",
    filter : ''

  })


  //
  

  let qryData = EmpDeductionObject?.data

  let qryAttrPalyslipType = AttributesDataObject?.data



  return (
    <>
   
  


   <div>




<div className="row">


{/* Employee Salary */}

  <div className="col-md-12">
 

  <div className="card card-table flex-fill">
      
        <div className="card-header">
      <div className="d-flex justify-content-between">
      <h3 className="card-title mb-0">Saturation Deduction</h3>
        <h3 className="card-title mb-0">
        <div className='submit-button'>
 
    </div>
        </h3>
      </div>
      
      </div>
        <div className="card-body">
        <div style={{ height:'300px', overflowY:'scroll' }}>
        <div className="row px-3">


      
        <div className="table-responsive">
            <Spin spinning={EmpDeductionObject?.isLoading}>
              <table className="table custom-table mb-0">
                <thead>
                  <tr>
                  <th className="text-left">EMP NAME</th>
                  <th className="text-left">DEDUCTION OPTION</th>
                    <th className="text-left">TITLE</th>
                    <th className="text-left">TYPE</th>
                    <th className="text-left">AMOUNT</th>
                 
                  </tr>
                </thead>
                <tbody>
                {EmpDeductionObject?.isError && <p style={{ textAlign:'center' }}>Something Went Wrong</p>}
                {EmpDeductionObject?.isLoading && (
                <>
                      {[1, 2].map((key) => (
                        <>

                          <tr key={key}>
                            
                            <td>
                              <Skeleton />
                            </td>
                            <td>
                              <Skeleton />
                            </td>
                            <td>
                              <Skeleton />
                            </td>
                            <td>
                              <Skeleton />
                            </td>
                        
                          </tr>

                        </>
                      )
                      )}
                    </>
                    )}

                    {qryData &&
                      qryData?.map((item, index) => (
                      <>

                        <tr key={index}>
                       

                          <td>

                            <a> {item?.employee?.fullname} </a>
                          </td>

                          <td className="text-center">

                            <a> {item?.deduction_option?.name} </a>
                          </td>


                          <td className="text-center">

                            <a> {item?.title} </a>
                          </td>
                          <td>
                          <a>{ item?.amount_type}</a>
                          </td>
                          <td>
                          <a>{item?.amount_type == "Fixed" ? `₵ ${(item?.amount).toFixed(2)}`: `${item?.sal_amount}%(${(item?.amount).toFixed(2)})`}</a>
                          </td>
                   
                        </tr>

                      </>
                    ))}
             
                </tbody>
              </table>
            </Spin>
          </div>




        </div>
        
        </div>
        </div>
        </div>


 

  </div>









</div>








            </div>


     
    </>
  );
};

export default AllowanceTable;
