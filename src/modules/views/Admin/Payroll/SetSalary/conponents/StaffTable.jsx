import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Space, Popconfirm, Avatar, Spin, Table,Button } from "antd";
import ModalComponent from "@/components/ModalComponent";

import useHandleResponse from "@/hooks/useHandleResponse";
import { deleteRequest, updateRequest } from "@/hooks/apiService";
import Skeleton from 'react-loading-skeleton'
import { UserTableStyleWrapper,TableWrapper } from '@/components/TableStyle/table';
import { AiOutlineMore } from "react-icons/ai";
import { formatDateHuman } from "@/config/DateFormat";
import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import Pagination from "@/hooks/Pagination";
import { FaEdit, FaEye } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { ADD_EMPLOYEE_PAGE, SET_EMP_SALARY } from "@/config/page-routes";
import Link from "next/link";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";
// import Image from "next/image";

const StaffTable = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  let { StaffDataObject, jwt } = props;


 



  let {
    isLoading,
  isError,
  data,
  page,
  totalPages,
  refetch,
  isFetching,
  currentPage,
  totalItem,
  setpage,
  setpageSize,
  pageSize,

  } = StaffDataObject;

;

  let qryData = StaffDataObject?.data

// console.log('====================================');
// console.log(qryData);
// console.log('====================================');
const onPageChange = (page, pageSize) => {
  // console.log('Pagination changed - page:', page, 'pageSize:', pageSize);
  // API uses 1-based page numbers, so we pass the page directly
  setpage(page);
}


  useEffect(() => {
       
    
  }, [StaffDataObject]);


  const columns = [
    {
      title: 'Employee ID',
      dataIndex: 'employee_number',
      align: "left",
      render: (text,record,index)=> (
        <>
                  
                  <Link href={SET_EMP_SALARY+`/${record?.employee_id}`}
    > 
        <Button 
          className="employee-sequence"
          style={{
            background: 'linear-gradient(135deg, #4D4D4D 0%, #4D4D4D 100%)',
            border: '1px solid #4D4D4D',
            color: '#ffffff',
            fontWeight: '500',
            borderRadius: '6px',
            padding: '4px 12px',
            fontSize: '12px',
            height: 'auto',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(77, 77, 77, 0.2)'
          }}
          onMouseEnter={(e) => {
            if (e.currentTarget && e.currentTarget.style) {
              e.currentTarget.style.background = '#3A3A3A';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(77, 77, 77, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (e.currentTarget && e.currentTarget.style) {
              e.currentTarget.style.background = 'linear-gradient(135deg, #4D4D4D 0%, #4D4D4D 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(77, 77, 77, 0.2)';
            }
          }}
        >
        {`EMP${record?.employee_number}`}
        </Button>
        </Link>
         
        </>
      )
   
    },


      {
        title: 'NAME',
        dataIndex: 'fullname',
        align: "center",
     
      },
  
      {
        title: 'EMAIL',
        dataIndex: 'email',
        align: "center",
   
      },
      {
          title: 'MOBILE',
          dataIndex: 'phone',
          align: "center",
     
        },
   
        {
          title: 'BRANCH',
          dataIndex: 'branch',
          align: "left",
          render: (text,record,index)=> (
            <>
              {record?.branch?.name}
            </>
          )
       
        },

        

        {
          title: 'DEPARTMENT',
          dataIndex: 'department',
          align: "left",
          render: (text,record,index)=> (
            <>
              {record?.department?.name}
            </>
          )
       
        },

        
        {
          title: 'DESIGNAATION',
          dataIndex: 'designation',
          align: "left",
          render: (text,record,index)=> (
            <>
              {record?.designation?.name}
            </>
          )
       
        },


        {
          title: 'DATE OF JOINING',
          dataIndex: 'join_date',
          align: "left",
          render: (text,record,index)=> (
            <>
              {formatDateHuman(record?.join_date)}
            </>
          )
       
        },
    
    



      {
          title: "Action",
          key: "action",
          align: "center",
          render: (text, record) => (
            <>
              <div className="action-button">
             
              <Link href={SET_EMP_SALARY+`/${record?.employee_id}`}
    > 
     <div className="icon">
    <FaEye size={18} color="#1cdbe5 "/>
    </div>
    </Link>
            
         

            

              </div>
            </>
            // <Dropdown overlay={menu(record)} trigger={["click"]}>
            //   <Space size="middle">
            //     <AiOutlineMore style={{ fontSize: "1.2rem", cursor: "pointer" }} />
            //   </Space>
            // </Dropdown>
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



  const handleCancel = () => {
    setIsModalVisible(false);
  };







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
            Manage Employee Salary
          </h3>


          <Button 
            {...BUTTON_CONFIGS.ADD_BUTTON()}
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
            <Link href={ADD_EMPLOYEE_PAGE}
            className='href-tag'
            > 
            Create  Staff
            </Link>
          </Button>

      

        </div>
        
      <div className="card-body">
        <div className="table-responsive">
        <UserTableStyleWrapper>
          <TableWrapper>
          <Table
           className="table-responsive"
            dataSource={qryData}
            loading={isLoading}
            columns={mergedColumns}
            pagination={{
              current: currentPage || 1,
              total: totalItem || 0,
              pageSize: pageSize || 10,
              // showSizeChanger: true,
              // showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              onChange: onPageChange,
              onShowSizeChange: (current, size) => {
                // console.log('Page size changed to:', size);
                setpageSize(size);
                // Reset to first page when page size changes (API expects 0-based)
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

export default StaffTable;
