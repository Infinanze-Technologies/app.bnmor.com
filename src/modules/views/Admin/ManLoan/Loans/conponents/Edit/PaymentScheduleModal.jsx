import React, { useState, useEffect } from 'react';
import { Modal, Button, message, Spin, Skeleton } from 'antd';
import { postRequest } from "@/hooks/apiService";
import { URL_GENERATE_REPAYMENT_SCHEDULE } from '@/config/api-paths';
import dayjs from 'dayjs';

const PaymentScheduleModal = (props) => {
  let jwt = props?.jwt;
  let record = props?.record;
  let LoanScheduleData = props?.LoanScheduleData?.data?.data;
  let setIsModalVisible = props?.setIsModalVisible;
  const [loading, setLoading] = useState(false);
  const [apiScheduleData, setApiScheduleData] = useState(null);
  
  
  const handleDownloadSchedule = () => {
    // Implementation for downloading schedule
    message.success('Repayment schedule downloaded successfully');
  };

  // Initialize with LoanScheduleData from props or use API data
  useEffect(() => {
    if (LoanScheduleData && LoanScheduleData.schedule && LoanScheduleData.summary) {
      // Use provided data structure from props
      const formattedSchedule = LoanScheduleData.schedule.map(item => ({
        dueDate: dayjs(item.due_date).format('DD-MM-YYYY'),
        description: `Installment ${item.installment_no}`,
        repayment: parseFloat(item.installment_amount).toFixed(2),
        principal: parseFloat(item.principal).toFixed(2),
        interest: parseFloat(item.interest).toFixed(2),
        fees: parseFloat(item.fees).toFixed(2),
        amount_paid: parseFloat(item.amount_paid || 0).toFixed(2),
        balance: parseFloat(item.balance).toFixed(2),
        status: item.status,
        isOverdue: item.is_overdue,
        daysOverdue: item.days_overdue,
        remainingAmount: parseFloat(item.remaining_amount).toFixed(2)
      }));

      setApiScheduleData({
        schedule: formattedSchedule,
        summary: LoanScheduleData.summary,
        totalRepayment: parseFloat(LoanScheduleData.summary.total_repayment).toFixed(2)
      });
    } else if (record && jwt) {
      generateScheduleFromAPI();
    }
  }, [record, jwt, LoanScheduleData]);



  const generateScheduleFromAPI = async () => {
    if (!record || !jwt) return;

    setLoading(true);
    try {
      const requestData = {
        loan_amount: parseFloat(record.loan_amount) || 0,
        loan_duration: parseInt(record.loan_duration) || 1,
        loan_duration_type: "Fixed",
        loan_period: record.loan_period || "Months",
        loan_release_date: record.loan_release_date ? dayjs(record.loan_release_date).format('YYYY-MM-DD') : "",
        interest_rate: parseFloat(record.interest_rate) || 0,
        interest_cycle: record.interest_cycle || "Monthly",
        repayment_cycle: record.repayment_cycle || "Monthly",
        installment_type: getInstallmentType(record.repayment_cycle),
        interest_method: record.interest_method || "Flat",
        loan_fees: (record.fees || []).map(fee => ({
          name: fee.name,
          fee_type: fee.fee_type === 'Fixed' ? 'Fixed' : 'Percentage',
          calculate_on: fee.calculate_on || "Fixed Amount",
          fee_percentage: fee.fee_type === 'Percentage' ? parseFloat(fee.fee_percentage) || 0 : 0,
          fee_amount: fee.fee_type === 'Fixed' ? parseFloat(fee.fee_amount) || 0 : 0,
          deduct_from_principal: fee.deduct_from_principal || false,
          spread_across_repayments: fee.spread_across_repayments || false
        }))
      };
      // console.log(requestData);
      // console.log(jwt);
      // return;

      const response = await postRequest(URL_GENERATE_REPAYMENT_SCHEDULE, requestData, jwt);
      
      // console.log('API Response:', response);
      // console.log('Response structure:', {
      //   hasResponse: !!response,
      //   hasData: !!(response && response.data),
      //   hasSchedule: !!(response && response.data && response.data.schedule),
      //   isScheduleArray: !!(response && response.data && response.data.schedule && Array.isArray(response.data.schedule)),
      //   responseKeys: response ? Object.keys(response) : [],
      //   dataKeys: response && response.data ? Object.keys(response.data) : []
      // });
      
      // Handle different possible response structures
      let scheduleData = null;
      let totalRepayment = '0.00';
      
      if (response && response.data) {
        // Check if schedule is directly in response.data
        if (response.data.schedule && Array.isArray(response.data.schedule)) {
          scheduleData = response.data.schedule;
          totalRepayment = response.data.total_repayment || '0.00';
        }
        // Check if schedule is in response.data.data (nested structure)
        else if (response.data.data && response.data.data.schedule && Array.isArray(response.data.data.schedule)) {
          scheduleData = response.data.data.schedule;
          totalRepayment = response.data.data.total_repayment || '0.00';
        }
        // Check if the response itself is the schedule array
        else if (Array.isArray(response.data)) {
          scheduleData = response.data;
          totalRepayment = '0.00'; // Will calculate from schedule
        }
      }
      
      if (scheduleData && scheduleData.length > 0) {
        // Convert API response to our expected format
        const convertedSchedule = scheduleData.map(item => ({
          dueDate: dayjs(item.due_date).format('DD-MM-YYYY'),
          description: `Installment ${item.installment_no}`,
          repayment: item.installment_amount.toFixed(2),
          principal: item.principal.toFixed(2),
          interest: item.interest.toFixed(2),
          fees: item.fees.toFixed(2),
          amount_paid: (item.amount_paid || 0).toFixed(2),
          balance: item.balance.toFixed(2)
        }));

        // Calculate total repayment from schedule if not provided
        const calculatedTotal = totalRepayment === '0.00' 
          ? convertedSchedule.reduce((sum, item) => sum + parseFloat(item.repayment), 0).toFixed(2)
          : totalRepayment;

        setApiScheduleData({
          schedule: convertedSchedule,
          totalRepayment: calculatedTotal
        });
      } else {
        // console.error('Invalid API response structure:', response);
        message.error('Invalid response from repayment schedule API');
      }
    } catch (error) {
      // console.error('Error generating schedule:', error);
      message.error('Failed to generate repayment schedule');
    } finally {
      setLoading(false);
    }
  };

  // Function to determine installment type based on repayment cycle
  const getInstallmentType = (repaymentCycle) => {
    switch (repaymentCycle) {
      case 'Once':
        return 'OTI';
      case 'Daily':
        return 'EDI';
      case 'Weekly':
        return 'EWI';
      case 'Monthly':
        return 'EMI';
      case 'Yearly':
        return 'EYI';
      default:
        return 'OTI';
    }
  };

  // Show skeleton while loading or if no data
  if (loading || (!apiScheduleData || !apiScheduleData.schedule) && !LoanScheduleData) {
    return (
      <div style={{ padding: '0 16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16, color: '#666' }}>Generating repayment schedule...</div>
          </div>
        ) : (
          <div style={{ padding: '20px 0' }}>
            {/* Skeleton for table header */}
            <div style={{ 
              border: '1px solid #e8e8e8', 
              borderRadius: 8, 
              overflow: 'hidden',
              marginBottom: 16
            }}>
              <div style={{ 
                backgroundColor: '#fafafa',
                padding: '12px 8px',
                borderBottom: '1px solid #e8e8e8'
              }}>
                <Skeleton.Input 
                  active 
                  size="small" 
                  style={{ width: '100%', height: 20 }} 
                />
              </div>
              
              {/* Skeleton for table rows */}
              {[1, 2, 3].map((index) => (
                <div key={index} style={{ 
                  padding: '12px 8px',
                  borderBottom: index < 3 ? '1px solid #f0f0f0' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Skeleton.Input 
                    active 
                    size="small" 
                    style={{ width: '15%', height: 16 }} 
                  />
                  <Skeleton.Input 
                    active 
                    size="small" 
                    style={{ width: '15%', height: 16 }} 
                  />
                  <Skeleton.Input 
                    active 
                    size="small" 
                    style={{ width: '15%', height: 16 }} 
                  />
                  <Skeleton.Input 
                    active 
                    size="small" 
                    style={{ width: '15%', height: 16 }} 
                  />
                  <Skeleton.Input 
                    active 
                    size="small" 
                    style={{ width: '15%', height: 16 }} 
                  />
                  <Skeleton.Input 
                    active 
                    size="small" 
                    style={{ width: '15%', height: 16 }} 
                  />
                  <Skeleton.Input 
                    active 
                    size="small" 
                    style={{ width: '10%', height: 16 }} 
                  />
                </div>
              ))}
            </div>

            {/* Skeleton for total repayment */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '16px 0',
              borderTop: '1px solid #e8e8e8',
              marginTop: 16
            }}>
              <Skeleton.Input 
                active 
                size="small" 
                style={{ width: '30%', height: 20 }} 
              />
              <Skeleton.Input 
                active 
                size="small" 
                style={{ width: '20%', height: 20 }} 
              />
            </div>

            {/* Skeleton for download button */}
            <div style={{ 
              textAlign: 'center', 
              marginTop: 24,
              paddingTop: 16,
              borderTop: '1px solid #e8e8e8'
            }}>
              <Skeleton.Button 
                active 
                size="default" 
                style={{ width: 180, height: 40 }} 
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // If we have LoanScheduleData but apiScheduleData is not set yet, format it directly
  const displayData = apiScheduleData || (LoanScheduleData && LoanScheduleData.schedule && LoanScheduleData.summary ? {
    schedule: LoanScheduleData.schedule.map(item => ({
      dueDate: dayjs(item.due_date).format('DD-MM-YYYY'),
      description: `Installment ${item.installment_no}`,
      repayment: parseFloat(item.installment_amount).toFixed(2),
      principal: parseFloat(item.principal).toFixed(2),
      interest: parseFloat(item.interest).toFixed(2),
      fees: parseFloat(item.fees).toFixed(2),
      amount_paid: parseFloat(item.amount_paid || 0).toFixed(2),
      balance: parseFloat(item.balance).toFixed(2),
      status: item.status,
      isOverdue: item.is_overdue,
      daysOverdue: item.days_overdue,
      remainingAmount: parseFloat(item.remaining_amount).toFixed(2)
    })),
    summary: LoanScheduleData.summary,
    totalRepayment: parseFloat(LoanScheduleData.summary.total_repayment).toFixed(2)
  } : null);

  return (
      <div style={{ padding: '0 16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16, color: '#666' }}>Generating repayment schedule...</div>
          </div>
        ) : displayData ? (
          <>
            {/* Schedule Table */}
            <div style={{ 
              border: '1px solid #e8e8e8', 
              borderRadius: 8, 
              overflow: 'hidden',
              marginBottom: 16
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                fontSize: 12
              }}>
                <thead>
                  <tr style={{ 
                    backgroundColor: '#fafafa',
                    borderBottom: '1px solid #e8e8e8'
                  }}>
                    <th style={{ 
                      padding: '12px 8px', 
                      textAlign: 'left', 
                      fontWeight: 600,
                      borderRight: '1px solid #e8e8e8',
                      minWidth: 100
                    }}>
                      Due Date
                    </th>
                    <th style={{ 
                      padding: '12px 8px', 
                      textAlign: 'left', 
                      fontWeight: 600,
                      borderRight: '1px solid #e8e8e8',
                      minWidth: 100
                    }}>
                      Description
                    </th>
                    <th style={{ 
                      padding: '12px 8px', 
                      textAlign: 'center', 
                      fontWeight: 600,
                      borderRight: '1px solid #e8e8e8',
                      minWidth: 80
                    }}>
                      Status
                    </th>
                    <th style={{ 
                      padding: '12px 8px', 
                      textAlign: 'right', 
                      fontWeight: 600,
                      borderRight: '1px solid #e8e8e8',
                      minWidth: 120
                    }}>
                      Repayment
                    </th>
                    <th style={{ 
                      padding: '12px 8px', 
                      textAlign: 'right', 
                      fontWeight: 600,
                      borderRight: '1px solid #e8e8e8',
                      minWidth: 100
                    }}>
                      Principal
                    </th>
                    <th style={{ 
                      padding: '12px 8px', 
                      textAlign: 'right', 
                      fontWeight: 600,
                      borderRight: '1px solid #e8e8e8',
                      minWidth: 100
                    }}>
                      Interest
                    </th>
                    <th style={{ 
                      padding: '12px 8px', 
                      textAlign: 'right', 
                      fontWeight: 600,
                      borderRight: '1px solid #e8e8e8',
                      minWidth: 100
                    }}>
                      Fees
                    </th>
                    <th style={{ 
                      padding: '12px 8px', 
                      textAlign: 'right', 
                      fontWeight: 600,
                      minWidth: 120
                    }}>
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayData.schedule.map((row, index) => (
                <tr key={index} style={{ 
                  borderBottom: index < displayData.schedule.length - 1 ? '1px solid #f0f0f0' : 'none',
                  backgroundColor: row.isOverdue ? '#fff2f0' : row.status === 'PAID' ? '#f6ffed' : 'transparent'
                }}>
                  <td style={{ 
                    padding: '12px 8px', 
                    borderRight: '1px solid #e8e8e8',
                    color: '#333',
                    fontWeight: 500
                  }}>
                    {row.dueDate}
                  </td>
                  <td style={{ 
                    padding: '12px 8px', 
                    borderRight: '1px solid #e8e8e8',
                    color: '#666'
                  }}>
                    {row.description}
                  </td>
                  <td style={{ 
                    padding: '12px 8px', 
                    textAlign: 'center',
                    borderRight: '1px solid #e8e8e8'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '10px',
                        fontWeight: 500,
                        backgroundColor: row.status === 'PAID' ? '#52c41a' : 
                                     row.status === 'PARTIAL' ? '#1890ff' :
                                     row.isOverdue ? '#ff4d4f' : '#faad14',
                        color: 'white'
                      }}>
                        {row.status}
                      </span>
                      <div style={{ 
                        fontSize: '11px', 
                        color: '#666',
                        fontWeight: 500
                      }}>
                        Paid: {row.amount_paid || '0.00'}
                      </div>
                      {row.isOverdue && (
                        <div style={{ 
                          fontSize: '9px', 
                          color: '#ff4d4f', 
                          marginTop: '2px' 
                        }}>
                          {row.daysOverdue} days overdue
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ 
                    padding: '12px 8px', 
                    textAlign: 'right',
                    borderRight: '1px solid #e8e8e8',
                    color: '#333',
                    fontWeight: row.repayment ? 600 : 400
                  }}>
                    {row.repayment}
                  </td>
                  <td style={{ 
                    padding: '12px 8px', 
                    textAlign: 'right',
                    borderRight: '1px solid #e8e8e8',
                    color: '#333'
                  }}>
                    {row.principal}
                  </td>
                  <td style={{ 
                    padding: '12px 8px', 
                    textAlign: 'right',
                    borderRight: '1px solid #e8e8e8',
                    color: '#333'
                  }}>
                    {row.interest}
                  </td>
                  <td style={{ 
                    padding: '12px 8px', 
                    textAlign: 'right',
                    borderRight: '1px solid #e8e8e8',
                    color: '#333'
                  }}>
                    {row.fees}
                  </td>
                  <td style={{ 
                    padding: '12px 8px', 
                    textAlign: 'right',
                    color: '#333',
                    fontWeight: 600
                  }}>
                    {row.balance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Comprehensive Summary Section */}
        <div style={{ 
          border: '1px solid #e8e8e8', 
          borderRadius: 8, 
          padding: '20px',
          marginTop: 16,
          backgroundColor: '#fafafa'
        }}>
          <h3 style={{ 
            margin: '0 0 16px 0', 
            color: '#2a3f54', 
            fontSize: 18,
            fontWeight: 600
          }}>
            Loan Summary
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px'
          }}>
            {/* Basic Information */}
            <div style={{ 
              backgroundColor: 'white', 
              padding: '16px', 
              borderRadius: 6,
              border: '1px solid #e8e8e8'
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#2a3f54', fontSize: 14, fontWeight: 600 }}>
                Basic Information
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#666', fontSize: 13 }}>Total Installments:</span>
                <span style={{ fontWeight: 600, color: '#333' }}>
                  {displayData.summary?.total_installments || 0}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#666', fontSize: 13 }}>Completion:</span>
                <span style={{ fontWeight: 600, color: '#333' }}>
                  {displayData.summary?.completion_percentage || 0}%
                </span>
              </div>
            </div>

            {/* Principal Information */}
            <div style={{ 
              backgroundColor: 'white', 
              padding: '16px', 
              borderRadius: 6,
              border: '1px solid #e8e8e8'
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#2a3f54', fontSize: 14, fontWeight: 600 }}>
                Principal
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#666', fontSize: 13 }}>Total Principal:</span>
                <span style={{ fontWeight: 600, color: '#333' }}>
                  ${parseFloat(displayData.summary?.total_principal || 0).toFixed(2)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#666', fontSize: 13 }}>Paid Principal:</span>
                <span style={{ fontWeight: 600, color: '#52c41a' }}>
                  ${parseFloat(displayData.summary?.total_paid_principal || 0).toFixed(2)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666', fontSize: 13 }}>Remaining:</span>
                <span style={{ fontWeight: 600, color: '#ff4d4f' }}>
                  ${parseFloat(displayData.summary?.remaining_principal || 0).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Interest & Fees */}
            <div style={{ 
              backgroundColor: 'white', 
              padding: '16px', 
              borderRadius: 6,
              border: '1px solid #e8e8e8'
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#2a3f54', fontSize: 14, fontWeight: 600 }}>
                Interest & Fees
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#666', fontSize: 13 }}>Total Interest:</span>
                <span style={{ fontWeight: 600, color: '#333' }}>
                  ${parseFloat(displayData.summary?.total_interest || 0).toFixed(2)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#666', fontSize: 13 }}>Total Fees:</span>
                <span style={{ fontWeight: 600, color: '#333' }}>
                  ${parseFloat(displayData.summary?.total_fees || 0).toFixed(2)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666', fontSize: 13 }}>Paid Interest:</span>
                <span style={{ fontWeight: 600, color: '#52c41a' }}>
                  ${parseFloat(displayData.summary?.total_paid_interest || 0).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Summary */}
            <div style={{ 
              backgroundColor: 'white', 
              padding: '16px', 
              borderRadius: 6,
              border: '1px solid #e8e8e8'
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#2a3f54', fontSize: 14, fontWeight: 600 }}>
                Payment Summary
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#666', fontSize: 13 }}>Total Repayment:</span>
                <span style={{ fontWeight: 600, color: '#2a3f54' }}>
                  ${parseFloat(displayData.summary?.total_repayment || 0).toFixed(2)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#666', fontSize: 13 }}>Total Paid:</span>
                <span style={{ fontWeight: 600, color: '#52c41a' }}>
                  ${parseFloat(displayData.summary?.total_paid_amount || 0).toFixed(2)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666', fontSize: 13 }}>Outstanding:</span>
                <span style={{ fontWeight: 600, color: '#ff4d4f' }}>
                  ${parseFloat(displayData.summary?.outstanding_balance || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Download Button */}
        {/* <div style={{ 
          textAlign: 'center', 
          marginTop: 24,
          paddingTop: 16,
          borderTop: '1px solid #e8e8e8'
        }}>
          <Button
            type="primary"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 8 }}>
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
            }
            onClick={handleDownloadSchedule}
            style={{
              backgroundColor: '#722ed1',
              borderColor: '#722ed1',
              borderRadius: 6,
              height: 40,
              paddingLeft: 24,
              paddingRight: 24
            }}
          >
            Download Schedule
          </Button>
        </div> */}
          </>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 0',
            color: '#666'
          }}>
            No schedule data available
          </div>
        )}
      </div>
  );
};

export default PaymentScheduleModal;
