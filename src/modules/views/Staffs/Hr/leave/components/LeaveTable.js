import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Space, Popconfirm, Avatar, Spin, Table, Button } from "antd";
import ModalComponent from "@/components/ModalComponent";
import EditLeave from "./EditLeave";
import {URL_BRANCH_STATUS,URL_DELETE_BRANCH, URL_DELETE_DEPARTMENT, URL_DELETE_EMP_LEAVE, URL_DELETE_LEAVE, URL_DELETE_TIMESHEET } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import { deleteRequest, updateRequest } from "@/hooks/apiService";
import Skeleton from 'react-loading-skeleton'
import { UserTableStyleWrapper,TableWrapper } from '@/components/TableStyle/table';
import { AiOutlineMore } from "react-icons/ai";
import { formatDateHuman } from "@/config/DateFormat";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import AddLeave from "./AddLeave";


// import Image from "next/image";

const LeaveTable = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  let {  jwt,LeavetDataObject,QryEmployeeDataObject,AttributesDataObject,employee_id } = props;


// console.log('====================================');
// console.log(AttributesDataObject);
// console.log('====================================');
  

  let {
    isLoading,
    refetch,
  
  } = LeavetDataObject;

  let qryData = LeavetDataObject?.data

  let qryEmployeeData = QryEmployeeDataObject?.data
  let qryAttrData = AttributesDataObject?.data


  useEffect(() => {
       
    
  }, [LeavetDataObject,qryEmployeeData]);


  const columns = [
    // {
    //   title: 'Created On',
    //   dataIndex: 'createdAt',
    //   align: "left",
    //    render: (text,record,index)=> formatDateHuman(record?.createdAt)
      
   
    // },

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
      setModalTitle(<AddLeaveTitle/>);
      setModalWidth(700);
      setModalContent(<AddLeave setIsModalVisible={setIsModalVisible} jwt={jwt} refetch={refetch} qryEmployeeData={qryEmployeeData} qryAttrData={qryAttrData} employee_id={employee_id}/>)
      }


      
    else if (value == "edit") {
      setIsModalVisible(true);
      setModalTitle(<EditLeaveTitle />);
      setModalWidth(800);
      setModalContent(
        <EditLeave
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={refetch}
          qryEmployeeData={qryEmployeeData}
          qryAttrData={qryAttrData}
          employee_id={employee_id}

        
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


  const EditLeaveStatusTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
      <h6>Edit Leave Status</h6>
    </div>
  );


  const EditLeaveTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
      <h6>Edit Leave</h6>
    </div>
  );

  const AddLeaveTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700}}>
    <h6>Add Leave</h6>

    </div>
  )


  const handleDelete = (record) => {
    deleteRequest(URL_DELETE_EMP_LEAVE, record?.leave_id, jwt)
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
       <div className="card card-table flex-fill">
      <div className="card-header">
      <div className="d-flex justify-content-between">
      <h3 className="card-title mb-0">Leave</h3>
        <h3 className="card-title mb-0">
        <div className='submit-button'>
    <Button 
onClick={() =>showModal("add")}
      shape="round" 
    > 
    Create
    </Button>
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

export default LeaveTable;
