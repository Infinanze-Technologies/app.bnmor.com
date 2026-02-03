import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Space, Popconfirm, Avatar, Spin, Table, Button } from "antd";
import ModalComponent from "@/components/ModalComponent";
import EditDepartment from "./EditDepartment";
import {URL_BRANCH_STATUS,URL_DELETE_BRANCH, URL_DELETE_DEPARTMENT } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import { deleteRequest, updateRequest } from "@/hooks/apiService";
import Skeleton from 'react-loading-skeleton'
import { UserTableStyleWrapper,TableWrapper } from '@/components/TableStyle/table';
import { AiOutlineMore } from "react-icons/ai";
import { formatDateHuman } from "@/config/DateFormat";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import AddDepartment from "./AddDepartment";
// import Image from "next/image";

const BranchDepartment = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  let {  jwt,DepartmentDataObject,QryBranchDataObject } = props;


 

  let {
    isLoading,
    refetch,
  
  } = DepartmentDataObject;

  let qryData = DepartmentDataObject?.data

  let qryBranchData = QryBranchDataObject?.data




  useEffect(() => {
       
    
  }, [DepartmentDataObject,qryBranchData]);


  const columns = [
    // {
    //   title: 'Created On',
    //   dataIndex: 'createdAt',
    //   align: "left",
    //    render: (text,record,index)=> formatDateHuman(record?.createdAt)
      
   
    // },

    {
      title: 'Branch',
      dataIndex: 'beanch',
      align: "left",
      render: (text,record,index)=> record?.branch?.name
 
    },

      {
        title: 'Name',
        dataIndex: 'name',
        align: "center",
   
      },

    

        {
          title: 'Status',
          dataIndex: 'status',
          align: "center",
          render: (text,record,index,boolean)=> 
       
          <>
        
        {

          record?.status === true 
          ?
          (
            <>

            <span
              style={{ 
                backgroundColor: "#98D973",
                color: "#fff",
                display: "inline",
                padding: "0.2em 0.6em 0.3em",
                fontSize: "75%",
                textAlign:"center",
                whiteSpace: "nowrap",
                verticalAlign: "baseline",
                borderRadius:" 0.25em"


               }}
              >active
                        </span>
            </>
          ) 
          :
          (
            <>
            <span
              style={{ 
                backgroundColor: "#dd4b39",
                color: "#fff",
                display: "inline",
                padding: "0.2em 0.6em 0.3em",
                fontSize: "75%",
                textAlign:"center",
                whiteSpace: "nowrap",
                verticalAlign: "baseline",
                borderRadius:" 0.25em"


               }}
              >inactive
                        </span>
            </>
          )

        }


          {/* <span
         >
          <Switch
   checkedChildren={<CheckOutlined />}
   unCheckedChildren={<CloseOutlined />}
   defaultChecked = {record?.status}
   onChange={(e) => handleStatus(e,record)}
 />
                   </span> */}
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
   
      setModalWidth(500);
      setModalContent(<AddDepartment setIsModalVisible={setIsModalVisible} jwt={jwt} refetch={refetch} qryBranchData={qryBranchData}/>)
      }

    else if (value == "edit") {
      setIsModalVisible(true);  
      setModalWidth(500);
      setModalContent(
        <EditDepartment
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={refetch}
          qryBranchData={qryBranchData}

        
        />
      );
    } else {
      return false;
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };



  const handleDelete = (record) => {
    deleteRequest(URL_DELETE_DEPARTMENT, record?.id, jwt)
      .then(async (res) => {
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
            Man Settings - Departments
          </h3>
          <Button 
            onClick={() => showModal("add")}
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

export default BranchDepartment;
