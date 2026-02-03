import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Space, Popconfirm, Avatar, Spin, Table,Button } from "antd";
import ModalComponent from "@/components/ModalComponent";
import useHandleResponse from "@/hooks/useHandleResponse";
import { deleteRequest, updateRequest } from "@/hooks/apiService";
import { UserTableStyleWrapper,TableWrapper } from '@/components/TableStyle/table';
import { VIEW_EMPLOYEE_PAGE } from "@/config/page-routes";
import Link from "next/link";
import ViewPayslip from "./ViewPayslip";
import { URL_DELETE_PAYSLIP, URL_UPDATE_PAYMENT } from "@/config/api-paths";
const accounting = require('accounting');
// import Image from "next/image";

const PayslipTable = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  let { StaffDataObject, jwt,paySlipmonths,setPaySlipMonths,paySlipyears,setPaySlipYears,paymentmonths,setPaymentMonths,paymentyears,setPaymentYears,setSearch } = props;
  const [loadingUpdatePayment, setLoadingUpdatePayment] = useState(false);
  const [loadingDeletePayment, setLoadingDeletePayment] = useState(false);


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
    setpage,
    setpageSize,
    pageSize,
  
  } = StaffDataObject;

;

  let qryData = StaffDataObject?.data




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
                  
                  <Link href={VIEW_EMPLOYEE_PAGE}
    > 
        <Button className="employee-sequence">
        {`EMP${record?.employee?.employee_number}`}
        </Button>
        </Link>
         
        </>
      )
   
    },


      {
        title: 'NAME',
        dataIndex: 'fullname',
        align: "left",
        render: (text,record,index)=> (
          <>
            {record?.employee?.fullname}
          </>
        )
     
      },
  
      {
        title: 'PAYROLL TYPE',
        dataIndex: 'payroll_type',
        align: "left",
   
      },
      {
          title: 'SALARY',
          dataIndex: 'salary',
          align: "left",
          render: (text,record,index,boolean)=>  accounting.formatMoney(record?.salary, { symbol: '₵', format: '%s%v' })
     
        },
   
        {
          title: 'NET SALARY',
          dataIndex: 'net_salary',
          align: "left",
          render: (text,record,index,boolean)=>  accounting.formatMoney(record?.net_salary, { symbol: '₵', format: '%s%v' })
       
        },

        {
          title: 'SALARY',
          dataIndex: 'salary',
          align: "left",
          render: (text,record,index,boolean)=> 
          (
            <>
            {record?.status == 'Unpaid'
            &&
            (
              <>
             <p style={{ color:'red' }}>Unpaid</p>
              </>
            )
            }

            {record?.status == 'Paid'
            &&
            (
              <>
             <p style={{ color:'green' }}>Paid</p>
              </>
            )
            }
            </>
          )
     
        },


  
       
    



      {
          title: "Action",
          key: "action",
          align: "center",
          render: (text, record) => (
            <>

{record?.status == 'Unpaid'
            &&
            (
              <>
              <Button
                      onClick={() =>showModal("view_payslip",record)}
                      shape='round'
                      style={{width:'auto',background:'#ffa21d',color:'#ffffff', borderColor:'#ffa21d', marginRight:'3px'}}
                    >
                    Payslip
                    </Button>
                    
                    <Popconfirm
          title="Are you sure？"
          okText="Yes"
          cancelText="No"
          onConfirm={() => handleUpdatePayment(record)}
        >
       
                    <Button
                      disabled={loadingUpdatePayment}
                      shape='round'
                      style={{width:'auto',background:'#5eb839',color:'#ffffff', borderColor:'#5eb839',marginRight:'3px' }}
                    >
                    Click To Paid
                    </Button>
        </Popconfirm>
             


        <Popconfirm
          title="Are you sure？"
          okText="Yes"
          cancelText="No"
          onConfirm={() => handleDeletePayment(record)}
        >
                    <Button
                      disabled={loadingDeletePayment}
                      shape='round'
                      style={{width:'auto',background:'#ff3a6e',color:'#ffffff', borderColor:'#ff3a6e' }}
                    >
                    Delete
                    </Button>
                    </Popconfirm>
              </>
            )
            }

            {record?.status == 'Paid'
            &&
            (
              <>
              <Button
                        onClick={() =>showModal("view_payslip",record)}
                      shape='round'
                      style={{width:'auto',background:'#ffa21d',color:'#ffffff', borderColor:'#ffa21d', marginRight:'3px'}}
                    >
                    Payslip
                    </Button>

                  

                    {/* <Button
                      
                      shape='round'
                      style={{width:'auto',background:'#ff3a6e',color:'#ffffff', borderColor:'#ff3a6e' }}
                    >
                    Delete
                    </Button> */}
            
              </>
            )
            }
              {/* <div className="action-button">

              
             
              <Button
                      
                      type="primary"
                      shape='default'
                      style={{ height:'50px',width:'100px' }}
                    >
                      Generate Payslip
                    </Button>
            
         

            

              </div> */}
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


    const showModal = (value,record) => {
      if (value == "view_payslip") {
      setIsModalVisible(true);
      setModalTitle(<ViewPayslipTitle/>);
      setModalWidth(800);
      setModalContent(<ViewPayslip setIsModalVisible={setIsModalVisible} record={record} />)
      }
       else {
        return false;
      }
    };
  
    const handleCancel = () => {
      setIsModalVisible(false);
    };
  
    const ViewPayslipTitle = () => (
      <div className="flex flex-wrap" style={{ width: 700}}>
      <h6>Employee Payslip</h6>
  
      </div>
    )
  

  const handleUpdatePayment = (record) => {

    // URL_UPDATE_PAYMENT
    // console.log('====================================');
    // console.log(record);
    // console.log('====================================');
    let values =  {
      month : record?.month,
      year : record?.year.toString(),
      emp_payslip_id:record?.emp_payslip_id
    }
    setLoadingUpdatePayment(true);
    updateRequest(URL_UPDATE_PAYMENT, record?.id, { ...values }, jwt)
      .then((res) => {
        setLoadingUpdatePayment(false);
        handleRequestResponse(res);
        refetch();
        setIsModalVisible(false);
      })
      .catch((err) => {
        handleRequestError(err);
        setLoadingUpdatePayment(false);
        // console.log(err?.response?.data?.error);
      });
  
  };


  const handleDeletePayment = (record) => {
    setLoadingDeletePayment(true)
    deleteRequest(URL_DELETE_PAYSLIP, record?.id, jwt)
    .then((res) => {
      handleRequestResponse(res);
      setLoadingDeletePayment(false)
      refetch();
    })
    .catch((err) => {
      handleRequestError(err);
      setLoadingDeletePayment(false)
    });
  };



  return (
    <>
       <div className="card card-table flex-fill">


      <div className="card-header">

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

export default PayslipTable;
