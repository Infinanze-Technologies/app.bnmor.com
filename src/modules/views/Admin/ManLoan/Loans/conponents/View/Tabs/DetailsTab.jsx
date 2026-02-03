import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Tag, Space } from 'antd';
import { 
  UserOutlined, 
  DollarOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined,
  PercentageOutlined,
  FileTextOutlined,
  ReloadOutlined,
  EditOutlined,
  MessageOutlined,
  PhoneOutlined,
  MailOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { formatDateHuman } from '@/config/DateFormat';

const { Title, Text } = Typography;

const DetailsTab = ({ singleLoanDataObject, jwt, LoanScheduleData }) => {
  const [calculatedInstallmentAmount, setCalculatedInstallmentAmount] = useState(0);

  let LoanScheduleDataObject = LoanScheduleData?.data?.data?.summary;

  // Function to determine installment type based on repayment cycle
  const getInstallmentType = (repaymentCycle) => {
    switch (repaymentCycle) {
      case 'Once':
        return 'OTI'; // One-Time Installment
      case 'Daily':
        return 'EDI'; // Equated Daily Installment
      case 'Weekly':
        return 'EWI'; // Equated Weekly Installment
      case 'Monthly':
        return 'EMI'; // Equated Monthly Installment
      case 'Yearly':
        return 'EYI'; // Equated Yearly Installment
      default:
        return 'OTI';
    }
  };

  // Calculate installment amount from payment schedule
  const calculateInstallmentAmount = () => {
    if (!singleLoanDataObject) return 0;

    const {
      loan_amount,
      loan_duration,
      loan_period,
      interest_rate,
      interest_method,
      repayment_cycle,
      loan_release_date,
      fees = []
    } = singleLoanDataObject;



    const principal = Number(loan_amount) || 0;
    const duration = Number(loan_duration) || 1;
    const rate = Number(interest_rate) || 0;
    const releaseDate = loan_release_date ? dayjs(loan_release_date) : dayjs();

    // Calculate total interest based on interest method
    let totalInterest = 0;
    let totalAmount = 0;

    if (interest_method === 'Reducing Balance') {
      // For reducing balance, we need to calculate EMI (Equated Monthly Installment)
      const monthlyRate = rate / 100 / 12; // Assuming rate is annual
      const numberOfMonths = loan_period === 'Months' ? duration : 
                            loan_period === 'Years' ? duration * 12 :
                            loan_period === 'Days' ? duration / 30 : duration;
      
      if (monthlyRate > 0) {
        const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths) / 
                   (Math.pow(1 + monthlyRate, numberOfMonths) - 1);
        totalAmount = emi * numberOfMonths;
        totalInterest = totalAmount - principal;
      } else {
        totalInterest = 0;
        totalAmount = principal;
      }
    } else {
      // Flat interest calculation - need to convert duration to years for proper calculation
      let durationInYears = duration;
      if (loan_period === 'Days') {
        durationInYears = duration / 365;
      } else if (loan_period === 'Weeks') {
        durationInYears = duration / 52;
      } else if (loan_period === 'Months') {
        durationInYears = duration / 12;
      } else if (loan_period === 'Years') {
        durationInYears = duration;
      }
      
      totalInterest = (principal * rate * durationInYears) / 100;
      totalAmount = principal + totalInterest;
    }

    // Calculate fees
    let totalFees = 0;
    let feesToDeductFromPrincipal = 0;

    if (fees && fees.length > 0) {
      fees.forEach((fee) => {
        let feeAmount = 0;
        
        // Calculate fee amount based on type
        if (fee.fee_type === 'Percentage') {
          let calculateOnAmount = 0;
          
          // Determine what to calculate the percentage on
          switch (fee.calculate_on) {
            case 'Principal Amount':
              calculateOnAmount = principal;
              break;
            case 'Interest Amount':
              calculateOnAmount = totalInterest;
              break;
            case 'Principal + Interest Amount':
              calculateOnAmount = principal + totalInterest;
              break;
            default:
              calculateOnAmount = principal;
          }
          
          feeAmount = (calculateOnAmount * parseFloat(fee.fee_percentage || 0)) / 100;
        } else {
          // Fixed amount
          feeAmount = parseFloat(fee.fee_amount || 0);
        }

        totalFees += feeAmount;

        // Handle fee deduction options
        if (fee.deduct_from_principal) {
          feesToDeductFromPrincipal += feeAmount;
        }
      });
    }

    // Adjust total amount to include fees
    totalAmount += totalFees - feesToDeductFromPrincipal;

    // Calculate installment amount based on installment type and duration period
    let numberOfInstallments = 1;
    const installmentType = getInstallmentType(repayment_cycle);

    switch (installmentType) {
      case 'OTI':
        numberOfInstallments = 1;
        break;
      case 'EDI':
        // For daily installments, calculate based on duration period
        if (loan_period === 'Days') {
          numberOfInstallments = duration;
        } else if (loan_period === 'Weeks') {
          numberOfInstallments = duration * 7;
        } else if (loan_period === 'Months') {
          numberOfInstallments = duration * 30;
        } else if (loan_period === 'Years') {
          numberOfInstallments = duration * 365;
        }
        break;
      case 'EWI':
        // For weekly installments, calculate based on duration period
        if (loan_period === 'Days') {
          numberOfInstallments = Math.ceil(duration / 7);
        } else if (loan_period === 'Weeks') {
          numberOfInstallments = duration;
        } else if (loan_period === 'Months') {
          numberOfInstallments = duration * 4;
        } else if (loan_period === 'Years') {
          numberOfInstallments = duration * 52;
        }
        break;
      case 'EMI':
        // For monthly installments, calculate based on duration period
        if (loan_period === 'Days') {
          numberOfInstallments = Math.ceil(duration / 30);
        } else if (loan_period === 'Weeks') {
          numberOfInstallments = Math.ceil(duration / 4);
        } else if (loan_period === 'Months') {
          numberOfInstallments = duration;
        } else if (loan_period === 'Years') {
          numberOfInstallments = duration * 12;
        }
        break;
      case 'EYI':
        // For yearly installments, calculate based on duration period
        if (loan_period === 'Days') {
          numberOfInstallments = Math.ceil(duration / 365);
        } else if (loan_period === 'Weeks') {
          numberOfInstallments = Math.ceil(duration / 52);
        } else if (loan_period === 'Months') {
          numberOfInstallments = Math.ceil(duration / 12);
        } else if (loan_period === 'Years') {
          numberOfInstallments = duration;
        }
        break;
      default:
        numberOfInstallments = 1;
    }

    const installmentAmount = Number((totalAmount / numberOfInstallments).toFixed(2));
    return installmentAmount;
  };

  // Calculate installment amount when component mounts or data changes
  useEffect(() => {
    if (singleLoanDataObject) {
      const amount = calculateInstallmentAmount();
      setCalculatedInstallmentAmount(amount);
    }
  }, [singleLoanDataObject]);

  // Function to render custom repayment schedule
  const renderCustomRepaymentSchedule = (singleLoanDataObject) => {
    // Define the days of week structure
    const daysOfWeek = [
      { key: 'monday', label: 'Monday' },
      { key: 'tuesday', label: 'Tuesday' },
      { key: 'wednesday', label: 'Wednesday' },
      { key: 'thursday', label: 'Thursday' },
      { key: 'friday', label: 'Friday' },
      { key: 'saturday', label: 'Saturday' },
      { key: 'sunday', label: 'Sunday' }
    ];

    // Check if custom installment is enabled and get the selected days
    const isCustomInstallmentEnabled = singleLoanDataObject?.enable_custom_installment;
    const selectedDays = singleLoanDataObject?.custom_installment_type || [];
    
    return (
      <div>
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>Repayment days</Text>
        {isCustomInstallmentEnabled && selectedDays.length > 0 ? (
          <Row gutter={[8, 8]}>
            {daysOfWeek.map((day) => {
              const isEnabled = selectedDays.includes(day.key);
              return (
                <Col key={day.key}>
                  <div
                    style={{
                      padding: '8px 12px',
                      border: isEnabled ? '2px solid #722ed1' : '1px solid #d9d9d9',
                      borderRadius: 6,
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: isEnabled ? '#f0f0ff' : 'white',
                      color: isEnabled ? '#722ed1' : '#666',
                      fontWeight: isEnabled ? 'bold' : 'normal',
                      minWidth: '80px'
                    }}
                  >
                    {day.label}
                  </div>
                </Col>
              );
            })}
          </Row>
        ) : (
          <div style={{ 
            padding: '20px', 
            textAlign: 'center', 
            color: '#999',
            backgroundColor: '#fafafa',
            borderRadius: 6,
            border: '1px dashed #d9d9d9'
          }}>
            <Text type="secondary">
              {!isCustomInstallmentEnabled 
                ? 'Custom repayment schedule is not enabled for this loan' 
                : 'No custom repayment days configured for this loan'
              }
            </Text>
          </div>
        )}
      </div>
    );
  };



  // "next_payment_date": "2025-09-27",
  // "periodic_repayment": 17091.73,
  // "total_amount_due": 51275.19,
  // "total_amount_paid": 0,
  // "next_payment_amount_due": 17091.73

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px',
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <Title level={2} style={{ margin: 0, color: '#2a3f54' }}>Loan Details</Title>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Tag color="green" style={{ fontSize: '14px', padding: '4px 12px', borderRadius: '20px' }}>
            {singleLoanDataObject?.loan_status || 'Active'}
          </Tag>
     
        </div>
      </div>

      {/* Main Content - Two Columns */}
      <Row gutter={[24, 24]}>
        {/* Left Column */}
        <Col xs={24} lg={12}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Loan Information */}
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FileTextOutlined style={{ color: '#722ed1' }} />
                  <span style={{ fontWeight: 600, color: '#2a3f54' }}>Loan Information</span>
                </div>
              }
              bordered={false}
              style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px 20px' }}
              bodyStyle={{ padding: '20px' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: '#666', fontSize: 14 }}>Loan Number</Text>
                  <Text strong style={{ fontSize: 16, color: '#2a3f54' }}>{`001`}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ClockCircleOutlined style={{ color: '#666' }} />
                    <Text style={{ color: '#666', fontSize: 14 }}>Duration</Text>
                  </div>
                  <Text strong style={{ fontSize: 16, color: '#2a3f54' }}>{singleLoanDataObject?.loan_duration} {singleLoanDataObject?.loan_period}</Text>
                </div>
              </div>
            </Card>

            {/* Amount Details */}
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <DollarOutlined style={{ color: '#722ed1' }} />
                  <span style={{ fontWeight: 600, color: '#2a3f54' }}>Amount Details</span>
                </div>
              }
              bordered={false}
              style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px 20px' }}
              bodyStyle={{ padding: '20px' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <DollarOutlined style={{ color: '#666' }} />
                    <Text style={{ color: '#666', fontSize: 14 }}>Principal Amount</Text>
                  </div>
                  <Text strong style={{ fontSize: 16, color: '#2a3f54' }}>GH₵{singleLoanDataObject?.loan_amount || '0.00'} GHS</Text>
                </div>
                {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <DollarOutlined style={{ color: '#666' }} />
                    <Text style={{ color: '#666', fontSize: 14 }}>Principal Less Deductable Fees</Text>
                  </div>
                  <Text strong style={{ fontSize: 16, color: '#2a3f54' }}>GH₵{singleLoanDataObject?.principal_less_deductable_fees || '0.00'} GHS</Text>
                </div> */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <PercentageOutlined style={{ color: '#666' }} />
                    <Text style={{ color: '#666', fontSize: 14 }}>Interest Rate</Text>
                  </div>
                  <Text strong style={{ fontSize: 16, color: '#2a3f54' }}>{singleLoanDataObject?.interest_rate || '10'}% {singleLoanDataObject?.interest_cycle || 'once'}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FileTextOutlined style={{ color: '#666' }} />
                    <Text style={{ color: '#666', fontSize: 14 }}>Interest Method</Text>
                  </div>
                  <Text strong style={{ fontSize: 16, color: '#2a3f54' }}>{singleLoanDataObject?.interest_method || 'Flat'}</Text>
                </div>
              </div>
            </Card>
          </div>
        </Col>

        {/* Right Column */}
        <Col xs={24} lg={12}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Important Dates */}
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CalendarOutlined style={{ color: '#722ed1' }} />
                  <span style={{ fontWeight: 600, color: '#2a3f54' }}>Important Dates</span>
                </div>
              }
              bordered={false}
              style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px 20px' }}
              bodyStyle={{ padding: '20px' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CalendarOutlined style={{ color: '#666' }} />
                    <Text style={{ color: '#666', fontSize: 14 }}>Creation Date</Text>
                  </div>
                  <Text strong style={{ fontSize: 16, color: '#2a3f54' }}>{formatDateHuman(singleLoanDataObject?.createdAt )|| 'N/A'}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CalendarOutlined style={{ color: '#666' }} />
                    <Text style={{ color: '#666', fontSize: 14 }}>Release Date</Text>
                  </div>
                  <Text strong style={{ fontSize: 16, color: '#2a3f54' }}>{formatDateHuman(singleLoanDataObject?.loan_release_date) || 'N/A'}</Text>
                </div>
                {singleLoanDataObject?.loan_status === 'Active' && (
               
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CalendarOutlined style={{ color: '#666' }} />
                    <Text style={{ color: '#666', fontSize: 14 }}>Next Payment Date</Text>
                  </div>
                  <Text strong style={{ fontSize: 16, color: '#2a3f54' }}>{formatDateHuman(LoanScheduleDataObject?.next_payment_date) || 'N/A'}</Text>
                </div>
           
              
              )}

{singleLoanDataObject?.loan_status === 'Completed' && ( 
               
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                   <CalendarOutlined style={{ color: '#666' }} />
                   <Text style={{ color: '#666', fontSize: 14 }}>Completed At</Text>
                 </div>
                 <Text strong style={{ fontSize: 16, color: '#2a3f54' }}>{formatDateHuman(singleLoanDataObject?.completedAt) || 'N/A'}</Text>
               </div>
          
             
             )}
              </div>
            </Card>

            {/* Repayment Details */}
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ReloadOutlined style={{ color: '#722ed1' }} />
                  <span style={{ fontWeight: 600, color: '#2a3f54' }}>Repayment Details</span>
                </div>
              }
              bordered={false}
              style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px 20px' }}
              bodyStyle={{ padding: '20px' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ReloadOutlined style={{ color: '#666' }} />
                    <Text style={{ color: '#666', fontSize: 14 }}>Repayment Cycle</Text>
                  </div>
                  <Text strong style={{ fontSize: 16, color: '#2a3f54' }}>{singleLoanDataObject?.repayment_cycle || 'Weekly'}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <DollarOutlined style={{ color: '#666' }} />
                    <Text style={{ color: '#666', fontSize: 14 }}>Periodic Repayment</Text>
                  </div>
                  <Text strong style={{ fontSize: 16, color: '#2a3f54' }}>{Number(LoanScheduleDataObject?.periodic_repayment) || '0'} GHS</Text>
                </div>
                {singleLoanDataObject?.loan_status === 'Active' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <DollarOutlined style={{ color: '#666' }} />
                    <Text style={{ color: '#666', fontSize: 14 }}>Total Amount Due</Text>
                  </div>
                  <Text strong style={{ fontSize: 16, color: '#2a3f54' }}>GH₵{Number(LoanScheduleDataObject?.total_amount_due) || '0.00'} GHS</Text>
                </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <DollarOutlined style={{ color: '#666' }} />
                    <Text style={{ color: '#666', fontSize: 14 }}>Total Amount Paid</Text>
                  </div>
                  <Text strong style={{ fontSize: 16, color: '#2a3f54' }}>GH₵{Number(LoanScheduleDataObject?.total_paid_amount) || '0.00'} GHS</Text>
                </div>
                {singleLoanDataObject?.loan_status === 'Active' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <DollarOutlined style={{ color: '#666' }} />
                    <Text style={{ color: '#666', fontSize: 14 }}>Next Payment Amount Due</Text>
                  </div>
                  <Text strong style={{ fontSize: 16, color: '#2a3f54' }}>GH₵{Number(LoanScheduleDataObject?.next_payment_amount_due) || '0.00'} GHS</Text>
                </div>    
             )}

{singleLoanDataObject?.loan_status === 'Completed' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <DollarOutlined style={{ color: '#666' }} />
                    <Text style={{ color: '#666', fontSize: 14 }}>Outstanding Balance</Text>
                  </div>
                  <Text strong style={{ fontSize: 16, color: '#2a3f54' }}>GH₵{Number(LoanScheduleDataObject?.outstanding_balance) || '0.00'} GHS</Text>
                </div>    
             )}
              </div>
            </Card>

          </div>
        </Col>
      </Row>

      {/* Installment Type Details - Full Width Row */}
      <Row style={{ marginTop: '24px' }}>
        <Col xs={24}>
          <Card 
            bordered={false}
            style={{ 
              borderRadius: 12, 
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              backgroundColor: '#fafafa',
              border: '1px solid #e8e8e8'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            {/* Title Section */}
            <div style={{ marginBottom: '16px' }}>
              <Text style={{ 
                fontSize: 18, 
                fontWeight: 600, 
                color: '#2a3f54',
                display: 'block',
                marginBottom: '8px'
              }}>
                Custom Installment Type
              </Text>
              <Text style={{ 
                fontSize: 14, 
                color: '#666',
                lineHeight: '1.4'
              }}>
                Configure custom installment calculation method for this loan
              </Text>
            </div>

            {/* Toggle Section */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '20px',
              padding: '16px',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #e8e8e8'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: singleLoanDataObject?.custom_installment_type ? '#52c41a' : '#d9d9d9'
                }} />
                <Text style={{ 
                  fontSize: 14, 
                  fontWeight: 500, 
                  color: '#2a3f54'
                }}>
                  Enable Custom Installment Type
                </Text>
              </div>
              <div style={{
                width: 44,
                height: 22,
                borderRadius: '11px',
                backgroundColor: singleLoanDataObject?.custom_installment_type ? '#722ed1' : '#d9d9d9',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  position: 'absolute',
                  top: '2px',
                  left: singleLoanDataObject?.custom_installment_type ? '24px' : '2px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }} />
              </div>
            </div>

            {/* Custom Repayment Schedule Display */}
            {singleLoanDataObject?.custom_installment_type && (
              <div style={{
                padding: '16px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #e8e8e8'
              }}>
                {renderCustomRepaymentSchedule(singleLoanDataObject)}
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Action Buttons */}
      <div style={{ 
        marginTop: '32px',
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Button 
              icon={<MessageOutlined />} 
              style={{ 
                width: '100%', 
                height: '40px',
                borderRadius: '8px',
                border: '1px solid #d9d9d9',
                backgroundColor: 'white',
                color: '#666'
              }}
            >
              Send SMS Reminder
            </Button>
          </Col>
          <Col xs={24} sm={8}>
            <Button 
              icon={<PhoneOutlined />} 
              style={{ 
                width: '100%', 
                height: '40px',
                borderRadius: '8px',
                border: '1px solid #d9d9d9',
                backgroundColor: 'white',
                color: '#666'
              }}
            >
              Send WhatsApp Reminder
            </Button>
          </Col>
          <Col xs={24} sm={8}>
            <Button 
              icon={<MailOutlined />} 
              style={{ 
                width: '100%', 
                height: '40px',
                borderRadius: '8px',
                border: '1px solid #d9d9d9',
                backgroundColor: 'white',
                color: '#666'
              }}
            >
              Send Email Reminder
            </Button>
          </Col>
          {/* <Col xs={24} sm={12}>
            <Button 
              icon={<PrinterOutlined />} 
              style={{ 
                width: '100%', 
                height: '40px',
                borderRadius: '8px',
                border: '1px solid #d9d9d9',
                backgroundColor: 'white',
                color: '#666'
              }}
            >
              Print Statement
            </Button>
          </Col>
          <Col xs={24} sm={12}>
            <Button 
              type="primary"
              style={{ 
                width: '100%', 
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#722ed1',
                border: 'none'
              }}
            >
              View Repayment Schedule
            </Button>
          </Col> */}
        </Row>
      </div>
    </div>
  );
};

export default DetailsTab; 