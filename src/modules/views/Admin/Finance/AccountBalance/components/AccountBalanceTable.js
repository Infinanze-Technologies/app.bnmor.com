import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Space, Popconfirm, Avatar, Spin, Table, Button } from "antd";
import ModalComponent from "@/components/ModalComponent";
import {URL_BRANCH_STATUS,URL_DELETE_ACCOUNTLIST,URL_DELETE_BRANCH, URL_DELETE_DEPARTMENT, URL_DELETE_TIMESHEET } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import { deleteRequest, updateRequest } from "@/hooks/apiService";
import Skeleton from 'react-loading-skeleton'
import { UserTableStyleWrapper,TableWrapper } from '@/components/TableStyle/table';
import { AiFillDelete, AiOutlineMore } from "react-icons/ai";
import { formatDateHuman } from "@/config/DateFormat";

import { FaEdit } from "react-icons/fa";
const accounting = require('accounting');
// import Image from "next/image";

const AccountBalanceTable = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  let {  jwt,AccountBalanceDataObject } = props;

  

  let {
    isLoading,
    refetch,
  
  } = AccountBalanceDataObject;

  let qryData = AccountBalanceDataObject?.data?.data



  useEffect(() => {
       
    
  }, [AccountBalanceDataObject]);


  const columns = [
    // {
    //   title: 'Created On',
    //   dataIndex: 'createdAt',
    //   align: "left",
    //    render: (text,record,index)=> formatDateHuman(record?.createdAt)
      
   
    // },

    {
      title: 'BRANCH',
      dataIndex: 'branch_name',
      align: "left",
      render: (text,record,index)=> record?.branch_name
 
    },


    {
      title: 'ACCOUNT NAME',
      dataIndex: 'name',
      align: "left",
      // render: (text,record,index,boolean)=> {record?.hours}
   
    
   
    },

    {
      title: 'ACCOUNT NUMBER',
      dataIndex: 'account_number',
      align: "center",
      // render: (text,record,index,boolean)=> {record?.hours}
   
    
   
    },


    {
      title: ' INITIAL BALANCE',
      dataIndex: 'initial_balance',
      align: "right",
      render: (text,record,index,boolean)=>  accounting.formatMoney(record?.initial_balance, { symbol: '₵', format: '%s%v' })
   
    
   
    },


    {
      title: ' TOTAL DEPOSIT',
      dataIndex: 'total_deposit',
      align: "right",
      render: (text,record,index,boolean)=>  accounting.formatMoney(record?.total_deposit, { symbol: '₵', format: '%s%v' })
   
    
   
    },


    {
      title: ' TOTAL EXPENSES',
      dataIndex: 'total_expenses',
      align: "right",
      render: (text,record,index,boolean)=>  accounting.formatMoney(record?.total_expenses, { symbol: '₵', format: '%s%v' })
   
    
   
    },

    {
      title: ' TOTAL TRANSFER',
      dataIndex: 'total_transfer',
      align: "right",
      render: (text,record,index,boolean)=>  accounting.formatMoney(record?.total_transfer, { symbol: '₵', format: '%s%v' })
   
    
   
    },



    {
      title: ' BALANCE',
      dataIndex: 'total_account',
      align: "right",
      render: (text,record,index,boolean)=>  accounting.formatMoney(record?.total_account, { symbol: '₵', format: '%s%v' })
   
    
   
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

  const EditAccountListTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
      <h6>Edit Account List</h6>
    </div>
  );

  const AddAccountListTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700}}>
    <h6>Create New Account</h6>

    </div>
  )


  const handleDelete = (record) => {
    deleteRequest(URL_DELETE_ACCOUNTLIST, record?.account_id, jwt)
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
      Manage Account Balance
    </h3>
   
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

        <div className="total-footer">
      <div className="total-text">
        Total
      </div>
      <div className="total-amount">
      {
        accounting.formatMoney(AccountBalanceDataObject?.data?.total, { symbol: '₵', format: '%s%v' })
      }
 
      </div>
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

export default AccountBalanceTable;
