import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Space, Popconfirm, Avatar, Spin, Table, Button } from "antd";
import ModalComponent from "@/components/ModalComponent";
import EditTermination from "./EditTermination";
import {URL_BRANCH_STATUS,URL_DELETE_AWARD,URL_DELETE_BRANCH, URL_DELETE_DEPARTMENT, URL_DELETE_LEAVE, URL_DELETE_TERMINATION, URL_DELETE_TIMESHEET } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import { deleteRequest, updateRequest } from "@/hooks/apiService";
import Skeleton from 'react-loading-skeleton'
import { UserTableStyleWrapper,TableWrapper } from '@/components/TableStyle/table';
import { AiOutlineMore } from "react-icons/ai";
import { formatDateHuman } from "@/config/DateFormat";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Switch } from 'antd';


// import Image from "next/image";

const TerminationTable = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  let {  jwt,TerminaitonDataObject,QryEmployeeDataObject,AttributesDataObject } = props;


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

    {
      title: 'TERMINATION TYPE',
      dataIndex: 'termination_attribute',
      align: "left",
      render: (text,record,index)=> record?.termination_attribute?.name
 
    },


      {
        title: 'NOICE DATE',
        dataIndex: 'notice_date',
        align: "center",
        render: (text,record,index)=> formatDateHuman(record?.notice_date)
   
      },


      {
        title: 'TERMINATION DATE',
        dataIndex: 'termination_date',
        align: "center",
        render: (text,record,index)=> formatDateHuman(record?.termination_date)
   
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

    // if (value == "add") {
    //   setIsModalVisible(true);
    //   setModalTitle(<AddTerminationTitle/>);
    //   setModalWidth(700);
    //   setModalContent(<AddTermination setIsModalVisible={setIsModalVisible} jwt={jwt} refetch={refetch} qryEmployeeData={qryEmployeeData} qryAttrData={qryAttrData}/>)
    //   }


      
     if (value == "edit") {
      setIsModalVisible(true);
      setModalTitle(<EditTerminationTitle />);
      setModalWidth(800);
      setModalContent(
        <EditTermination
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={refetch}
          qryEmployeeData={qryEmployeeData}
          qryAttrData={qryAttrData}

        
        />
      );
    } 
    
    // else if (value == "status") {
    //   setIsModalVisible(true);
    //   setModalTitle(<EditTerminationStatusTitle />);
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


  const EditTerminationStatusTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
      <h6>Edit Termination Status</h6>
    </div>
  );


  const EditTerminationTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
      <h6>View Termination</h6>
    </div>
  );

  const AddTerminationTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700}}>
    <h6>Add Termination</h6>

    </div>
  )






  const menu = (record) => (
    <Menu>
      <Menu.Item key="1">
        <a onClick={() => showModal("edit", record)}>View</a>
      </Menu.Item>

      {/* <Menu.Item key="2">
        <a onClick={() => showModal("status", record)}>Status</a>
      </Menu.Item>
       */}

  
    </Menu>
  );




  return (
    <>
       <div className="card card-table flex-fill">
      <div className="card-header">
      <div className="d-flex justify-content-between">
      <h3 className="card-title mb-0">Termination</h3>
        <h3 className="card-title mb-0">
        <div className='submit-button'>
    {/* <Button 
onClick={() =>showModal("add")}
      shape="round" 
    > 
    Create
    </Button> */}
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

export default TerminationTable;
