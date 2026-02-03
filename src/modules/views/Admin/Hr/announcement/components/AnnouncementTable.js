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
import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import AddAnnouncement from "./AddAnnouncement";


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
    loading,
    isError,
    data,
    page,
    totalPages,
    refetch,
    forceRefetch,
    currentPage,
    totalItem,
    setpage,
    setpageSize,
    pageSize
   
  } = AnnouncementDataObject;

  let qryData = AnnouncementDataObject?.data || []

  let qryEmployeeData = QryEmployeeDataObject?.data
  // let qryAttrData = QryBranchDataObject?.data

  const onPageChange = (page, pageSize) => {
    setpage(page);
  }

  useEffect(() => {
       
    
  }, [AnnouncementDataObject,qryEmployeeData]);


  // console.log('====================================');
  // console.log(qryData);
  // console.log('====================================');
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: "left",
      render: (text, record, index) => {
        const currentPageNum = currentPage || 1;
        const pageSizeNum = pageSize || 10;
        const actualRowNumber = (currentPageNum - 1) * pageSizeNum + index + 1;
        
        return (
          <span style={{ 
            fontFamily: 'monospace', 
            fontSize: '0.8rem',
            color: '#4D4D4D',
            fontWeight: '500'
          }}>
            {actualRowNumber}
          </span>
        );
      }
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
          title: 'Employees',
          dataIndex: 'description',
          align: "center",
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
    
      setModalWidth(700);
      setModalContent(<AddAnnouncement setIsModalVisible={setIsModalVisible} jwt={jwt} refetch={refetch} forceRefetch={forceRefetch} qryEmployeeData={qryEmployeeData} qryBranchData={qryBranchData}/>)
      }


      
    else if (value == "edit") {
      setIsModalVisible(true);
 
      setModalWidth(700);
      setModalContent(
        <EditAnnouncement
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={refetch}
          forceRefetch={forceRefetch}
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


  const EditAnnouncementStatusTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
      <h6>Edit Announcement Status</h6>
    </div>
  );


  const EditAnnouncementTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
      <h6>Edit Announcement</h6>
    </div>
  );

  const AddAnnouncementTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700}}>
    <h6>Add Announcement</h6>

    </div>
  )


  const handleDelete = (record) => {
    deleteRequest(URL_DELETE_Announcement, record?.announcement_id, jwt)
      .then(async(res) => {
        handleRequestResponse(res);
        await forceRefetch();
  
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
 <div className="card card-table flex-fill" style={{ 
        background: '#ffffff',
        border: '1px solid rgba(77, 77, 77, 0.1)',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(77, 77, 77, 0.08)'
      }}>
          <div className="card-header" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'linear-gradient(135deg, #4D4D4D 0%, #6B6B6B 100%)',
          borderBottom: '1px solid rgba(77, 77, 77, 0.2)',
          borderRadius: '12px 12px 0 0',
          padding: '20px 24px'
        }}>
          <h3 className="card-title mb-0" style={{ 
            color: '#ffffff',
            fontSize: '20px',
            fontWeight: '600',
            margin: 0,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            Announcement
          </h3>
          <Button 
            onClick={() => showModal("add", null)} 
            icon={<PlusOutlined />}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              fontWeight: '500',
              borderRadius: '8px',
              height: '40px',
              padding: '0 20px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (e.currentTarget && e.currentTarget.style) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (e.currentTarget && e.currentTarget.style) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            Create
          </Button>
        </div>
      <div className="card-body">
        <div className="table-responsive">
        <UserTableStyleWrapper>
          <TableWrapper>
          <Table
            className="table-responsive"
            dataSource={qryData || []}
            loading={loading}
            columns={mergedColumns}
            locale={{
              emptyText: qryData?.length === 0 || qryData === null ? 'No data found' : 'No data'
            }}
            rowKey="id"
            style={{
              background: '#ffffff'
            }}
            pagination={{
              current: currentPage || 1,
              total: totalItem || 0,
              pageSize: pageSize || 10,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              onChange: onPageChange,
              onShowSizeChange: (current, size) => {
                setpageSize(size);
                setpage(1);
              },
              pageSizeOptions: ['10', '20', '50', '100'],
              style: {
                marginTop: '16px',
                textAlign: 'center',
                background: '#ffffff',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid rgba(77, 77, 77, 0.1)'
              }
            }}
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
