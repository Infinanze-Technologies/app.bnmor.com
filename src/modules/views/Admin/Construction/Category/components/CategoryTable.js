import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Space, Popconfirm, Avatar, Spin, Table, Button, Grid } from "antd";
import ModalComponent from "@/components/ModalComponent";
import EditCategory from "./EditCategory";
import StatusView from "./StatusView";
import SubcategoryView from "./SubcategoryView";
import {URL_BRANCH_STATUS,URL_DELETE_AWARD,URL_DELETE_BRANCH, URL_DELETE_DEPARTMENT, URL_DELETE_LEAVE, URL_DELETE_TIMESHEET } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import { deleteRequest, updateRequest } from "@/hooks/apiService";
import Skeleton from 'react-loading-skeleton'
import { UserTableStyleWrapper,TableWrapper } from '@/components/TableStyle/table';
import { AiOutlineMore } from "react-icons/ai";
import { formatDateHuman } from "@/config/DateFormat";
import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import AddCategory from "./AddCategory";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";


// import Image from "next/image";

const CategoryTable = (props) => {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isMobileOrTablet = !screens.lg;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  let {  jwt,CategoryDataObject } = props;


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
   
  } = CategoryDataObject;

  let qryData = CategoryDataObject?.data || []



  const onPageChange = (page, pageSize) => {
    setpage(page);
  }

  useEffect(() => {
       
    
  }, [CategoryDataObject]);


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
      title: 'CATEGORY NAME',
      dataIndex: 'category_name',
      align: "left",
      render: (text, record, index) => (
        <span style={{ 
          fontWeight: '600',
          color: '#2c3e50',
          fontSize: '14px'
        }}>
          {record?.category_name}
        </span>
      )
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      align: "center",
      render: (text, record, index) => (
        <span style={{
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500',
          background: record?.status ? '#d4edda' : '#f8d7da',
          color: record?.status ? '#155724' : '#721c24',
          border: `1px solid ${record?.status ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {record?.status ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      title: 'STATUSES COUNT',
      dataIndex: 'statuses',
      align: "center",
      render: (text, record, index) => (
        <span style={{
          background: '#e3f2fd',
          color: '#1976d2',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          {record?.statuses?.length || 0}
        </span>
      )
    },
    {
      title: 'SUBCATEGORIES COUNT',
      dataIndex: 'subcategories',
      align: "center",
      render: (text, record, index) => (
        <span style={{
          background: '#f3e5f5',
          color: '#7b1fa2',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          {record?.subcategories?.length || 0}
        </span>
      )
    },
     
     
     



      {
          title: "Action",
          key: "action",
          align: "center",
          render: (text, record) => (
            <Space size="small">
              <Button
                size="small"
                type="primary"
                onClick={() => showModal("statuses", record)}
                style={{
                  fontSize: '12px',
                  height: '32px',
                  padding: '0 12px',
                  fontWeight: '500',
                  borderRadius: '6px',
                  boxShadow: '0 2px 4px rgba(24, 144, 255, 0.2)',
                  border: '1px solid #1890ff'
                }}
              >
                📊 Statuses
              </Button>
              <Button
                size="small"
                type="default"
                onClick={() => showModal("subcategories", record)}
                style={{
                  fontSize: '12px',
                  height: '32px',
                  padding: '0 12px',
                  fontWeight: '500',
                  borderRadius: '6px',
                  background: '#f0f9ff',
                  border: '1px solid #0ea5e9',
                  color: '#0ea5e9',
                  boxShadow: '0 2px 4px rgba(14, 165, 233, 0.2)'
                }}
              >
                📁 Subcategories
              </Button>
         
            </Space>
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
      setModalTitle(<AddCategoryTitle/>);
      setModalWidth(isMobileOrTablet ? "95%" : 500);
      setModalContent(<AddCategory setIsModalVisible={setIsModalVisible} jwt={jwt} refetch={refetch} forceRefetch={forceRefetch} />)
    }
    else if (value == "edit") {
      setIsModalVisible(true);
      setModalTitle(<EditCategoryTitle />);
      setModalWidth(isMobileOrTablet ? "95%" : 500);
      setModalContent(
        <EditCategory
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={refetch}
          forceRefetch={forceRefetch}
        />
      );
    } 
    else if (value == "statuses") {
      setIsModalVisible(true);
      setModalTitle(<StatusesTitle record={record} />);
      setModalWidth(isMobileOrTablet ? "95%" : 800);
      setModalContent(
        <StatusView
          setIsModalVisible={setIsModalVisible}
          record={record}
        />
      );
    }
    else if (value == "subcategories") {
      setIsModalVisible(true);
      setModalTitle(<SubcategoriesTitle record={record} />);
      setModalWidth(isMobileOrTablet ? "95%" : 800);
      setModalContent(
        <SubcategoryView
          setIsModalVisible={setIsModalVisible}
          record={record}
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


  const EditCategoryStatusTitle = () => (
    <div className="flex flex-wrap" style={{ width: "100%" }}>
      <h6>Edit Category Status</h6>
    </div>
  );


  const EditCategoryTitle = () => (
    <div className="flex flex-wrap" style={{ width: "100%" }}>
      <h6>Edit Category</h6>
    </div>
  );

  const AddCategoryTitle = () => (
    <div className="flex flex-wrap" style={{ width: "100%" }}>
    <h6>Add Category</h6>

    </div>
  )

  const StatusesTitle = ({ record }) => (
    <div className="flex flex-wrap" style={{ width: "100%" }}>
      <h6>Statuses for {record?.category_name} ({record?.statuses?.length || 0} items)</h6>
    </div>
  );

  const SubcategoriesTitle = ({ record }) => (
    <div className="flex flex-wrap" style={{ width: "100%" }}>
      <h6>Subcategories for {record?.category_name} ({record?.subcategories?.length || 0} items)</h6>
    </div>
  );


  const handleDelete = (record) => {
    deleteRequest(URL_DELETE_CATEGORY, record?.category_id, jwt)
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
          alignItems: isMobileOrTablet ? 'flex-start' : 'center',
          flexDirection: isMobileOrTablet ? 'column' : 'row',
          gap: isMobileOrTablet ? 12 : 0,
          background: 'linear-gradient(135deg, #4D4D4D 0%, #6B6B6B 100%)',
          borderBottom: '1px solid rgba(77, 77, 77, 0.2)',
          borderRadius: '12px 12px 0 0',
          padding: isMobileOrTablet ? '16px' : '20px 24px'
        }}>
          <h3 className="card-title mb-0" style={{ 
            color: '#ffffff',
            fontSize: '20px',
            fontWeight: '600',
            margin: 0,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            Manage Categories
          </h3>
          {/* <Button 
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
          </Button> */}
        </div>
      <div className="card-body" style={{ padding: isMobileOrTablet ? '12px' : '24px' }}>
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
            scroll={{ x: 1100 }}
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
        bodyStyle={{
          maxHeight: '80vh',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        {modalContent}
      </ModalComponent>
    </>
  );
};

export default CategoryTable;
