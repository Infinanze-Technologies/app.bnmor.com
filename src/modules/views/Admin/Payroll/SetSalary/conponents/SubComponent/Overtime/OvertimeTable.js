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
import { URL_DELETE_ALLOWANCE, URL_DELETE_COMMISSION, URL_DELETE_OVERTIME, URL_GET_ALLOWANCE, URL_GET_COMMISSION, URL_GET_OVERTIME, URL_GET_QRY_ATTRIBUTE, URL_GET_SALARY } from "@/config/api-paths";
import ModalComponent from "@/components/ModalComponent";
import EditOvertime from "./EditOvertime";
import AddOvertime from "./AddOvertime";
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
    tableKey  : "QryAllowanceOptionsd2",
    filter : '?attribute_type=Allowance Option'

  })

  const EmpOverTimeObject = useFetchQuery({
    url: URL_GET_OVERTIME+`/${employee_id}`,
    jwt: jwt,
    tableKey  : "EmpOverTimeObject",
    filter : ''

  })


  //
  

  let qryData = EmpOverTimeObject?.data

  let qryAttrPalyslipType = AttributesDataObject?.data


  const showModal = (value, record) => {

    if (value == "add") {
      setIsModalVisible(true);
      setModalTitle(<AddOvertimeTitle/>);
      setModalWidth(500);
      setModalContent(<AddOvertime setIsModalVisible={setIsModalVisible} jwt={jwt} employee_id={employee_id} refetch={EmpOverTimeObject?.refetch} qryAttrPalyslipType={qryAttrPalyslipType}/>)
      }

    else if (value == "edit") {
      setIsModalVisible(true);
      setModalTitle(<EditOvertimeTitle />);
      setModalWidth(800);
      setModalContent(
        <EditOvertime
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={EmpOverTimeObject?.refetch}
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

  const EditOvertimeTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
      <h6>Edit Overtime</h6>
    </div>
  );

  const AddOvertimeTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700}}>
    <h6>Create New Overtime</h6>

    </div>
  )


  const handleDelete = (record) => {

    deleteRequest(URL_DELETE_OVERTIME, record?.overtime_id, jwt)
      .then((res) => {
        handleRequestResponse(res);
        EmpOverTimeObject?.refetch();
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
      <h3 className="card-title mb-0">Overtime</h3>
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
            <Spin spinning={EmpOverTimeObject?.isLoading}>
              <table className="table custom-table mb-0">
                <thead>
                  <tr>
                  <th className="text-left">EMP NAME</th>
                    <th className="text-left">TITLE</th>
                    <th className="text-left">NO OF DAYS</th>
                    <th className="text-left">HOURS</th>
                    <th className="text-left">RATE</th>
                    <th className="text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                {EmpOverTimeObject?.isError && <p style={{ textAlign:'center' }}>Something Went Wrong</p>}
                {EmpOverTimeObject?.isLoading && (
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
                          <a>{ item?.num_of_days}</a>
                          </td>

                          <td>
                          <a>{ item?.hours}</a>
                          </td>

                          <td>
                          <a>{ item?.amount}</a>
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
