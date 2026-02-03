import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Space, Popconfirm, Avatar, Spin, Table, Button } from "antd";
import ModalComponent from "@/components/ModalComponent";
import EditLeave from "./EditLeave";
import {URL_BRANCH_STATUS,URL_DELETE_BRANCH, URL_DELETE_DEPARTMENT, URL_DELETE_LEAVE, URL_DELETE_TIMESHEET } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import { deleteRequest, updateRequest } from "@/hooks/apiService";
import Skeleton from 'react-loading-skeleton'
import { UserTableStyleWrapper,TableWrapper } from '@/components/TableStyle/table';
import { AiOutlineMore } from "react-icons/ai";
import { formatDateHuman } from "@/config/DateFormat";
import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import AddLeave from "./AddLeave";
import LeaveStatus from "./LeaveStatus";

// import Image from "next/image";

const LeaveTable = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  let {  jwt,LeavetDataObject,QryEmployeeDataObject,AttributesDataObject } = props;


// console.log('====================================');
// console.log(AttributesDataObject);
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
   
  } = LeavetDataObject;

  let qryData = LeavetDataObject?.data || []

  let qryEmployeeData = QryEmployeeDataObject?.data
  let qryAttrData = AttributesDataObject?.data

  const onPageChange = (page, pageSize) => {
    setpage(page);
  }

  useEffect(() => {
       
    
  }, [LeavetDataObject,qryEmployeeData]);


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
      title: 'EMPLOYEE',
      dataIndex: 'employee',
      align: "left",
      render: (text,record,index)=> record?.employee?.fullname
 
    },

    {
      title: 'LEAVE TYPE',
      dataIndex: 'leave_attribute',
      align: "left",
      render: (text,record,index)=> record?.leave_attribute?.name
 
    },


      {
        title: 'START DATE',
        dataIndex: 'start_date',
        align: "center",
        render: (text,record,index)=> formatDateHuman(record?.start_date)
   
      },

      {
        title: 'END DATE',
        dataIndex: 'end_date',
        align: "center",
        render: (text,record,index)=> formatDateHuman(record?.end_date)
   
      },

    

        {
          title: 'TOTAL DAYS',
          dataIndex: 'hours',
          align: "center",
          render: (text,record,index,boolean)=> record?.total_days
       
        
       
        },


        {
          title: 'LEAVE REASON',
          dataIndex: 'hours',
          align: "center",
          render: (text,record,index,boolean)=> record?.reason
       
        
       
        },


        {
          title: 'STATUS',
          dataIndex: 'leave_status',
          align: "center",
          render: (text,record,index,boolean)=>


          <>
          {
            record?.leave_status === 'Pending'
            &&
            (
              <>
              <span className="suspense-status-color">
              Pending
            </span>
              </>
            )
          }

          {
            record?.leave_status === 'Approved'
            &&
            (
              <>
              <span className="active-status-color">
              Approved
            </span>
              </>
            )
          }

          {
            record?.leave_status === 'Reject'
            &&
            (
              <>
              <span className="inactive-status-color">
              Reject
            </span>
              </>
            )
          }
    
      
      
      
           </>
       
        
       
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
      // setModalTitle(<AddLeaveTitle/>);
      setModalWidth(500);
      setModalContent(<AddLeave setIsModalVisible={setIsModalVisible} jwt={jwt} refetch={refetch} forceRefetch={forceRefetch} qryEmployeeData={qryEmployeeData} qryAttrData={qryAttrData}/>)
      }


      
    else if (value == "edit") {
      setIsModalVisible(true);
      // setModalTitle(<EditLeaveTitle />);
      setModalWidth(500);
      setModalContent(
        <EditLeave
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={refetch}
          forceRefetch={forceRefetch}
          qryEmployeeData={qryEmployeeData}
          qryAttrData={qryAttrData}

        
        />
      );
    } 
    
    else if (value == "status") {
      setIsModalVisible(true);
      // setModalTitle(<EditLeaveStatusTitle />);
      setModalWidth(500);
      setModalContent(
        <LeaveStatus
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={refetch}
          forceRefetch={forceRefetch}
          qryEmployeeData={qryEmployeeData}
          qryAttrData={qryAttrData}

        
        />
      );
    } 
    
    else {
      return false;
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };


 


  const handleDelete = (record) => {
    deleteRequest(URL_DELETE_LEAVE, record?.leave_id, jwt)
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

      <Menu.Item key="2">
        <a onClick={() => showModal("status", record)}>Status</a>
      </Menu.Item>
      

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
            Leave
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

export default LeaveTable;
