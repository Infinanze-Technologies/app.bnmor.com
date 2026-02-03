import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Space, Popconfirm, Avatar, Spin, Table,Button } from "antd";
import ModalComponent from "@/components/ModalComponent";
import EditStaff from ".";
import {URL_DELETE_EMPLOYEE } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import { deleteRequest, updateRequest } from "@/hooks/apiService";
import Skeleton from 'react-loading-skeleton'
import { UserTableStyleWrapper,TableWrapper } from '@/components/TableStyle/table';
import { AiOutlineMore } from "react-icons/ai";
import { formatDateHuman } from "@/config/DateFormat";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import Pagination from "@/hooks/Pagination";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { EDIT_EMPLOYEE_PAGE } from "@/config/page-routes";
import Link from "next/link";
// import Image from "next/image";

const StaffTable = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  let { StaffDataObject, jwt,RoleDataObject } = props;


 



  let {
    isLoading,
    loading,
    isError,
    data,
    page,
    totalPages,
    refetch,
    isFetching,
    currentPage,
    totalItem,
    setpage
  
  } = StaffDataObject;

;

  let qryData = StaffDataObject?.data?.data

// console.log('====================================');
// console.log(qryData);
// console.log('====================================');

const onPageChange = page => {
  setpage(page - 1)
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
        <Button className="employee-sequence">
        {`EMP${record?.employee_number}`}
        </Button>
         
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
          title: 'Role',
          dataIndex: 'role',
          align: "left",
          render: (text,record,index)=> (
            <>
              {record?.role?.name}
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
             
              <Link href={EDIT_EMPLOYEE_PAGE+`/${record?.employee_id}`}
    > 
     <div className="icon">
    <FaEdit size={18} color="#1cdbe5 "/>
    </div>
    </Link>
            
         

              <div className="icon">
              <Popconfirm
          title="Are you sure？"
          okText="Yes"
          cancelText="No"
          onConfirm={() => handleDelete(record)}
        >
         <AiFillDelete size={18} color="#A02D10" />
        </Popconfirm>
             
              
              </div>

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



  const handleDelete = (record) => {
    deleteRequest(URL_DELETE_EMPLOYEE, record?.employee_id, jwt)
      .then((res) => {
        handleRequestResponse(res);
        refetch();
      })
      .catch((err) => {
        handleRequestError(err);
      });
  };






  return (
    <>
       <div className="card card-table flex-fill">
      <div className="card-header">
        <h3 className="card-title mb-0">Employees</h3>
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
            pagination ={false}

          />
          </TableWrapper>



<Pagination
                  items={StaffDataObject?.totalItem} // 100
                  currentPage={currentPage} // 1
                  pageSize={StaffDataObject?.totalPages} // 10
                  onPageChange={onPageChange}
                />


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
