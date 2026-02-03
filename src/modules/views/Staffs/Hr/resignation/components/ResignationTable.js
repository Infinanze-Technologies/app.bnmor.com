import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Space, Popconfirm, Avatar, Spin, Table, Button } from "antd";
import ModalComponent from "@/components/ModalComponent";
import EditResignation from "./EditResignation";
import {URL_BRANCH_STATUS,URL_DELETE_AWARD,URL_DELETE_BRANCH, URL_DELETE_DEPARTMENT, URL_DELETE_EMP_RESIGNATION, URL_DELETE_LEAVE, URL_DELETE_RESIGNATION, URL_DELETE_TERMINATION, URL_DELETE_TIMESHEET } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import { deleteRequest, updateRequest } from "@/hooks/apiService";
import Skeleton from 'react-loading-skeleton'
import { UserTableStyleWrapper,TableWrapper } from '@/components/TableStyle/table';
import { AiOutlineMore } from "react-icons/ai";
import { formatDateHuman } from "@/config/DateFormat";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import AddResignation from "./AddResignation";


// import Image from "next/image";

const ResignationTable = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  let {  jwt,TerminaitonDataObject,QryEmployeeDataObject,AttributesDataObject,employee_id } = props;


// console.log('====================================');
// console.log(AttributesDataObject);
// console.log('====================================');
  

  let {
    isLoading,
    refetch,
  
  } = TerminaitonDataObject;

  let qryData = TerminaitonDataObject?.data

  let qryEmployeeData = QryEmployeeDataObject?.data
  let qryAttrData = AttributesDataObject?.data


  useEffect(() => {
       
    
  }, [TerminaitonDataObject,qryEmployeeData]);


  const columns = [
    // {
    //   title: 'Created On',
    //   dataIndex: 'createdAt',
    //   align: "left",
    //    render: (text,record,index)=> formatDateHuman(record?.createdAt)
      
   
    // },

    {
      title: 'EMPLOYEE',
      dataIndex: 'employee',
      align: "left",
      render: (text,record,index)=> record?.employee?.fullname
 
    },

    // {
    //   title: 'TERMINATION TYPE',
    //   dataIndex: 'termination_attribute',
    //   align: "left",
    //   render: (text,record,index)=> record?.termination_attribute?.name
 
    // },


      {
        title: 'RESIGNATION DATE',
        dataIndex: 'resignation_date',
        align: "center",
        render: (text,record,index)=> formatDateHuman(record?.resignation_date)
   
      },


      {
        title: 'LAST WORKING DATE',
        dataIndex: 'last_working_date',
        align: "center",
        render: (text,record,index)=> formatDateHuman(record?.last_working_date)
   
      },






        {
          title: 'DESCRIPTION',
          dataIndex: 'description',
          align: "center",
          render: (text,record,index,boolean)=> record?.description
       
        
       
        },
     
     
     



      {
          title: "Action",
          key: "action",
          align: "center",
          render: (text, record) => (
            <Dropdown overlay={menu(record)} trigger={["click"]}>
              <Space size="middle">
                <AiOutlineMore style={{ fontSize: "1.2rem", cursor: "pointer" }} />
              </Space>
            </Dropdown>
          ),
        },
    ];



    const mergedColumns = columns.map((col) => {
        
        
      return {
        ...col,
        onCell: (record) => ({
          record,
          inputType: col.dataIndex,
          dataIndex: col.dataIndex,
          title: col.title,
     
        }),
      };
    });



  const showModal = (value, record) => {

    if (value == "add") {
      setIsModalVisible(true);
      // setModalTitle(<AddResignationTitle/>);
      setModalWidth(500);
      setModalContent(<AddResignation setIsModalVisible={setIsModalVisible} jwt={jwt} refetch={refetch} qryEmployeeData={qryEmployeeData} qryAttrData={qryAttrData} employee_id={employee_id}/>)
      }


      
    else if (value == "edit") {
      setIsModalVisible(true);
      // setModalTitle(<EditResignationTitle />);
      setModalWidth(500);
      setModalContent(
        <EditResignation
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={refetch}
          qryEmployeeData={qryEmployeeData}
          qryAttrData={qryAttrData}
          employee_id={employee_id}

        
        />
      );
    } 
    
    // else if (value == "status") {
    //   setIsModalVisible(true);
    //   setModalTitle(<EditResignationStatusTitle />);
    //   setModalWidth(400);
    //   setModalContent(
    //     <LeaveStatus
    //       setIsModalVisible={setIsModalVisible}
    //       jwt={jwt}
    //       record={record}
    //       refetch={refetch}
    //       qryEmployeeData={qryEmployeeData}
    //       qryAttrData={qryAttrData}

        
    //     />
    //   );
    // } 
    
    else {
      return false;
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };


  const EditResignationStatusTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
      <h6>Edit Resignation Status</h6>
    </div>
  );


  const EditResignationTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
      <h6>Edit Resignation</h6>
    </div>
  );

  const AddResignationTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700}}>
    <h6>Add Resignation</h6>

    </div>
  )


  const handleDelete = (record) => {
    deleteRequest(URL_DELETE_EMP_RESIGNATION, record?.resignation_id, jwt)
      .then((res) => {
        handleRequestResponse(res);
        refetch();
  
      })
      .catch((err) => {
        handleRequestError(err);
      });
  };




  const menu = (record) => (
    <Menu>
      <Menu.Item key="1">
        <a onClick={() => showModal("edit", record)}>Edit</a>
      </Menu.Item>

      {/* <Menu.Item key="2">
        <a onClick={() => showModal("status", record)}>Status</a>
      </Menu.Item>
       */}

      <Menu.Item key="3">
        <Popconfirm
          title="Are you sure？"
          okText="Yes"
          cancelText="No"
          onConfirm={() => handleDelete(record)}
        >
          <a>Delete</a>
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );




  return (
    <>
       <div className="card card-table flex-fill">
      <div className="card-header">
      <div className="d-flex justify-content-between">
      <h3 className="card-title mb-0">Resignation</h3>
        <h3 className="card-title mb-0">
        <div className='submit-button'>
    <Button 
onClick={() =>showModal("add")}
      shape="round" 
    > 
    Create
    </Button>
    </div>
        </h3>
      </div>
      
      </div>
      <div className="card-body">
        <div className="table-responsive">
        <UserTableStyleWrapper>
          <TableWrapper>
          <Table
           className="table-responsive"
            // rowSelection={rowSelection}
            dataSource={qryData}
            loading={isLoading}
            columns={mergedColumns}
            pagination ={false}
            
  //           pagination={{
  //   size: "small",
  //   position: ["bottomCenter"],
  //   onChange: handlePaginationChange,
  //   total: totalItem,
  //   current: currentPage
  // }}


            // pagination={{
            //   defaultPageSize: 5,
            //   total: usersTableData.length,
            //   showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            // }}
          />
          </TableWrapper>

        </UserTableStyleWrapper>
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

export default ResignationTable;
