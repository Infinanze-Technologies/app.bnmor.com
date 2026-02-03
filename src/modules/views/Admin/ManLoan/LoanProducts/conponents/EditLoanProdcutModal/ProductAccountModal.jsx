import { useState, useEffect } from "react";
import {
  Button,
  Select,
  Form,
  Card,
  Row,
  Col,
  message,
  Tooltip,
  Skeleton
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { updateRequest } from "@/hooks/apiService";
import { URL_UPDATE_LOAN_PRODUCT_ACCOUNT_DETAILS, URL_GET_CASH_FUNDING_ACCOUNTS, URL_GET_COA_FOR_LOANS, URL_GET_FUNDING_BRANCHES } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import useFetchQuery from "@/hooks/ReactQuery/useFetchQuery";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";
const { Option } = Select;

const ProductAccountModal = (props) => {
  let jwt = props?.jwt;
  let record = props?.record;
  let refetch = props?.refetch;
  let setIsModalVisible = props?.setIsModalVisible;
  
  const [form] = Form.useForm();
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const [loading, setLoading] = useState(false);
  const [selectedFundingAccount, setSelectedFundingAccount] = useState(null);
  const [isFundingAccountChanging, setIsFundingAccountChanging] = useState(false);

  // console.log(record);
  // console.log(selectedFundingAccount);
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

  // console.log("BranchFundingData", BranchFundingData);



  // Initialize form with existing record data
  useEffect(() => {
    if (record) {
      // console.log("Record accounts:", record.accounts);
      // console.log("Funding account from record:", record.accounts?.funding_account);
      
      form.setFieldsValue({
        accounts: {
          funding_account: record.accounts?.funding_account,
          funding_branch_id: record.accounts.funding_branch_id,
          loans_receivable_account: record.accounts?.loans_receivable_account,
          interest_income_account: record.accounts?.interest_income_account,
          fees_income_account: record.accounts?.fees_income_account,
          penalty_income_account: record.accounts?.penalty_income_account,
          overpayment_account: record.accounts?.overpayment_account
        }
      });
      
      // Set funding account for branch funding
      if (record.accounts?.funding_account) {
        // console.log("Setting selectedFundingAccount to:", Number(record.accounts.funding_account));
        setSelectedFundingAccount(Number(record.accounts.funding_account));
      } else {
        // console.log("No funding_account found in record.accounts");
      }
    }
  }, [record, form]);

  const FIELD_STYLE = { width: '100%', height: 50, borderRadius: 10 };
  const SELECT_PROPS = {
    showSearch: true,
    filterOption: (input, option) =>
      (option?.children ?? '').toLowerCase().includes(input.toLowerCase()),
    dropdownMatchSelectWidth: true,
    className: 'custom-select-field',
    style: FIELD_STYLE,
  };

  // Skeleton component for form fields
  const FormFieldSkeleton = () => (
    <div style={{ marginBottom: 24 }}>
      <Skeleton.Input 
        active 
        size="small" 
        style={{ width: 120, marginBottom: 8 }} 
      />
      <Skeleton.Input 
        active 
        size="large" 
        style={{ width: '100%', height: 50, borderRadius: 10 }} 
      />
    </div>
  );

  // Check if any data is still loading
  const isDataLoading = CashFundingAccountsData?.isLoading || 
                       CoaForLoansData?.isLoading || 
                       (selectedFundingAccount && BranchFundingData?.isLoading) ||
                       isFundingAccountChanging;

  const onFinish = async values => {


    try {
      // Format/prepare data for API
      const data = {
        funding_account: values.accounts.funding_account,
        funding_branch_id: values.accounts.funding_branch_id
      };
      // console.log(data);
      // return;
      setLoading(true);
      // Update loan product via API
      await updateRequest(URL_UPDATE_LOAN_PRODUCT_ACCOUNT_DETAILS,record.product_id, {...data}, jwt)
      .then((res) => {
        handleRequestResponse(res);
        setIsModalVisible(false);
        refetch();
      })
      .catch((err) => {
        handleRequestError(err);
      })
      .finally(() => {
        setLoading(false);
      })

     
    } catch (error) {
      handleRequestError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <Card
        title={
          isDataLoading ? (
            <Skeleton.Input 
              active 
              size="small" 
              style={{ width: 200, height: 24 }} 
            />
          ) : (
            <span style={{ fontSize: 20, fontWeight: 700, color: "#2a3f54" }}>Edit Product Accounts</span>
          )
        }
        bordered={false}
        style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)", borderRadius: 12 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{
            accounts: {
              funding_account: "",
              funding_branch_id: "",
              loans_receivable_account: "",
              interest_income_account: "",
              fees_income_account: "",
              penalty_income_account: "",
              overpayment_account: ""
            }
          }}
        >
          {/* Accounts Configuration */}
          <Card 
            type="inner" 
            title={
              isDataLoading ? (
                <Skeleton.Input 
                  active 
                  size="small" 
                  style={{ width: 180, height: 20 }} 
                />
              ) : (
                "Accounts Configuration"
              )
            } 
            style={{ marginBottom: 24, borderRadius: 8 }}
          >
            <div style={{ marginBottom: 16 }}>
              {isDataLoading ? (
                <Skeleton.Input 
                  active 
                  size="small" 
                  style={{ width: 160, height: 16 }} 
                />
              ) : (
                <h4 style={{ margin: 0, color: '#666' }}>Configure journal accounts</h4>
              )}
            </div>
            
            {isDataLoading ? (
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <FormFieldSkeleton />
                </Col>
                <Col xs={24} lg={12}>
                  <FormFieldSkeleton />
                </Col>
                <Col xs={24} lg={12}>
                  <FormFieldSkeleton />
                </Col>
                <Col xs={24} lg={12}>
                  <FormFieldSkeleton />
                </Col>
                <Col xs={24} lg={12}>
                  <FormFieldSkeleton />
                </Col>
                <Col xs={24} lg={12}>
                  <FormFieldSkeleton />
                </Col>
                <Col xs={24} lg={12}>
                  <FormFieldSkeleton />
                </Col>
              </Row>
            ) : (
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
                  name={['accounts', 'funding_account']}
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
                        accounts: {
                          ...form.getFieldsValue().accounts,
                          funding_branch_id: undefined
                        }
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
                  name={['accounts', 'funding_branch_id']}
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
                    <Tooltip title="The asset account that tracks outstanding loan amounts owed by borrowers" placement="top" color="white">
                      <span>
                        Loans Receivable Account <span className="text-danger">*</span> <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                      </span>
                    </Tooltip>
                  }
                  name={['accounts', 'loans_receivable_account']}
                  rules={[{ required: true, message: "Loans receivable account is required" }]}
                >
                  <Select 
                    {...SELECT_PROPS} 
                    placeholder="Select loans receivable account" 
                    className="custom-select"
                    loading={CoaForLoansData?.isLoading}
                  >
                    {CoaForLoansData?.data?.filter(account => 
                      account.acc_name === "Loans Receivable"
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
                    <Tooltip title="The revenue account that records interest income earned from loan repayments" placement="top" color="white">
                      <span>
                        Default Interest Income Account <span className="text-danger">*</span> <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                      </span>
                    </Tooltip>
                  }
                  name={['accounts', 'interest_income_account']}
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
                    <Tooltip title="The revenue account that records fee income earned from loan processing and administration" placement="top" color="white">
                      <span>
                        Default Fees Income Account <span className="text-danger">*</span> <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                      </span>
                    </Tooltip>
                  }
                  name={['accounts', 'fees_income_account']}
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
                    <Tooltip title="The revenue account that records penalty income from late or missed loan repayments" placement="top" color="white">
                      <span>
                        Default Penalty Income Account <span className="text-danger">*</span> <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                      </span>
                    </Tooltip>
                  }
                  name={['accounts', 'penalty_income_account']}
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
                    <Tooltip title="The liability account that tracks excess payments made by borrowers beyond their loan obligations" placement="top" color="white">
                      <span>
                        Default Overpayment Account <span className="text-danger">*</span> <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                      </span>
                    </Tooltip>
                  }
                  name={['accounts', 'overpayment_account']}
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
            )}
          </Card>

          <Form.Item style={{ textAlign: "right" }}>
           

            <Button
  {...BUTTON_CONFIGS.SAVE_BUTTON()}
  htmlType="submit"
  loading={loading}
  disabled={isDataLoading}
  size="small"
  shape="round"

>
{isDataLoading ? 'Loading...' : 'Save'}
</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProductAccountModal;
