import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Space, Popconfirm, Avatar, Spin, Table, Button,Divider, Tooltip } from "antd";
import ModalComponent from "@/components/ModalComponent";
import EditAnnouncement from "./EditAnnouncement";
import {URL_BRANCH_STATUS,URL_DELETE_AWARD,URL_DELETE_Announcement,URL_DELETE_BRANCH, URL_DELETE_DEPARTMENT, URL_DELETE_LEAVE, URL_DELETE_TERMINATION, URL_DELETE_TIMESHEET } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import { AntDesignOutlined, UserOutlined } from '@ant-design/icons';
import { deleteRequest, updateRequest } from "@/hooks/apiService";
import Skeleton from 'react-loading-skeleton'
import { UserTableStyleWrapper,TableWrapper } from '@/components/TableStyle/table';
import { AiOutlineMore } from "react-icons/ai";
import { formatDateHuman } from "@/config/DateFormat";


// import Image from "next/image";

const AnnouncementTable = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  let {  jwt,AnnouncementDataObject,QryEmployeeDataObject,QryBranchDataObject } = props;
  let qryBranchData = QryBranchDataObject?.data

// console.log('====================================');
// console.log(qryBranchData);
// console.log('====================================');
  

  let {
    isLoading,
    refetch,
  
  } = AnnouncementDataObject;

  let qryData = AnnouncementDataObject?.data

  let qryEmployeeData = QryEmployeeDataObject?.data
  // let qryAttrData = QryBranchDataObject?.data


  useEffect(() => {
       
    
  }, [AnnouncementDataObject,qryEmployeeData]);


  // console.log('====================================');
  // console.log(qryData);
  // console.log('====================================');
  const columns = [
    // {
    //   title: 'Created On',
    //   dataIndex: 'createdAt',
    //   align: "left",
    //    render: (text,record,index)=> formatDateHuman(record?.createdAt)
      
   
    // },


    {
      title: 'Employee',
      dataIndex: 'description',
      align: "left",
      render: (text,record,index,boolean)=> 
      (
        <>
   <Avatar.Group
  maxCount={4}
  maxStyle={{
    color: '#f56a00',
    backgroundColor: '#fde3cf',
  }}
>
  {/* <Avatar src="https://joeschmoe.io/api/v1/random" /> */}
  {
    record?.employee_list?.map(data => {
      return (
        <>
        <Tooltip title={data?.employee?.fullname} placement="top" color="white">
    <Avatar
      style={{
        backgroundColor: '#323759',
      }}
      icon={<UserOutlined />}
    />
  </Tooltip>
        </>
      )
    })
  }

 
</Avatar.Group>
        </>
      )
   
    
   
    },



    {
      title: 'Title',
      dataIndex: 'title',
      align: "left",
      render: (text,record,index)=> record?.title
 
    },

    // {
    //   title: 'TERMINATION TYPE',
    //   dataIndex: 'termination_attribute',
    //   align: "left",
    //   render: (text,record,index)=> record?.termination_attribute?.name
 
    // },


      {
        title: 'Start Date',
        dataIndex: 'start_date',
        align: "center",
        render: (text,record,index)=> formatDateHuman(record?.start_date)
   
      },


      {
        title: 'End Date',
        dataIndex: 'end_date',
        align: "center",
        render: (text,record,index)=> formatDateHuman(record?.end_date)
   
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

 
      
     if (value == "edit") {
      setIsModalVisible(true);
      setModalTitle(<EditAnnouncementTitle />);
      setModalWidth(900);
      setModalContent(
        <EditAnnouncement
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={refetch}
          qryBranchData={qryBranchData}
        

        
        />
      );
    } 
    
    // else if (value == "status") {
    //   setIsModalVisible(true);
    //   setModalTitle(<EditAnnouncementStatusTitle />);
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




  const EditAnnouncementTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
      <h6>View Announcement</h6>
    </div>
  );






  const menu = (record) => (
    <Menu>
      <Menu.Item key="1">
        <a onClick={() => showModal("edit", record)}>View</a>
      </Menu.Item>


    </Menu>
  );




  return (
    <>
       <div className="card card-table flex-fill">
      <div className="card-header">
      <div className="d-flex justify-content-between">
      <h3 className="card-title mb-0">Announcement</h3>
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

export default AnnouncementTable;
