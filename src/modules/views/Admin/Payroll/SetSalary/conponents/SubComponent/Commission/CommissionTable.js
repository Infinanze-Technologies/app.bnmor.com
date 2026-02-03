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
import { URL_DELETE_ALLOWANCE, URL_DELETE_COMMISSION, URL_GET_ALLOWANCE, URL_GET_COMMISSION, URL_GET_QRY_ATTRIBUTE, URL_GET_SALARY } from "@/config/api-paths";
import ModalComponent from "@/components/ModalComponent";
import EditCommission from "./EditCommission";
import AddCommission from "./AddCommission";
import useFetchQuery from "@/hooks/ReactQuery/useFetchQuery";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";


const CommissionTable = (props) => {
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
    tableKey  : "QryAllowanceOption2",
    filter : '?attribute_type=Allowance Option'

  })

  const EmpCommissionObject = useFetchQuery({
    url: URL_GET_COMMISSION+`/${employee_id}`,
    jwt: jwt,
    tableKey  : "EmpCommissionObject",
    filter : ''

  })


  //
  

  let qryData = EmpCommissionObject?.data

  let qryAttrPalyslipType = AttributesDataObject?.data


  const showModal = (value, record) => {

    if (value == "add") {
      setIsModalVisible(true);
      setModalTitle(<AddCommissionTitle/>);
      setModalWidth(500);
      setModalContent(<AddCommission setIsModalVisible={setIsModalVisible} jwt={jwt} employee_id={employee_id} refetch={EmpCommissionObject?.refetch} qryAttrPalyslipType={qryAttrPalyslipType}/>)
      }

    else if (value == "edit") {
      setIsModalVisible(true);
      setModalTitle(<EditCommissionTitle />);
      setModalWidth(800);
      setModalContent(
        <EditCommission
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={EmpCommissionObject?.refetch}
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

  const EditCommissionTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
      <h6>Edit Commission</h6>
    </div>
  );

  const AddCommissionTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700}}>
    <h6>Create New Commission</h6>

    </div>
  )


  const handleDelete = (record) => {

    deleteRequest(URL_DELETE_COMMISSION, record?.commission_id, jwt)
      .then((res) => {
        handleRequestResponse(res);
        EmpCommissionObject?.refetch();
      })
      .catch((err) => {
        handleRequestError(err);
      });
  };
  

  return (
    <>
   
  


   <div>




<div className="row">


{/* Employee Salary */}

  <div className="col-md-12">
 

  <div className="card card-table flex-fill">
      
        <div className="card-header">
      <div className="d-flex justify-content-between">
      <h3 className="card-title mb-0">Commission</h3>
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
            <Spin spinning={EmpCommissionObject?.isLoading}>
              <table className="table custom-table mb-0">
                <thead>
                  <tr>
                  <th className="text-left">EMP NAME</th>
                    <th className="text-left">TITLE</th>
                    <th className="text-left">TYPE</th>
                    <th className="text-left">AMOUNT</th>
                    <th className="text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                {EmpCommissionObject?.isError && <p style={{ textAlign:'center' }}>Something Went Wrong</p>}
                {EmpCommissionObject?.isLoading && (
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

                          {/* <td className="text-center">

                            <a> {item?.allowance_option?.name} </a>
                          </td> */}


                          <td className="text-center">

                            <a> {item?.title} </a>
                          </td>
                          <td>
                          <a>{ item?.amount_type}</a>
                          </td>
                          <td>
                          <a>{item?.amount_type == "Fixed" ? `₵ ${(item?.amount).toFixed(2)}`: `${item?.sal_amount}%(${(item?.amount).toFixed(2)})`}</a>
                          </td>
                          <td className="text-center">
                          <div className="action-button">
                          <div className="icon">
    <FaEdit size={18} color="#6FD943" onClick={() => showModal("edit", item)}/>
    </div>

    <div className="icon">
              <Popconfirm
          title="Are you sure？"
          okText="Yes"
          cancelText="No"
          onConfirm={() => handleDelete(item)}
        >
         <AiFillDelete size={18} color="#A02D10" />
        </Popconfirm>
             
              
              </div>

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

export default CommissionTable;
