import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Space, Popconfirm, Avatar, Spin, Table, Button, Row, Col } from "antd";
import ModalComponent from "@/components/ModalComponent";

import useHandleResponse from "@/hooks/useHandleResponse";
import { deleteRequest, updateRequest } from "@/hooks/apiService";

import { UserTableStyleWrapper,TableWrapper } from '@/components/TableStyle/table';

import { EDIT_EMPLOYEE_PAGE, SET_EMP_SALARY } from "@/config/page-routes";
import Link from "next/link";
import GenerateBulkPaymentOption from "./GenerateBulkPaymentOption";
import SearchOption from "./SearchOption";
import ViewPayslip from "./ViewPayslip";
import { URL_DELETE_PAYSLIP, URL_UPDATE_PAYMENT } from "@/config/api-paths";
import GeneratePayslipOption from "./GeneratePayslipOption";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";
const accounting = require('accounting');
// import Image from "next/image";

const PayslipTable = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  let { StaffDataObject, jwt,paySlipmonths,setPaySlipMonths,paySlipyears,setPaySlipYears,paymentmonths,setPaymentMonths,paymentyears,setPaymentYears,setSearch,CoaForPayslipData } = props;
  const [loadingUpdatePayment, setLoadingUpdatePayment] = useState(false);
  const [loadingDeletePayment, setLoadingDeletePayment] = useState(false);


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
      key: 'employee_number',
      width: 120,
      align: "center",
      render: (text, record, index) => (
        <Link href={SET_EMP_SALARY + `/${record?.employee_id}`}>
          <Button 
            className="employee-sequence"
            size="small"
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
          >
        {`EMP${record?.employee?.employee_number}`}
        </Button>
        </Link>
      )
    },
      {
      title: 'Employee Name',
        dataIndex: 'fullname',
      key: 'fullname',
      width: 200,
        align: "left",
      render: (text, record, index) => (
        <span style={{ fontWeight: '500', color: '#262626' }}>
            {record?.employee?.fullname}
        </span>
        )
      },
      {
      title: 'Payroll Type',
        dataIndex: 'payroll_type',
      key: 'payroll_type',
      width: 120,
      align: "center",
      render: (text, record, index) => (
        <span style={{ 
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500',
          backgroundColor: '#f0f8ff',
          color: '#1890ff',
          border: '1px solid #d6e4ff'
        }}>
          {record?.payroll_type || 'N/A'}
        </span>
      )
    },
    {
      title: 'Basic Salary',
          dataIndex: 'salary',
      key: 'salary',
      width: 130,
      align: "right",
      render: (text, record, index) => (
        <span style={{ fontWeight: '600', color: '#52c41a' }}>
          {accounting.formatMoney(record?.salary, { symbol: '₵', format: '%s%v' })}
        </span>
      )
    },
    {
      title: 'Net Salary',
          dataIndex: 'net_salary',
      key: 'net_salary',
      width: 130,
      align: "right",
      render: (text, record, index) => (
        <span style={{ fontWeight: '600', color: '#1890ff' }}>
          {accounting.formatMoney(record?.net_salary, { symbol: '₵', format: '%s%v' })}
        </span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: "center",
      render: (text, record, index) => (
        <span style={{
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500',
          backgroundColor: record?.status === 'Paid' ? '#f6ffed' : '#fff2f0',
          color: record?.status === 'Paid' ? '#52c41a' : '#ff4d4f',
          border: record?.status === 'Paid' ? '1px solid #b7eb8f' : '1px solid #ffccc7'
        }}>
          {record?.status || 'N/A'}
        </span>
      )
    },


  
       
    



    {
      title: "Actions",
          key: "action",
      width: 280,
          align: "center",
          render: (text, record) => (
        <Space size="small">
          {record?.status === 'Unpaid' ? (
              <>
              <Button
                onClick={() => showModal("view_payslip", record)}
                shape='round'
                size="small"
                {...BUTTON_CONFIGS.ACCENT({
                  fontSize: '12px',
                  fontWeight: '500'
                })}
              >
                📄 Payslip
              </Button>
                    
                    <Popconfirm
                title="Mark as Paid?"
                description="Are you sure you want to mark this payslip as paid?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => handleUpdatePayment(record)}
        >
                    <Button
                      disabled={loadingUpdatePayment}
                      shape='round'
                      size="small"
                      {...BUTTON_CONFIGS.SUCCESS({
                        fontSize: '12px',
                        fontWeight: '500'
                      })}
                    >
                      ✅ Mark Paid
                    </Button>
        </Popconfirm>

        <Popconfirm
                title="Delete Payslip?"
                description="Are you sure you want to delete this payslip?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => handleDeletePayment(record)}
        >
                    <Button
                      disabled={loadingDeletePayment}
                      shape='round'
                      size="small"
                      {...BUTTON_CONFIGS.PRIMARY({
                        fontSize: '12px',
                        fontWeight: '500',
                        background: '#ff3a6e',
                        borderColor: '#ff3a6e'
                      })}
                    >
                      🗑️ Delete
                    </Button>
                    </Popconfirm>
              </>
          ) : (
              <Button
                onClick={() => showModal("view_payslip", record)}
                shape='round'
                size="small"
                {...BUTTON_CONFIGS.ACCENT({
                  fontSize: '12px',
                  fontWeight: '500'
                })}
              >
                📄 Payslip
              </Button>
          )}
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
      📊 Employee Payslip Records
          </h3>
       
        </div>

        {/* Filter Section */}
        <div 
          style={{ 
            marginBottom: 24,
            padding: '24px',
            background: '#F8F8FF',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(94, 46, 145, 0.15)',
            border: '1px solid rgba(94, 46, 145, 0.1)'
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <h3 style={{ 
              color: '#4D4D4D', 
              margin: 0, 
              fontSize: '20px',
              fontWeight: '600'
            }}>
              🔍 Payslip Management
            </h3>
            <p style={{ 
              color: '#666', 
              margin: '8px 0 0 0',
              fontSize: '14px'
            }}>
              Generate payslips and manage bulk payments
            </p>
          </div>

                    <Row gutter={[20, 20]} align="stretch">
            {/* Generate Payslip Section */}
            <Col xs={24} sm={12} lg={8}>
              <div style={{ 
                background: '#ffffff', 
                padding: '16px', 
                borderRadius: '12px',
                border: '1px solid #E0E0E0',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '200px'
              }}>
                <h4 style={{ 
                  color: '#4D4D4D', 
                  margin: '0 0 16px 0', 
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  📄 Generate Payslip
                </h4>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <GeneratePayslipOption
                    jwt={jwt}
                    refetch={refetch}
                    paySlipmonths={paySlipmonths}
                    setPaySlipMonths={setPaySlipMonths}
                    paySlipyears={paySlipyears}
                    setPaySlipYears={setPaySlipYears}
                    paymentmonths={paymentmonths}
                    setPaymentMonths={setPaymentMonths}
                    paymentyears={paymentyears}
                    setPaymentYears={setPaymentYears}
                    setpage={setpage}
                    CoaForPayslipData={CoaForPayslipData}
                  />
                </div>
              </div>
            </Col>

            {/* Bulk Payment Section */}
            <Col xs={24} sm={12} lg={8}>
              <div style={{ 
                background: '#ffffff', 
                padding: '16px', 
                borderRadius: '12px',
                border: '1px solid #E0E0E0',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '200px'
              }}>
                <h4 style={{ 
                  color: '#4D4D4D', 
                  margin: '0 0 16px 0', 
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  💰 Bulk Payment
                </h4>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <GenerateBulkPaymentOption
                    jwt={jwt}
                    refetch={refetch}
                    paySlipmonths={paySlipmonths}
                    setPaySlipMonths={setPaySlipMonths}
                    paySlipyears={paySlipyears}
                    setPaySlipYears={setPaySlipYears}
                    paymentmonths={paymentmonths}
                    setPaymentMonths={setPaymentMonths}
                    paymentyears={paymentyears}
                    setPaymentYears={setPaymentYears}
                    setpage={setpage}
                    CoaForPayslipData={CoaForPayslipData}
                  />
                </div>
              </div>
            </Col>

            {/* Search Section */}
            <Col xs={24} sm={24} lg={8}>
              <div style={{ 
                background: '#ffffff', 
                padding: '16px', 
                borderRadius: '12px',
                border: '1px solid #E0E0E0',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '200px'
              }}>
                <h4 style={{ 
                  color: '#4D4D4D', 
                  margin: '0 0 16px 0', 
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  🔎 Search & Filter
                </h4>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <SearchOption
                    setSearch={setSearch}
                    paySlipmonths={paySlipmonths}
                    setPaySlipMonths={setPaySlipMonths}
                    paySlipyears={paySlipyears}
                    setPaySlipYears={setPaySlipYears}
                    paymentmonths={paymentmonths}
                    setPaymentMonths={setPaymentMonths}
                    paymentyears={paymentyears}
                    setPaymentYears={setPaymentYears}

                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Table Header */}
        {/* <div className="card-header">
          <div className="d-flex justify-content-between">
            <div>
              <h3 className="card-title mb-0" style={{ 
                marginTop: '15px',
                color: '#4D4D4D',
                fontSize: '24px',
                fontWeight: '600'
              }}>
                📊 Employee Payslip Records
              </h3>
              <p style={{ 
                color: '#666', 
                margin: '8px 0 0 0',
                fontSize: '14px'
              }}>
                Manage and view all employee payslip information
              </p>
            </div>
      </div>
      </div> */}



  

  
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
