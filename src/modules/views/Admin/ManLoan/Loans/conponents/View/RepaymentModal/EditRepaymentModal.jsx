import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, Select, Row, Col, Card, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import CustomNumberInput from '@/components/form/CustomNumberInput';
import CustomDatePicker from '@/components/form/CustomDatePicker';
import CustomTextArea from '@/components/form/CustomTextArea';
import useFetchQuery from '@/hooks/ReactQuery/useFetchQuery';
import { URL_GET_CASH_FUNDING_ACCOUNTS, URL_GET_COA_FOR_LOANS, URL_GET_FUNDING_BRANCHES } from '@/config/api-paths';

const { Option } = Select;

const EditRepaymentModal = ({ visible, onCancel, onSubmit, repaymentData, jwt, singleLoanDataObject }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedFundingAccount, setSelectedFundingAccount] = useState(null);
  const [isFundingAccountChanging, setIsFundingAccountChanging] = useState(false);

  const dateFormat = "YYYY-MM-DD";

  // Fetch account data
  const CashFundingAccountsData = useFetchQuery({
    url: URL_GET_CASH_FUNDING_ACCOUNTS,
    jwt: jwt,
    tableKey: "CashFundingAccounts"
  });

  const CoaForLoansData = useFetchQuery({
    url: URL_GET_COA_FOR_LOANS,
    jwt: jwt,
    tableKey: "CoaForLoans"
  });

  // Fetch branch funding data based on selected funding account
  const BranchFundingData = useFetchQuery({
    url: selectedFundingAccount ? `${URL_GET_FUNDING_BRANCHES}/${selectedFundingAccount}` : `${URL_GET_FUNDING_BRANCHES}/0`,
    jwt: jwt,
    tableKey: `BranchFunding_${selectedFundingAccount || 'none'}`,
    enabled: true
  });

  useEffect(() => {
    if (visible && repaymentData) {
      form.setFieldsValue({
        repayment_amount: repaymentData.repayment_amount,
        collection_date: repaymentData.collection_date ? dayjs(repaymentData.collection_date) : dayjs(),
        description: repaymentData.description || '',
        funding_account: repaymentData.funding_account || '',
        funding_branch_id: repaymentData.funding_branch_id || '',
        interest_income_account: repaymentData.interest_income_account || '',
        fees_income_account: repaymentData.fees_income_account || '',
        penalty_income_account: repaymentData.penalty_income_account || '',
        overpayment_account: repaymentData.overpayment_account || ''
      });
      
      // Set funding account for branch funding
      if (repaymentData.funding_account) {
        setSelectedFundingAccount(Number(repaymentData.funding_account));
      }
    }
  }, [visible, repaymentData, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  // Set default values for income accounts when data loads (only if not editing existing data)
  useEffect(() => {
    if (CoaForLoansData?.data && visible && !repaymentData) {
      const interestAccount = CoaForLoansData.data.find(account => account.acc_name === "Interest Income");
      const feesAccount = CoaForLoansData.data.find(account => account.acc_name === "Loan Fee Income");
      const penaltyAccount = CoaForLoansData.data.find(account => account.acc_name === "Penalty Income");
      const overpaymentAccount = CoaForLoansData.data.find(account => account.acc_name === "Overpayment");

      if (interestAccount || feesAccount || penaltyAccount || overpaymentAccount) {
        form.setFieldsValue({
          interest_income_account: interestAccount?.id || '',
          fees_income_account: feesAccount?.id || '',
          penalty_income_account: penaltyAccount?.id || '',
          overpayment_account: overpaymentAccount?.id || ''
        });
      }
    }
  }, [CoaForLoansData?.data, form, visible, repaymentData]);

  const FIELD_STYLE = { width: '100%', height: 50, borderRadius: 10 };
  const SELECT_PROPS = {
    showSearch: true,
    filterOption: (input, option) =>
      (option?.children ?? '').toLowerCase().includes(input.toLowerCase()),
    dropdownMatchSelectWidth: true,
    className: 'custom-select-field',
    style: FIELD_STYLE,
  };


  // Check if any data is still loading
  const isDataLoading = CashFundingAccountsData?.isLoading || 
                       CoaForLoansData?.isLoading;

  return (
    <Modal
      open={visible}
      title={<span style={{ color: '#2a3f54', fontWeight: 600 }}>Edit Repayment</span>}
      onCancel={handleCancel}
      footer={null}
      width={800}
    >
      <Form 
        form={form}
        layout="vertical"
        
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <CustomNumberInput
              label="Repayment Amount"
              name="repayment_amount"
              rules={[{ required: true, message: 'Repayment amount is required' }]}
              // placeholder="0"
              // addonAfter="GHS"
              min={0}
              step={0.01}
              style={{ height: 50, borderRadius: 10 }}
            />
          </Col>
          
          <Col xs={24} lg={12}>
            <CustomDatePicker
              label="Collection Date"
              name="collection_date"
              rules={[{ required: true, message: 'Collection date is required' }]}
              placeholder="Select date"
              datePickerProps={{
                format: dateFormat,
                style: FIELD_STYLE,
                allowClear: false   
              }}
              
            />
          </Col>
        </Row>
        
        <CustomTextArea
          label="Description"
          name="description"
          placeholder="Optional"
          textAreaProps={{
            rows: 4
          }}
        />

        <Card 
          type="inner" 
          title="Account Configuration"
          style={{ marginTop: 24, marginBottom: 24, borderRadius: 8 }}
        >
          <div style={{ marginBottom: 16 }}>
            <h4 style={{ margin: 0, color: '#666' }}>Configure journal accounts for this repayment</h4>
          </div>
          
          <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Form.Item
                  label={
                    <Tooltip title="The account from which loan funds will be disbursed to borrowers" placement="top" color="white">
                      <span>
                        Funding Account <span className="text-danger">*</span> <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                      </span>
                    </Tooltip>
                  }
                  name="funding_account"
                  rules={[{ required: true, message: "Funding account is required" }]}
                >
                  <Select 
                    {...SELECT_PROPS} 
                    placeholder="Select funding account" 
                    className="custom-select"
                    loading={CashFundingAccountsData?.isLoading}
                    onChange={(value) => {
                      setIsFundingAccountChanging(true);
                      setSelectedFundingAccount(value);
                      // Reset funding_branch_id when funding_account changes
                      form.setFieldsValue({
                        funding_branch_id: undefined
                      });
                      // Reset the changing state after a brief delay
                      setTimeout(() => {
                        setIsFundingAccountChanging(false);
                      }, 500);
                    }}
                  >
                    {CashFundingAccountsData?.data?.map((account) => (
                      <Option key={account.id} value={account.id}>
                        {account.acc_name} ({account.acc_code})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  label={
                    <Tooltip title="The specific branch funding account for loan disbursements" placement="top" color="white">
                      <span>
                        Branch Funding <span className="text-danger">*</span> <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                      </span>
                    </Tooltip>
                  }
                  name="funding_branch_id"
                  rules={[{ required: true, message: "Branch funding is required" }]}
                >
                  <Select 
                    {...SELECT_PROPS} 
                    placeholder={
                      isFundingAccountChanging 
                        ? "Updating branch options..." 
                        : selectedFundingAccount 
                          ? "Select branch funding" 
                          : "Select funding account first"
                    } 
                    className="custom-select"
                    loading={BranchFundingData?.isLoading || isFundingAccountChanging}
                    disabled={!selectedFundingAccount || isFundingAccountChanging}
                  >
                    {BranchFundingData?.data?.map((branch) => (
                      <Option key={Number(branch.key)} value={Number(branch.key)}>
                        {branch.name} - {branch.branch_name} ({branch.code})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  label={
                    <Tooltip title="The account that will be credited in the general ledger when interest is received from the payment" placement="top" color="white">
                      <span>
                        Interest Income Account <span className="text-danger">*</span> <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                      </span>
                    </Tooltip>
                  }
                  name="interest_income_account"
                  rules={[{ required: true, message: "Interest income account is required" }]}
                >
                  <Select 
                    {...SELECT_PROPS} 
                    placeholder="Select interest income account" 
                    className="custom-select"
                    loading={CoaForLoansData?.isLoading}
                  >
                    {CoaForLoansData?.data?.filter(account => 
                      account.acc_name === "Interest Income"
                    ).map((account) => (
                      <Option key={account.id} value={account.id}>
                        {account.acc_name} ({account.acc_code})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} lg={12}>
                <Form.Item
                  label={
                    <Tooltip title="The account that will be credited in the general ledger when fees are received from the payment" placement="top" color="white">
                      <span>
                        Fees Income Account <span className="text-danger">*</span> <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                      </span>
                    </Tooltip>
                  }
                  name="fees_income_account"
                  rules={[{ required: true, message: "Fees income account is required" }]}
                >
                  <Select 
                    {...SELECT_PROPS} 
                    placeholder="Select fees income account" 
                    className="custom-select"
                    loading={CoaForLoansData?.isLoading}
                  >
                    {CoaForLoansData?.data?.filter(account => 
                      account.acc_name === "Loan Fee Income"
                    ).map((account) => (
                      <Option key={account.id} value={account.id}>
                        {account.acc_name} ({account.acc_code})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} lg={12}>
                <Form.Item
                  label={
                    <Tooltip title="The account that will be credited in the general ledger when penalty is received from the payment" placement="top" color="white">
                      <span>
                        Penalty Income Account <span className="text-danger">*</span> <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                      </span>
                    </Tooltip>
                  }
                  name="penalty_income_account"
                  rules={[{ required: true, message: "Penalty income account is required" }]}
                >
                  <Select 
                    {...SELECT_PROPS} 
                    placeholder="Select penalty income account" 
                    className="custom-select"
                    loading={CoaForLoansData?.isLoading}
                  >
                    {CoaForLoansData?.data?.filter(account => 
                      account.acc_name === "Penalty Income"
                    ).map((account) => (
                      <Option key={account.id} value={account.id}>
                        {account.acc_name} ({account.acc_code})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} lg={12}>
                <Form.Item
                  label={
                    <Tooltip title="The account that will be credited in the general ledger when overpayment is received from the payment" placement="top" color="white">
                      <span>
                        Overpayment Account <span className="text-danger">*</span> <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                      </span>
                    </Tooltip>
                  }
                  name="overpayment_account"
                  rules={[{ required: true, message: "Overpayment account is required" }]}
                >
                  <Select 
                    {...SELECT_PROPS} 
                    placeholder="Select overpayment account" 
                    className="custom-select"
                    loading={CoaForLoansData?.isLoading}
                  >
                    {CoaForLoansData?.data?.filter(account => 
                      account.acc_name === "Overpayment"
                    ).map((account) => (
                      <Option key={account.id} value={account.id}>
                        {account.acc_name} ({account.acc_code})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
        </Card>
        
        <div style={{ textAlign: 'right', marginTop: 24 }}>
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSubmit} loading={loading} disabled={isDataLoading}>
            Update
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditRepaymentModal; 