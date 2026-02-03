import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Space, Popconfirm, Avatar, Spin, Table, Button, Pagination, Tag } from "antd";
import ModalComponent from "@/components/ModalComponent";
import EditLeaveType from "./EditGroup";
import AddBorrowersToGroup from "./AddBorrowersToGroup";
import ViewGroupBorrowers from "./ViewGroupBorrowers";
import {URL_DELETE_GROUP, URL_GROUP_STATUS   } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import { deleteRequest, updateRequest } from "@/hooks/apiService";
import Skeleton from 'react-loading-skeleton'
import { UserTableStyleWrapper,TableWrapper } from '@/components/TableStyle/table';
import { AiOutlineMore } from "react-icons/ai";
import { formatDateHuman } from "@/config/DateFormat";
import { CheckOutlined, CloseOutlined, PlusOutlined, UserAddOutlined, TeamOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import AddLeaveType from "./AddGroup";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";
// import Image from "next/image";

const GroupTable = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  let {  jwt,AttributesDataObject,QryBranchDataObject } = props;


  let {
    isLoading,
    isError,
    data,
    page,
    totalPages,
    refetch,
    forceRefetch,
    isFetching,
    currentPage,
    totalItem,
    setpage,
    setpageSize,
    pageSize,
    statusCode,
    message,
    failed
   
  } = AttributesDataObject;


  let qryData = AttributesDataObject?.data || AttributesDataObject?.data?.items || AttributesDataObject?.data || []


  // Ensure qry_data is an array
  if (!Array.isArray(qryData)) {
    console.warn('qryData is not an array:', qryData)
    qryData = []
  }

const onPageChange = (page, pageSize) => {
  // console.log('Pagination changed - page:', page, 'pageSize:', pageSize);
  // API uses 1-based page numbers, so we pass the page directly
  setpage(page);
}


  useEffect(() => {
       
    
  }, [AttributesDataObject]);


  console.log("qryData",qryData);



  const columns = [

    {
      title: 'ID',
      dataIndex: 'group_id',
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
        title: 'Name',
        dataIndex: 'name',
        dataIndex: 'name',
        align: "left",
   
      },


      {
        title: 'Branch',
        dataIndex: 'branch',
        align: "center",
        render: (text, record) => {
          return QryBranchDataObject?.data?.find(branch => branch.branch_id === record.branch_id)?.name || 'N/A';
        }
      },

      {
        title: 'Number of Borrowers',
        dataIndex: 'members',
        align: "center",
        render: (text, record) => {
          const memberCount = record?.members?.length || 0;
          return (
            <span 
              style={{ 
                cursor: memberCount > 0 ? 'pointer' : 'default',
                color: memberCount > 0 ? '#1890ff' : '#8B8B8B',
                fontWeight: memberCount > 0 ? '500' : 'normal',
                transition: 'all 0.2s ease'
              }}
              onClick={() => {
                if (memberCount > 0) {
                  showModal("view_borrowers", record);
                }
              }}
              onMouseEnter={(e) => {
                if (memberCount > 0) {
                  e.target.style.color = '#40a9ff';
                  e.target.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (memberCount > 0) {
                  e.target.style.color = '#1890ff';
                  e.target.style.transform = 'scale(1)';
                }
              }}
            >
              {memberCount > 0 ? `${memberCount} member${memberCount !== 1 ? 's' : ''}` : 'No members'}
            </span>
          );
        }
      },
      
   
      

     
      {
        title: 'Status',
        dataIndex: 'status',
        align: "center",
        render: (text, record) => {
          const getStatusColor = (status) => {
            switch (status) {
              case 'Active':
                return 'success';
              case 'Inactive':
                return 'warning';
              case 'Suspended':
                return 'error';
              case 'Blacklisted':
                return 'default';
              default:
                return 'default';
            }
          };
  
          return (
            <Tag
              color={getStatusColor(record?.status)}
              style={{ 
                cursor: 'pointer',
                fontWeight: 'bold',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(77, 77, 77, 0.2)',
                color: '#4D4D4D',
                background: record?.status === 'Active' ? '#E8F5E8' : 
                           record?.status === 'Inactive' ? '#FFF3CD' :
                           record?.status === 'Suspended' ? '#F8D7DA' : '#E8F5E8'
              }}
            
            >
              {record?.status}
            </Tag>
          );
        }
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
      setModalTitle(<AddLeaveTypeTitle/>);
      setModalWidth(700);
      setModalContent(<AddLeaveType setIsModalVisible={setIsModalVisible} jwt={jwt} refetch={refetch} forceRefetch={forceRefetch}QryBranchDataObject={QryBranchDataObject}/>)
      }

    else if (value == "edit") {
      setIsModalVisible(true);
      setModalTitle(<EditLeaveTypeTitle />);
      setModalWidth(800);
      setModalContent(
        <EditLeaveType
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={refetch}
          forceRefetch={forceRefetch}
          QryBranchDataObject={QryBranchDataObject}
        />
      );
    } else if (value == "add_borrowers") {
      setIsModalVisible(true);
      setModalTitle(<AddBorrowersTitle />);
      setModalWidth(1000);
      setModalContent(
        <AddBorrowersToGroup
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          groupRecord={record}
          refetch={refetch}
          forceRefetch={forceRefetch}
        />
      );
    } else if (value == "view_borrowers") {
      setIsModalVisible(true);
      setModalTitle(<ViewBorrowersTitle />);
      setModalWidth(1000);
      setModalContent(
        <ViewGroupBorrowers
          setIsModalVisible={setIsModalVisible}
          groupRecord={record}
          borrowersData={record?.members || []}
        />
      );
    } else {
      return false;
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const EditLeaveTypeTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
      <h6>Edit Group</h6>
    </div>
  );

  const AddLeaveTypeTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700}}>
    <h6>Create Group</h6>

    </div>
  )

  const AddBorrowersTitle = () => (
    <div className="flex flex-wrap" style={{ width: 1000}}>
      <h6>Add Borrowers to Group</h6>
    </div>
  )

  const ViewBorrowersTitle = () => (
    <div className="flex flex-wrap" style={{ width: 1000}}>
      <h6>View Group Borrowers</h6>
    </div>
  )


  const handleDelete = (record) => {
    deleteRequest(URL_DELETE_GROUP, record?.group_id, jwt)
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
        <a onClick={() => showModal("edit", record)}>Edit Group</a>
      </Menu.Item>

      <Menu.Item key="2">
        <a onClick={() => showModal("view_borrowers", record)}>
          <TeamOutlined style={{ marginRight: '8px' }} />
           Borrowers
        </a>
      </Menu.Item>

      <Menu.Item key="3">
        <a onClick={() => showModal("add_borrowers", record)}>
          <UserAddOutlined style={{ marginRight: '8px' }} />
           Borrowers
        </a>
      </Menu.Item>

      <Menu.Item key="4">
        <Popconfirm
          title="Are you sure？"
          okText="Yes"
          cancelText="No"
          onConfirm={() => handleDelete(record)}
        >
          <a>Delete Group</a>
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
            Manage Borrower Groups
          </h3>
          <Button 
            {...BUTTON_CONFIGS.ADD_BUTTON()}
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
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Create
          </Button>
        </div>
      <div className="card-body" style={{
        padding: '24px',
        background: '#ffffff',
        borderRadius: '0 0 12px 12px'
      }}>
        <div className="table-responsive" style={{
          marginTop: '20px',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid rgba(77, 77, 77, 0.1)'
        }}>
          <UserTableStyleWrapper>
            <TableWrapper style={{
              '--primary-color': '#4D4D4D',
              '--secondary-color': '#6B6B6B',
              '--accent-color': '#8B8B8B'
            }}>
              <Table
                className="table-responsive"
                dataSource={qryData}
                loading={isLoading}
                columns={mergedColumns}
                locale={{
                  emptyText: qryData?.length === 0 ? 'No group data found' : 'No data'
                }}
                rowKey="group_id"
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
                    setpage(0);
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

export default GroupTable;
