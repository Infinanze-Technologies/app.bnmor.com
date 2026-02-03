import { useEffect, useState } from "react";
import {
  Button,
  Select,
  Form,
  Input,
 Space, Spin, Skeleton 
} from "antd";
const { Option } = Select;
import { getRequest, postRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
import Router from 'next/router'
import useSelectQuery from "@/hooks/ReactQuery/useSelectQuery";
import useToastMessage from "@/hooks/useToastMessage";
import { URL_GET_QRY_ATTRIBUTE, URL_GET_SALARY } from "@/config/api-paths";
import ModalComponent from "@/components/ModalComponent";
import EditSalary from "./EditSalary";
import AddSalary from "./AddSalary";
import useFetchQuery from "@/hooks/ReactQuery/useFetchQuery";
import { FaEdit } from "react-icons/fa";


const SalaryTable = (props) => {
  let {employee_id,jwt} = props

   const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");

 
  const AttributesDataObject = useSelectQuery({
    url: URL_GET_QRY_ATTRIBUTE,
    jwt: jwt,
    tableKey  : "QryPayslipType",
    filter : '?attribute_type=Payslip Type'

  })

  const EmpSalaryObject = useFetchQuery({
    url: URL_GET_SALARY+`/${employee_id}`,
    jwt: jwt,
    tableKey  : "EmpSalaryObject",
    filter : ''

  })


  //
  

  let qryData = EmpSalaryObject?.data

  let qryAttrPalyslipType = AttributesDataObject?.data


  const showModal = (value, record) => {

    if (value == "add") {
      setIsModalVisible(true);
      setModalTitle(<AddSalaryTitle/>);
      setModalWidth(400);
      setModalContent(<AddSalary setIsModalVisible={setIsModalVisible} jwt={jwt} employee_id={employee_id} refetch={EmpSalaryObject?.refetch} qryAttrPalyslipType={qryAttrPalyslipType}/>)
      }

    else if (value == "edit") {
      setIsModalVisible(true);
      setModalTitle(<EditSalaryTitle />);
      setModalWidth(400);
      setModalContent(
        <EditSalary
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={EmpSalaryObject?.refetch}
          qryAttrPalyslipType={qryAttrPalyslipType}
          employee_id={employee_id}
        
        />
      );
    } else {
      return false;
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const EditSalaryTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
      <h6>Edit Salary</h6>
    </div>
  );

  const AddSalaryTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700}}>
    <h6>Create New Salary</h6>

    </div>
  )

  

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
    <Button
onClick={() =>showModal("add")}
      shape="round" 
    > 
    Add
    </Button>
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
                    <th className="text-center">ACTION</th>
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
                          <td className="text-center">
                          <div className="icon">
    <FaEdit size={18} color="#6FD943" onClick={() => showModal("edit", item)}/>
    </div>
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

            <ModalComponent
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
        title={modalTitle}
        width={modalWidth}
      >
        {modalContent}
      </ModalComponent>

     
    </>
  );
};

export default SalaryTable;
