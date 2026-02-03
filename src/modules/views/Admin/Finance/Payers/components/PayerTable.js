import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Space, Popconfirm, Avatar, Spin, Table, Button } from "antd";
import ModalComponent from "@/components/ModalComponent";
import EditPayer from "./EditPayer";
import {URL_BRANCH_STATUS,URL_DELETE_ACCOUNTLIST,URL_DELETE_BRANCH, URL_DELETE_DEPARTMENT, URL_DELETE_PAYEE, URL_DELETE_PAYER, URL_DELETE_TIMESHEET } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import { deleteRequest, updateRequest } from "@/hooks/apiService";
import Skeleton from 'react-loading-skeleton'
import { UserTableStyleWrapper,TableWrapper } from '@/components/TableStyle/table';
import { AiFillDelete, AiOutlineMore } from "react-icons/ai";
import { formatDateHuman } from "@/config/DateFormat";
import AddPayer from "./AddPayer";
import { FaEdit } from "react-icons/fa";
import { PlusOutlined } from "@ant-design/icons";
const accounting = require('accounting');
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";
// import Image from "next/image";

const PayerTable = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  let {  jwt,PayerDataObject,QryBranchDataObject } = props;

  

  let {
    isLoading,
    refetch,
  
  } = PayerDataObject;

  let qryData = PayerDataObject?.data

  let qryBranchData = QryBranchDataObject?.data



  useEffect(() => {
       
    
  }, [PayerDataObject,qryBranchData]);


  const columns = [
    // {
    //   title: 'Created On',
    //   dataIndex: 'createdAt',
    //   align: "left",
    //    render: (text,record,index)=> formatDateHuman(record?.createdAt)
      
   
    // },

    {
      title: 'BRANCH',
      dataIndex: 'branch',
      align: "left",
      render: (text,record,index)=> record?.branch?.name
 
    },


    {
      title: 'NAME',
      dataIndex: 'name',
      align: "center",
      // render: (text,record,index,boolean)=> {record?.hours}
   
    
   
    },





    {
      title: 'CONTACT NUMBER',
      dataIndex: 'contact_no',
      align: "center",
      // render: (text,record,index,boolean)=> {record?.hours}
   
    
   
    },




      // {
      //   title: 'DATE',
      //   dataIndex: 'start_date',
      //   align: "center",
      //   render: (text,record,index)=> formatDateHuman(record?.start_date)
   
      // },

    

        
     
      {
        title: "Action",
        key: "action",
        align: "center",
        render: (text, record) => (
          <>
            <div className="action-button">
   
   <div className="icon" >
  <FaEdit size={18} color="#1cdbe5 " onClick={() => showModal("edit", record)}/>
  </div>

          
       

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
      setModalContent(<AddPayer setIsModalVisible={setIsModalVisible} jwt={jwt} refetch={refetch} qryBranchData={qryBranchData}/>)
      }

    else if (value == "edit") {
      setIsModalVisible(true);
      setModalWidth(500);
      setModalContent(
        <EditPayer
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
    deleteRequest(URL_DELETE_PAYER, record?.payer_id, jwt)
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
      Manage Payers
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

export default PayerTable;
