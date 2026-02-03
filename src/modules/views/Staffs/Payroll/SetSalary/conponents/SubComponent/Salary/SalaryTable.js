import { useEffect, useState } from "react";
import {
  Button,
  Select,
  Form,
  Input,
 Space, Spin, Skeleton 
} from "antd";
const { Option } = Select;
import useHandleResponse from "@/hooks/useHandleResponse";
import useSelectQuery from "@/hooks/ReactQuery/useSelectQuery";
import { URL_GET_EMP_SALARY, URL_GET_QRY_ATTRIBUTE } from "@/config/api-paths";
import useFetchQuery from "@/hooks/ReactQuery/useFetchQuery";
import { FaEdit } from "react-icons/fa";


const SalaryTable = (props) => {
  let {employee_id,jwt} = props

  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);

 
  const AttributesDataObject = useSelectQuery({
    url: URL_GET_QRY_ATTRIBUTE,
    jwt: jwt,
    tableKey  : "QryPayslipType",
    filter : '?attribute_type=Payslip Type'

  })

  const EmpSalaryObject = useFetchQuery({
    url: URL_GET_EMP_SALARY,
    jwt: jwt,
    tableKey  : "EmpSalaryObject",
    filter : ''

  })


  //
  

  let qryData = EmpSalaryObject?.data

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
      <h3 className="card-title mb-0">Employee Salary</h3>
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
            <Spin spinning={EmpSalaryObject?.isLoading}>
              <table className="table custom-table mb-0">
                <thead>
                  <tr>
                  <th className="text-left">EMP NAME</th>
                    <th className="text-left">PAYSLIP TYPE</th>
                    <th className="text-left">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                {EmpSalaryObject?.isError && <p style={{ textAlign:'center' }}>Something Went Wrong</p>}
                {EmpSalaryObject?.isLoading && (
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

                          <td>

                            <a> {item?.payslip_type?.name} </a>
                          </td>
                    
                          <td>
                          <a>{ item?.amount}</a>
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

export default SalaryTable;
