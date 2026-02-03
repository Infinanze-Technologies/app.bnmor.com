import { useState, useEffect } from "react";
import {
  Button,
  Select,
  Form,
  Input,
  Upload,
  Modal,
  DatePicker,
  Card,
  Row,
  Col,
  Tooltip,
  message,
  Spin,
  Switch,
  InputNumber,
  Divider,
  Skeleton
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import moment from "moment";
import { postRequest, getRequest } from "@/hooks/apiService";
import useFetchQuery from "@/hooks/ReactQuery/useFetchQuery";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";
import { 
  URL_ADD_LOAN, 
  URL_GET_ACTIVE_BORROWERS, 
  URL_GET_ACTIVE_GUARANTORS, 
  URL_GET_ACTIVE_LOAN_PRODUCTS,
  URL_GET_CASH_FUNDING_ACCOUNTS,
  URL_GET_FUNDING_BRANCHES,
  URL_GET_COA_FOR_LOANS,
  URL_SHOW_LOAN_PRODUCT
} from "@/config/api-paths";

import dayjs from 'dayjs';
import CustomInput from "@/components/form/CustomInput";
import CustomDatePicker from "@/components/form/CustomDatePicker";
import CustomTextArea from "@/components/form/CustomTextArea";
import useHandleResponse from "@/hooks/useHandleResponse";
import Link from "next/link";
import { LOANS_PAGE } from "@/config/page-routes";
import { useRouter } from "next/router";
import RepaymentScheduleModal from "./Edit/RepaymentScheduleModal";




const { Option } = Select;
const { TextArea } = Input;

const dateFormat = "YYYY-MM-DD";

const toBase64 = file =>
new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

const AddLoan = (props) => {
  const router = useRouter();
 
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [feesModalVisible, setFeesModalVisible] = useState(false);
  const [configuredFees, setConfiguredFees] = useState([]);
  const [editingFee, setEditingFee] = useState(null);
  const [latePenaltyEnabled, setLatePenaltyEnabled] = useState(false);
  const [feeType, setFeeType] = useState('percentage');
  const [penaltyType, setPenaltyType] = useState('percentage');
  const [durationType, setDurationType] = useState('Fixed');
  const [feeForm] = Form.useForm();
  const [customRepaymentEnabled, setCustomRepaymentEnabled] = useState(true);
  const [selectedDays, setSelectedDays] = useState(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
  const [borrowerType, setBorrowerType] = useState('individual');
  const [repaymentScheduleModalVisible, setRepaymentScheduleModalVisible] = useState(false);
  const [repaymentSchedule, setRepaymentSchedule] = useState([]);
  const [installmentType, setInstallmentType] = useState('OTI');
  const [installmentAmount, setInstallmentAmount] = useState(0);
  const [totalRepayment, setTotalRepayment] = useState(0);
  const [selectedFundingAccount, setSelectedFundingAccount] = useState(null);
  const [durationPeriod, setDurationPeriod] = useState('Months');
  const [selectedProductData, setSelectedProductData] = useState(null);
  const [loadingProductDetails, setLoadingProductDetails] = useState(false);

  const { handleRequestError, handleRequestResponse } = useHandleResponse();

  // Skeleton component for form fields
  const FormFieldSkeleton = ({ label, height = 50 }) => (
    <div style={{ marginBottom: 24 }}>
      <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 500, color: '#666' }}>
        {label}
      </div>
      <Skeleton.Input 
        active 
        size="large" 
        style={{ width: '100%', height, borderRadius: 10 }} 
      />
    </div>
  );

 
  // Get JWT token
  let jwt = props?.session?.jwt;

  // Fetch active borrowers using useFetchQuery
  const {
    data: activeBorrowers = [],
    isLoading: loadingBorrowers,
    isError: borrowersError,
    refetch: refetchBorrowers
  } = useFetchQuery({
    url: URL_GET_ACTIVE_BORROWERS,
    jwt: jwt,
    tableKey: 'activeBorrowers'
  });

  // Fetch active guarantors using useFetchQuery
  const {
    data: activeGuarantors = [],
    isLoading: loadingGuarantors,
    isError: guarantorsError,
    refetch: refetchGuarantors
  } = useFetchQuery({
    url: URL_GET_ACTIVE_GUARANTORS,
    jwt: jwt,
    tableKey: 'activeGuarantors'
  });

  // Fetch active loan products using useFetchQuery
  const {
    data: activeLoanProducts = [],
    isLoading: loadingLoanProducts,
    isError: loanProductsError,
    refetch: refetchLoanProducts
  } = useFetchQuery({
    url: URL_GET_ACTIVE_LOAN_PRODUCTS,
    jwt: jwt,
    tableKey: 'activeLoanProducts'
  });

  // Fetch cash funding accounts
  const CashFundingAccountsData = useFetchQuery({
    url: URL_GET_CASH_FUNDING_ACCOUNTS,
    jwt: jwt,
    tableKey: 'cashFundingAccounts'
  });

  // Fetch funding branches
  const BranchFundingData = useFetchQuery({
    url: selectedFundingAccount ? `${URL_GET_FUNDING_BRANCHES}/${selectedFundingAccount}` : null,
    jwt: jwt,
    tableKey: 'branchFunding'
  });

  // Debug logging
  useEffect(() => {
    // console.log('selectedFundingAccount:', selectedFundingAccount);
    // console.log('BranchFundingData:', BranchFundingData);
  }, [selectedFundingAccount, BranchFundingData]);

  // Set funding branch ID when BranchFundingData is loaded and we have a selected product
  useEffect(() => {
    if (selectedProductData?.accounts?.funding_branch_id && 
        BranchFundingData?.data && 
        !BranchFundingData?.isLoading &&
        selectedFundingAccount) {
      // console.log('Auto-setting funding branch ID from product data:', selectedProductData.accounts.funding_branch_id);
      form.setFieldsValue({
        accounts: {
          ...form.getFieldsValue().accounts,
          funding_branch_id: Number(selectedProductData.accounts.funding_branch_id)
        }
      });
    }
  }, [selectedProductData, BranchFundingData, selectedFundingAccount, form]);

  // Debug: Monitor form values changes
  useEffect(() => {
    const principalAmount = form.getFieldValue('principal_amount');
    // console.log('Form principal_amount value:', principalAmount);
  }, [selectedProductData, form]);

  // Fetch COA for loans
  const CoaForLoansData = useFetchQuery({
    url: URL_GET_COA_FOR_LOANS,
    jwt: jwt,
    tableKey: 'coaForLoans'
  });

  // Replace all Select, Input, and DatePicker components' style props to use a consistent style
  const FIELD_STYLE = { width: '100%', height: 50, borderRadius: 10 };
  const SELECT_PROPS = {
    showSearch: true,
    filterOption: (input, option) =>
      (option?.children ?? '').toLowerCase().includes(input.toLowerCase()),
    dropdownMatchSelectWidth: true,
    className: 'custom-select-field',
    style: FIELD_STYLE,
  };

  // Set initial installment type based on default repayment cycle
  useEffect(() => {
    const initialInstallmentType = getInstallmentType('Once');
    setInstallmentType(initialInstallmentType);
    
    // Calculate initial installment amount after form is initialized
    setTimeout(() => {
      calculateInstallmentAmount(initialInstallmentType);
    }, 200);
  }, []);

  // Handle funding account change and reset related fields
  useEffect(() => {
    if (selectedFundingAccount) {
      // Clear any related fields when funding account changes
      form.setFieldsValue({
        accounts: {
          ...form.getFieldsValue().accounts,
          funding_branch_id: undefined
        }
      });
    }
  }, [selectedFundingAccount, form]);

  // Handle API errors
  useEffect(() => {
    if (borrowersError) {
      message.error('Failed to fetch active borrowers');
    }
  }, [borrowersError]);

  useEffect(() => {
    if (guarantorsError) {
      message.error('Failed to fetch active guarantors');
    }
  }, [guarantorsError]);

  useEffect(() => {
    if (loanProductsError) {
      message.error('Failed to fetch active loan products');
    }
  }, [loanProductsError]);

  // Handle fee configuration
  const handleAddFee = () => {
    setEditingFee(null);
    setFeesModalVisible(true);
    feeForm.setFieldsValue({
      calculate_on: "Principal Amount",
      percentage: undefined,
      amount: undefined,
      deduct_from_principal: false,
      spread_across_repayments: false
    });
    setFeeType('percentage'); // or 'fixed' if you want
  };

  // Handle fee editing
  const handleEditFee = (fee) => {
    setEditingFee(fee);
    setFeesModalVisible(true);
    setFeeType(fee.type);
    feeForm.setFieldsValue({
      name: fee.name,
      calculate_on: fee.calculate_on,
      percentage: fee.percentage,
      amount: fee.amount,
      deduct_from_principal: fee.deduct_from_principal,
      spread_across_repayments: fee.spread_across_repayments
    });
  };

  const handleFeeSave = (values) => {
    if (editingFee) {
      // Update existing fee
      const updatedFee = {
        ...editingFee,
        ...values,
        type: feeType
      };
      setConfiguredFees(configuredFees.map(fee => 
        fee.id === editingFee.id ? updatedFee : fee
      ));
      message.success('Fee updated successfully');
    } else {
      // Add new fee
    const newFee = {
      id: Date.now(),
      ...values,
      type: feeType
    };
    setConfiguredFees([...configuredFees, newFee]);
      message.success('Fee configured successfully');
    }
    setFeesModalVisible(false);
    setEditingFee(null);
    feeForm.resetFields();
  };

  const handleFeeCancel = () => {
    setFeesModalVisible(false);
    setEditingFee(null);
    feeForm.resetFields();
  };

  const removeFee = (feeId) => {
    setConfiguredFees(configuredFees.filter(fee => fee.id !== feeId));
    message.success('Fee removed successfully');
  };

  // Handle funding account selection change
  const handleFundingAccountChange = (value) => {
    setSelectedFundingAccount(value);
    // Reset any related fields when funding account changes
    form.setFieldsValue({
      accounts: {
        ...form.getFieldsValue().accounts,
        funding_branch_id: undefined
      }
    });
  };

  // Reset form to default values
  const resetFormToDefaults = () => {
    form.setFieldsValue({
      duration_type: "Fixed",
      duration_period: "Months",
      interest_method: "Flat",
      interest_cycle: "Once",
      repayment_cycle: "Once",
      principal_amount: undefined,
      guarantor_relationship: "Friend",
      guarantor_relationship_duration: 1,
      accounts: {
        funding_account: undefined,
        funding_branch_id: undefined,
        loans_receivable_account: undefined,
        interest_income_account: undefined,
        fees_income_account: undefined,
        penalty_income_account: undefined,
        overpayment_account: undefined
      }
    });
    setDurationType('Fixed');
    setDurationPeriod('Months');
    setLatePenaltyEnabled(false);
    setCustomRepaymentEnabled(true);
    setSelectedDays(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
    setConfiguredFees([]);
    setSelectedFundingAccount(null);
    setSelectedProductData(null);
    setInstallmentAmount(0);
    setTotalRepayment(0);
  };

  // Fetch loan product details by product_id
  const fetchLoanProductDetails = async (productId) => {
    if (!productId) {
      resetFormToDefaults();
      return;
    }
    
    setLoadingProductDetails(true);
    try {
      const response = await getRequest(`${URL_SHOW_LOAN_PRODUCT}/${productId}`, jwt);
      if (response?.data?.data) {
        const productData = response.data.data;
        setSelectedProductData(productData);
        
        // Set funding account state FIRST before setting form values
        if (productData.accounts?.funding_account) {
          // console.log('Setting funding account:', productData.accounts.funding_account);
          setSelectedFundingAccount(productData.accounts.funding_account);
        }

        // Auto-fill form fields with product data
        const formData = {
          duration_type: productData.duration_type || 'Fixed',
          duration_period: productData.duration_period || 'Months',
          // min_loan_duration: productData.min_loan_duration || undefined,
          // max_loan_duration: productData.max_loan_duration || undefined,
          loan_duration: productData.duration_type === 'Flexible' ? (productData.min_loan_duration + productData.max_loan_duration) / 2 : productData.loan_duration || undefined,
          interest_method: productData.interest_method || 'Flat',
          interest_rate: productData.interest_rate ? parseFloat(productData.interest_rate) : undefined,
          interest_cycle: productData.interest_cycle || 'Once',
          repayment_cycle: productData.repayment_cycle || 'Once',
          principal_amount: productData.min_principal_amount ? parseFloat(productData.min_principal_amount) : undefined,
          guarantor_relationship: 'Friend', // Default value
          guarantor_relationship_duration: 1, // Default value

          accounts: {
            funding_account: productData.accounts?.funding_account || undefined,
            funding_branch_id: productData.accounts?.funding_branch_id || undefined,
            loans_receivable_account: productData.accounts?.loans_receivable_account || undefined,
            interest_income_account: productData.accounts?.interest_income_account || undefined,
            fees_income_account: productData.accounts?.fees_income_account || undefined,
            penalty_income_account: productData.accounts?.penalty_income_account || undefined,
            overpayment_account: productData.accounts?.overpayment_account || undefined
          }
        };

        // console.log('Setting principal_amount:', formData.principal_amount);
        // console.log('Product data min_principal_amount:', productData.min_principal_amount);

        // Set form values
        form.setFieldsValue(formData);
        
        // Force update the principal amount field specifically
        setTimeout(() => {
          form.setFieldsValue({
            principal_amount: formData.principal_amount
          });
        }, 100);
        
        // Update state variables
        setDurationType(productData.duration_type || 'Fixed');
        setDurationPeriod(productData.duration_period || 'Months');
        
        // Set penalty configuration if enabled
        if (productData.late_repayment_penalty_enabled && productData.late_repayment_penalty) {
          setLatePenaltyEnabled(true);
          const penalty = productData.late_repayment_penalty;
          setPenaltyType(penalty.penalty_type === 'Percentage' ? 'percentage' : 'fixed');
          
          form.setFieldsValue({
            late_repayment_penalty: {
              penalty_type: penalty.penalty_type === 'Percentage' ? 'percentage' : 'fixed',
              penalty_percentage: penalty.penalty_percentage ? parseFloat(penalty.penalty_percentage) : undefined,
              penalty_amount: penalty.penalty_amount ? parseFloat(penalty.penalty_amount) : undefined,
              calculate_penalty_on: penalty.calculate_penalty_on || 'Principal Amount',
              grace_period: penalty.grace_period || undefined,
              recurring_penalty: penalty.recurring_penalty || 'Once'
            }
          });
        }

        // Set custom installment type if available
        if (productData.custom_installment_type) {
          setCustomRepaymentEnabled(true);
          setSelectedDays(productData.custom_installment_type);
        }


        // Populate fees from product data
        if (productData.fees && productData.fees.length > 0) {
          const mappedFees = productData.fees.map(fee => ({
            id: Date.now() + Math.random(), // Generate unique ID
            name: fee.name,
            type: fee.fee_type === 'Fixed' ? 'fixed' : 'percentage',
            calculate_on: fee.calculate_on,
            percentage: fee.fee_percentage ? parseFloat(fee.fee_percentage) : undefined,
            amount: fee.fee_amount ? parseFloat(fee.fee_amount) : undefined,
            deduct_from_principal: fee.deduct_from_principal || false,
            spread_across_repayments: fee.spread_across_repayments || false
          }));
          setConfiguredFees(mappedFees);
        }

        // Calculate installment amount after setting form values
        setTimeout(() => {
          const newInstallmentType = getInstallmentType(productData.repayment_cycle || 'Once');
          setInstallmentType(newInstallmentType);
          calculateInstallmentAmount(newInstallmentType);
        }, 100);

        // Set funding branch ID after a delay to ensure BranchFundingData is loaded
        if (productData.accounts?.funding_branch_id) {
          setTimeout(() => {
            // console.log('Setting funding branch ID:', productData.accounts.funding_branch_id);
            form.setFieldsValue({
              accounts: {
                ...form.getFieldsValue().accounts,
                funding_branch_id: Number(productData.accounts.funding_branch_id)
              }
            });
          }, 500);
        }

        message.success('Loan product details loaded successfully');
      }
    } catch (error) {
      // console.error('Error fetching loan product details:', error);
      message.error('Failed to load loan product details');
    } finally {
      // console.log('Setting loadingProductDetails to false');
      setLoadingProductDetails(false);
    }
  };

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

  // Calculate installment amount based on loan parameters
  const calculateInstallmentAmount = (customInstallmentType = null) => {
    const formValues = form.getFieldsValue();
    const {
      principal_amount,
      loan_duration,
      min_loan_duration,
      max_loan_duration,
      duration_period,
      duration_type,
      interest_rate,
      interest_method,
      repayment_cycle
    } = formValues;

    // console.log('=== Installment Calculation Debug ===');
    // console.log('Form values:', formValues);
    // console.log('Principal amount:', principal_amount);
    // console.log('Loan duration:', loan_duration);
    // console.log('Duration period:', duration_period);
    // console.log('Interest rate:', interest_rate);
    // console.log('Interest method:', interest_method);
    // console.log('Repayment cycle:', repayment_cycle);
    // console.log('Duration type:', duration_type);
    // console.log('Min loan duration:', min_loan_duration);
    // console.log('Max loan duration:', max_loan_duration);

    // Determine the duration to use for calculation
    let durationToUse = 0;
    if (duration_type === 'Flexible') {
      // For flexible duration, use the average of min and max, or min if max is not available
      if (min_loan_duration && max_loan_duration) {
        durationToUse = (Number(min_loan_duration) + Number(max_loan_duration)) / 2;
      } else if (min_loan_duration) {
        durationToUse = Number(min_loan_duration);
      } else {
        // console.log('Missing min_loan_duration for flexible duration, setting installment to 0');
        setInstallmentAmount(0);
        return 0;
      }
    } else {
      // For fixed duration, use loan_duration
      durationToUse = Number(loan_duration);
    }

    // console.log('Duration to use for calculation:', durationToUse);

    if (!principal_amount || !durationToUse || !interest_rate) {
      // console.log('Missing required values, setting installment to 0');
      setInstallmentAmount(0);
      return 0;
    }

    const principal = Number(principal_amount);
    const duration = durationToUse; // Use the calculated duration
    const rate = Number(interest_rate);

    // console.log('Parsed values - Principal:', principal, 'Duration:', duration, 'Rate:', rate);
    // console.log('Interest method:', interest_method);

    // Calculate total interest based on interest method
    let totalInterest = 0;
    let totalAmount = 0;

    if (interest_method === 'Reducing Balance') {
      // For reducing balance, we need to calculate EMI (Equated Monthly Installment)
      // This is a simplified calculation - in practice, you'd use the EMI formula
      const monthlyRate = rate / 100 / 12; // Assuming rate is annual
      const numberOfMonths = duration_period === 'Months' ? duration : 
                            duration_period === 'Years' ? duration * 12 :
                            duration_period === 'Days' ? duration / 30 : duration;
      
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
      if (duration_period === 'Days') {
        durationInYears = duration / 365;
      } else if (duration_period === 'Weeks') {
        durationInYears = duration / 52;
      } else if (duration_period === 'Months') {
        durationInYears = duration / 12;
      } else if (duration_period === 'Years') {
        durationInYears = duration;
      }
      
      // console.log('Duration in years for flat interest:', durationInYears);
      totalInterest = (principal * rate * durationInYears) / 100;
      totalAmount = principal + totalInterest;
    }
    
    // Calculate fees
    let totalFees = 0;
    let feesToDeductFromPrincipal = 0;

    if (configuredFees && configuredFees.length > 0) {
      configuredFees.forEach(fee => {
        let feeAmount = 0;
        
        // Calculate fee amount based on type
        if (fee.type === 'percentage') {
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
          
          feeAmount = (calculateOnAmount * fee.percentage) / 100;
        } else {
          // Fixed amount
          feeAmount = fee.amount || 0;
        }

        totalFees += feeAmount;

        // Handle fee deduction from principal
        if (fee.deduct_from_principal) {
          feesToDeductFromPrincipal += feeAmount;
        }
      });
    }
    
    // Adjust total amount to include fees
    totalAmount += totalFees - feesToDeductFromPrincipal;
    
    // console.log('Total interest:', totalInterest);
    // console.log('Total fees:', totalFees);
    // console.log('Total amount:', totalAmount);

    // Use the provided installment type or the current state
    const currentInstallmentType = customInstallmentType || installmentType;
    
    // console.log('Current installment type:', currentInstallmentType);
    // console.log('Custom installment type:', customInstallmentType);
    // console.log('State installment type:', installmentType);

    // Calculate installment amount based on installment type and duration period
    let numberOfInstallments = 1;

    switch (currentInstallmentType) {
      case 'OTI':
        numberOfInstallments = 1;
        break;
      case 'EDI':
        // For daily installments, calculate based on duration period
        if (duration_period === 'Days') {
          numberOfInstallments = duration;
        } else if (duration_period === 'Weeks') {
          numberOfInstallments = duration * 7;
        } else if (duration_period === 'Months') {
          numberOfInstallments = duration * 30;
        } else if (duration_period === 'Years') {
          numberOfInstallments = duration * 365;
        }
        break;
      case 'EWI':
        // For weekly installments, calculate based on duration period
        if (duration_period === 'Days') {
          numberOfInstallments = Math.ceil(duration / 7);
        } else if (duration_period === 'Weeks') {
          numberOfInstallments = duration;
        } else if (duration_period === 'Months') {
          numberOfInstallments = duration * 4;
        } else if (duration_period === 'Years') {
          numberOfInstallments = duration * 52;
        }
        break;
      case 'EMI':
        // For monthly installments, calculate based on duration period
        if (duration_period === 'Days') {
          numberOfInstallments = Math.ceil(duration / 30);
        } else if (duration_period === 'Weeks') {
          numberOfInstallments = Math.ceil(duration / 4);
        } else if (duration_period === 'Months') {
          numberOfInstallments = duration;
        } else if (duration_period === 'Years') {
          numberOfInstallments = duration * 12;
        }
        break;
      case 'EYI':
        // For yearly installments, calculate based on duration period
        if (duration_period === 'Days') {
          numberOfInstallments = Math.ceil(duration / 365);
        } else if (duration_period === 'Weeks') {
          numberOfInstallments = Math.ceil(duration / 52);
        } else if (duration_period === 'Months') {
          numberOfInstallments = Math.ceil(duration / 12);
        } else if (duration_period === 'Years') {
          numberOfInstallments = duration;
        }
        break;
      default:
        numberOfInstallments = 1;
    }

    // console.log('Number of installments:', numberOfInstallments);
    // console.log('Total amount:', totalAmount);
    // console.log('Amount per installment:', totalAmount / numberOfInstallments);

    const calculatedAmount = Number((totalAmount / numberOfInstallments).toFixed(2));
    // console.log('Final calculated amount:', calculatedAmount);
    
    setInstallmentAmount(calculatedAmount);
    setTotalRepayment(Number(totalAmount.toFixed(2)));
    // console.log('=== End Installment Calculation ===');
    return calculatedAmount;
  };

  // Handle repayment cycle change
  const handleRepaymentCycleChange = (value) => {
    const newInstallmentType = getInstallmentType(value);
    setInstallmentType(newInstallmentType);
    
    // Update installment amount when repayment cycle changes
    setTimeout(() => {
      calculateInstallmentAmount(newInstallmentType);
    }, 100);
  };

  // Handle day selection for custom repayment schedule
  const handleDayToggle = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const daysOfWeek = [
    { key: 'monday', label: 'monday' },
    { key: 'tuesday', label: 'tuesday' },
    { key: 'wednesday', label: 'wednesday' },
    { key: 'thursday', label: 'thursday' },
    { key: 'friday', label: 'friday' },
    { key: 'saturday', label: 'saturday' },
    { key: 'sunday', label: 'sunday' }
  ];


  // Calculate repayment schedule based on loan parameters
  const calculateRepaymentSchedule = (formValues) => {
    const {
      principal_amount,
      loan_duration,
      min_loan_duration,
      max_loan_duration,
      duration_period,
      duration_type,
      interest_rate,
      interest_method,
      repayment_cycle,
      installment_amount,
      loan_release_date,
      fees = []
    } = formValues;

    // This is a simplified calculation - in a real implementation, you would have more complex logic
    const schedule = [];
    const principal = Number(principal_amount) || 0;
    
    // Determine duration to use for calculation (same logic as in calculateInstallmentAmount)
    let duration = 1;
    if (duration_type === 'Flexible') {
      if (min_loan_duration && max_loan_duration) {
        duration = (Number(min_loan_duration) + Number(max_loan_duration)) / 2;
      } else if (min_loan_duration) {
        duration = Number(min_loan_duration);
      }
    } else {
      duration = Number(loan_duration) || 1;
    }
    
    const rate = Number(interest_rate) || 0;
    const releaseDate = loan_release_date ? dayjs(loan_release_date) : dayjs();

    // Calculate total interest based on interest method
    let totalInterest = 0;
    let totalAmount = 0;

    if (interest_method === 'Reducing Balance') {
      // For reducing balance, we need to calculate EMI (Equated Monthly Installment)
      const monthlyRate = rate / 100 / 12; // Assuming rate is annual
      const numberOfMonths = duration_period === 'Months' ? duration : 
                            duration_period === 'Years' ? duration * 12 :
                            duration_period === 'Days' ? duration / 30 : duration;
      
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
      if (duration_period === 'Days') {
        durationInYears = duration / 365;
      } else if (duration_period === 'Weeks') {
        durationInYears = duration / 52;
      } else if (duration_period === 'Months') {
        durationInYears = duration / 12;
      } else if (duration_period === 'Years') {
        durationInYears = duration;
      }
      
      totalInterest = (principal * rate * durationInYears) / 100;
      totalAmount = principal + totalInterest;
    }

    // Calculate installment amount based on installment type and duration period
    let numberOfInstallments = 1;

    switch (installmentType) {
      case 'OTI':
        numberOfInstallments = 1;
        break;
      case 'EDI':
        // For daily installments, calculate based on duration period
        if (duration_period === 'Days') {
          numberOfInstallments = duration;
        } else if (duration_period === 'Weeks') {
          numberOfInstallments = duration * 7;
        } else if (duration_period === 'Months') {
          numberOfInstallments = duration * 30;
        } else if (duration_period === 'Years') {
          numberOfInstallments = duration * 365;
        }
        break;
      case 'EWI':
        // For weekly installments, calculate based on duration period
        if (duration_period === 'Days') {
          numberOfInstallments = Math.ceil(duration / 7);
        } else if (duration_period === 'Weeks') {
          numberOfInstallments = duration;
        } else if (duration_period === 'Months') {
          numberOfInstallments = duration * 4;
        } else if (duration_period === 'Years') {
          numberOfInstallments = duration * 52;
        }
        break;
      case 'EMI':
        // For monthly installments, calculate based on duration period
        if (duration_period === 'Days') {
          numberOfInstallments = Math.ceil(duration / 30);
        } else if (duration_period === 'Weeks') {
          numberOfInstallments = Math.ceil(duration / 4);
        } else if (duration_period === 'Months') {
          numberOfInstallments = duration;
        } else if (duration_period === 'Years') {
          numberOfInstallments = duration * 12;
        }
        break;
      case 'EYI':
        // For yearly installments, calculate based on duration period
        if (duration_period === 'Days') {
          numberOfInstallments = Math.ceil(duration / 365);
        } else if (duration_period === 'Weeks') {
          numberOfInstallments = Math.ceil(duration / 52);
        } else if (duration_period === 'Months') {
          numberOfInstallments = Math.ceil(duration / 12);
        } else if (duration_period === 'Years') {
          numberOfInstallments = duration;
        }
        break;
      default:
        numberOfInstallments = 1;
    }

    // Calculate fees
    let totalFees = 0;
    let feesPerInstallment = 0;
    let feesToDeductFromPrincipal = 0;

    if (fees && fees.length > 0) {
      fees.forEach(fee => {
        let feeAmount = 0;
        
        // Calculate fee amount based on type
        if (fee.type === 'percentage') {
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
          
          feeAmount = (calculateOnAmount * fee.percentage) / 100;
        } else {
          // Fixed amount
          feeAmount = fee.amount || 0;
        }

        totalFees += feeAmount;

        // Handle fee spreading and deduction options
        if (fee.deduct_from_principal) {
          feesToDeductFromPrincipal += feeAmount;
        } else if (fee.spread_across_repayments) {
          feesPerInstallment += feeAmount / numberOfInstallments;
        } else {
          // If neither option is selected, add to first installment
          if (numberOfInstallments > 0) {
            feesPerInstallment += feeAmount / numberOfInstallments;
          }
        }
      });
    }

    // Adjust total amount to include fees
    totalAmount += totalFees - feesToDeductFromPrincipal;

    const installmentAmount = Number((totalAmount / numberOfInstallments).toFixed(2));

    // Generate schedule rows
    for (let i = 0; i < numberOfInstallments; i++) {
      const dueDate = releaseDate.clone().add(i, duration_period.toLowerCase());
      const isLastInstallment = i === numberOfInstallments - 1;
      
      // Calculate fees for this installment
      let installmentFees = 0;
      if (feesPerInstallment > 0) {
        installmentFees = feesPerInstallment;
      } else if (i === 0 && totalFees > 0) {
        // If fees are not spread, add all fees to first installment
        installmentFees = totalFees;
      }

      // Calculate repayment amount including fees
      let repaymentAmount = installmentAmount;
      if (installmentType === 'OTI' && isLastInstallment) {
        repaymentAmount = totalAmount;
      }

      // Calculate principal for this installment
      let installmentPrincipal = 0;
      if (installmentType === 'OTI' && isLastInstallment) {
        installmentPrincipal = principal - feesToDeductFromPrincipal;
      } else {
        installmentPrincipal = (principal - feesToDeductFromPrincipal) / numberOfInstallments;
      }

      // Calculate interest for this installment
      let installmentInterest = 0;
      if (installmentType === 'OTI' && isLastInstallment) {
        installmentInterest = totalInterest;
      } else {
        installmentInterest = totalInterest / numberOfInstallments;
      }

      // Calculate balance
      let balance = 0;
      if (installmentType === 'OTI') {
        balance = isLastInstallment ? '0.00' : (principal - feesToDeductFromPrincipal).toFixed(2);
      } else {
        balance = Math.max(0, (principal - feesToDeductFromPrincipal) - (installmentPrincipal * (i + 1))).toFixed(2);
      }
      
      schedule.push({
        dueDate: dueDate.format('DD/MM/YYYY'),
        description: `${installmentType} ${i + 1}`,
        repayment: repaymentAmount.toFixed(2),
        principal: installmentPrincipal.toFixed(2),
        interest: installmentInterest.toFixed(2),
        fees: installmentFees.toFixed(2),
        balance: balance
      });
    }

    // Calculate actual total from schedule rows to ensure consistency
    const actualTotal = schedule.reduce((sum, row) => {
      return sum + parseFloat(row.repayment);
    }, 0);

    return {
      schedule,
      totalRepayment: actualTotal.toFixed(2)
    };
  };

  // Handle view repayment schedule
  const handleViewRepaymentSchedule = () => {
    const formValues = form.getFieldsValue();
    
    // Validate required fields - handle both fixed and flexible duration
    const hasValidDuration = formValues.duration_type === 'Flexible' 
      ? (formValues.min_loan_duration && formValues.max_loan_duration)
      : formValues.loan_duration;
    
    if (!formValues.principal_amount || !hasValidDuration || !formValues.loan_release_date) {
      message.error('Please fill in Principal Amount, Loan Duration, and Loan Release Date to view the repayment schedule.');
      return;
    }
    
    // Include configured fees in the calculation
    const formDataWithFees = {
      ...formValues,
      fees: configuredFees
    };
    const scheduleData = calculateRepaymentSchedule(formDataWithFees);
    setRepaymentSchedule(scheduleData);
    setRepaymentScheduleModalVisible(true);
  };


  // Form submit handler
  const onFinish = async values => {

    try {
   
    const data = {
        loan_product_id: values.loan_product,
        borrower_id: values.borrower,
        guarantor_id: values.guarantor_id,
        loan_amount: Number(values.principal_amount),
        loan_period: values.duration_period,
        loan_duration: values.loan_duration || 1,
        loan_duration_type: "Fixed",
        loan_release_date: values.loan_release_date ? dayjs(values.loan_release_date).format('YYYY-MM-DD') : "",
        interest_rate: Number(values.interest_rate),
        interest_cycle: values.interest_cycle,
        repayment_cycle: values.repayment_cycle,
        installment_type: installmentType,
        interest_method: values.interest_method,
        installment_amount: installmentAmount,
        total_repayment: totalRepayment,
        enable_custom_installment: customRepaymentEnabled,
        custom_installment_type: customRepaymentEnabled ? selectedDays : [],
        guarantor_relationship: values.guarantor_relationship,
        guarantor_relationship_duration: Number(values.guarantor_relationship_duration) || 1,
        loan_status: 'Requested',
      fees: configuredFees.map(fee => ({
          name: fee.name,
          fee_type: fee.type === 'percentage' ? 'Percentage' : 'Fixed',
          calculate_on: fee.calculate_on,
          fee_percentage: fee.percentage ? Number(fee.percentage) : 0,
          fee_amount: fee.amount ? Number(fee.amount) : 0,
        deduct_from_principal: !!fee.deduct_from_principal,
        spread_across_repayments: !!fee.spread_across_repayments
      })),
        penalty: {
          penalty_type: penaltyType === 'percentage' ? 'Percentage' : 'Fixed',
          penalty_percentage: values.late_repayment_penalty?.penalty_percentage ? Number(values.late_repayment_penalty.penalty_percentage) : 0,
          penalty_amount: values.late_repayment_penalty?.penalty_amount ? Number(values.late_repayment_penalty.penalty_amount) : 0,
          calculate_penalty_on: values.late_repayment_penalty?.calculate_penalty_on || "Principal Amount",
          grace_period: values.late_repayment_penalty?.grace_period ? Number(values.late_repayment_penalty.grace_period) : 0,
          recurring_penalty: values.late_repayment_penalty?.recurring_penalty || "Once"
        },
        accounts: {
          funding_account: values.accounts?.funding_account,
          funding_branch_id: values.accounts?.funding_branch_id || 0,
          loans_receivable_account: values.accounts?.loans_receivable_account,
          interest_income_account: values.accounts?.interest_income_account,
          fees_income_account: values.accounts?.fees_income_account,
          penalty_income_account: values.accounts?.penalty_income_account,
          overpayment_account: values.accounts?.overpayment_account
        }
      };

      // console.log('AddLoan submitting data:', data);
      // return;
      // setLoading(true);
      // Send to API
      await postRequest(URL_ADD_LOAN, data, jwt).then((response) => {
        handleRequestResponse(response);
        
        // Reset form and state after successful creation
        form.resetFields();
        setConfiguredFees([]);
        setLatePenaltyEnabled(false);
        setDurationType('Fixed');
        setInstallmentType('OTI');
        setInstallmentAmount(0);
        setTotalRepayment(0);
        setCustomRepaymentEnabled(true);
        setSelectedDays(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
        setSelectedFundingAccount(null);
        setSelectedProductData(null);
        setBorrowerType('individual');
        setPenaltyType('percentage');
        setFeeType('percentage');
        setLoadingProductDetails(false);
        
        // Refetch data to ensure it's up to date
        refetchBorrowers();
        refetchGuarantors();
        refetchLoanProducts();
        
        setLoading(false);
      }).catch((error) => {
        handleRequestError(error);
        setLoading(false);
      }).finally(() => {
        setLoading(false);
      });
      
    } catch (error) {
      handleRequestError(error);
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 24, fontWeight: 700, color: "#2a3f54" }}>Add a Loan</span>

          <div style={{ marginBottom: 24, marginTop: 24 }}>
          <Button 
            type="default" 
            size="middle"
            onClick={() => router.back()}
            style={{ 
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ← Go Back
          </Button>
        </div>
        
        </div>
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
            loan_status: "Processing",
            borrower_type: "individual",
            duration_period: "Months",
            duration_type: "Fixed",
            interest_method: "Flat",
            interest_cycle: "Once",
            repayment_cycle: "Once",
            installment_amount: 0,
            loan_release_date: dayjs(),
            accounts: {
              funding_account: "Cash",
              loans_receivable_account: "Loans Receivable",
              interest_income_account: "Interest Income",
              fees_income_account: "Fees Income",
              penalty_income_account: "Penalties Income",
              overpayment_account: "Loans Overpayment"
            }
          }}
        >
          {/* Basic Loan Information */}
          <Card type="inner" title="Basic Loan Information" style={{ marginBottom: 24, borderRadius: 8 }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <span>
                      Loan Product <span className="text-danger">*</span>
                      {loadingProductDetails && <Spin size="small" style={{ marginLeft: 8 }} />}
                    </span>
                  }
                  name="loan_product"
                  rules={[{ required: true, message: "Loan product is required" }]}
                >
                  <Select 
                    {...SELECT_PROPS} 
                    placeholder="Select a loan product" 
                    className="custom-select"
                    loading={loadingLoanProducts || loadingProductDetails}
                    notFoundContent={loadingLoanProducts || loadingProductDetails ? "Loading..." : "No loan products found"}
                    onChange={(value) => {
                      fetchLoanProductDetails(value);
                    }}
                  >
                    {activeLoanProducts.map((product) => (
                      <Option key={product.product_id} value={product.product_id}>
                        {product.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            
              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <span>
                      Borrower Type <span className="text-danger">*</span>
                    </span>
                  }
                  name="borrower_type"
                  rules={[{ required: true, message: "Borrower type is required" }]}
                >
                  <Select 
                    {...SELECT_PROPS} 
                    placeholder="Select borrower type" 
                    className="custom-select"
                    onChange={(value) => {
                      setBorrowerType(value);
                      form.setFieldsValue({ borrower: undefined }); // Reset borrower selection when type changes
                    }}
                  >
                    <Option value="individual">Individual</Option>
                    {/* <Option value="group">Group</Option> */}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <span>
                      Borrower <span className="text-danger">*</span>
                    </span>
                  }
                  name="borrower"
                  rules={[{ required: true, message: "Borrower is required" }]}
                >
                  <Select 
                    {...SELECT_PROPS} 
                    placeholder={borrowerType === 'individual' ? "Select Individual" : "Select Group"} 
                    className="custom-select"
                    disabled={!borrowerType}
                    loading={loadingBorrowers}
                    notFoundContent={loadingBorrowers ? <Spin size="small" /> : "No borrowers found"}
                  >
                    {borrowerType === 'individual' ? (
                      activeBorrowers.map((borrower) => (
                        <Option key={borrower.borrower_id} value={borrower.borrower_id}>
                          {borrower.fullname}
                        </Option>
                      ))
                    ) : borrowerType === 'group' ? (
                      // For groups, you would need a separate API call
                        <Option value="group_1">Business Group A</Option>
                    ) : null}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                {loadingProductDetails ? (
                  <FormFieldSkeleton label="Principal Amount *" />
                ) : (
                <Form.Item
                  key={selectedProductData?.product_id || 'no-product'}
                  label={
                    <span>
                      Principal Amount <span className="text-danger">*</span>
                      {selectedProductData && (
                        <span style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>
                          (Min: {selectedProductData.min_principal_amount?.toLocaleString()} - Max: {selectedProductData.max_principal_amount?.toLocaleString()})
                        </span>
                      )}
                    </span>
                  }
                  name="principal_amount"
                  rules={[
                    { required: true, message: "Principal amount is required" },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        if (selectedProductData) {
                          if (value < selectedProductData.min_principal_amount) {
                            return Promise.reject(new Error(`Amount cannot be less than ${selectedProductData.min_principal_amount.toLocaleString()}`));
                          }
                          if (value > selectedProductData.max_principal_amount) {
                            return Promise.reject(new Error(`Amount cannot exceed ${selectedProductData.max_principal_amount.toLocaleString()}`));
                          }
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <InputNumber
                    className="custom-number-input"
                    placeholder="0"
                    style={FIELD_STYLE}
                    min={selectedProductData?.min_principal_amount || 0}
                    max={selectedProductData?.max_principal_amount || undefined}
                    // addonBefore="GH₵"
                    addonAfter="GHS"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    onChange={(value) => {
                      // console.log('Principal amount changed to:', value);
                      setTimeout(() => {
                        calculateInstallmentAmount(installmentType);
                      }, 100);
                    }}
                  />
                </Form.Item>
                )}
              </Col>
              <Col xs={24} lg={8}>
                <CustomDatePicker
                  label={
                    <span>
                      Loan Release Date <span className="text-danger">*</span>
                    </span>
                  }
                  name="loan_release_date"
                  rules={[{ required: true, message: "Loan release date is required" }]}
                    placeholder="Select date"
                  datePickerProps={{
                    format: dateFormat,
                    style: FIELD_STYLE
                  }}
                  />
              </Col>

              <Col xs={24} lg={8}>
                {loadingProductDetails ? (
                  <FormFieldSkeleton label="Duration Period *" />
                ) : (
                <Form.Item
                  label={
                    <span>
                       Duration Period <span className="text-danger">*</span>
                     </span>
                   }
                   name="duration_period"
                   rules={[{ required: true, message: "Duration period is required" }]}
                 >
                   <Select 
                     {...SELECT_PROPS} 
                     placeholder="Select duration period" 
                     className="custom-select"
                     onChange={(value) => {
                       setDurationPeriod(value);
                       setTimeout(() => {
                         calculateInstallmentAmount(installmentType);
                       }, 100);
                     }}
                   >
                     <Option value="Days">Days</Option>
                     <Option value="Weeks">Weeks</Option>
                     <Option value="Months">Months</Option>
                     <Option value="Years">Years</Option>
                   </Select>
                 </Form.Item>
                )}
               </Col>

               <Col xs={24} lg={8}>
               {loadingProductDetails ? (
                  <FormFieldSkeleton label="Loan Duration *" />
                ) : (
                  <Form.Item
                    label={
                      <span>
                        Loan Duration <span className="text-danger">*</span>
                    </span>
                  }
                  name="loan_duration"
                    rules={[
                      { required: true, message: "Loan duration is required" },
                      { type: 'number', min: 1, max: 360, message: `Duration must be between 1 and 360 ${durationPeriod.toLowerCase()}` }
                    ]}
                >
                  <InputNumber
                    className="custom-number-input"
                    placeholder="1"
                    style={FIELD_STYLE}
                    min={1}
                    max={360}
                    onChange={() => {
                      setTimeout(() => {
                        calculateInstallmentAmount(installmentType);
                      }, 100);
                    }}
                  />
                </Form.Item>
                )}
              </Col>
           

              <Col xs={24} lg={8}>
                {loadingProductDetails ? (
                  <FormFieldSkeleton label="Interest Method *" />
                ) : (
                <Form.Item
                  label={
                    <span>
                      Interest Method <span className="text-danger">*</span>
                    </span>
                  }
                  name="interest_method"
                  rules={[{ required: true, message: "Interest method is required" }]}
                >
                  <Select {...SELECT_PROPS} placeholder="Select interest method" className="custom-select">
                      <Option value="Flat">Flat</Option>
                    <Option value="Reducing Balance">Reducing Balance</Option>
                      {/* <Option value="Compound">Compound</Option> */}
                  </Select>
                </Form.Item>
                )}
              </Col>
              <Col xs={24} lg={8}>
                {loadingProductDetails ? (
                  <FormFieldSkeleton label="Interest Rate *" />
                ) : (
                <Form.Item
                  label={
                    <span>
                      Interest Rate <span className="text-danger">*</span>
                    </span>
                  }
                  name="interest_rate"
                  rules={[
                    { required: true, message: "Interest rate is required" },
                    { type: 'number', min: 0, max: 100, message: "Interest rate must be between 0 and 100%" }
                  ]}
                >
                  <InputNumber
                    className="custom-number-input"
                    placeholder="0.01"
                    style={FIELD_STYLE}
                    min={0}
                    max={100}
                    addonAfter="%"
                    step={0.01}
                    onChange={() => {
                      setTimeout(() => {
                        calculateInstallmentAmount(installmentType);
                      }, 100);
                    }}
                  />
                </Form.Item>
                )}
              </Col>
              <Col xs={24} lg={8}>
                {loadingProductDetails ? (
                  <FormFieldSkeleton label="Interest Cycle *" />
                ) : (
                <Form.Item
                  label={
                    <span>
                      Interest Cycle <span className="text-danger">*</span>
                    </span>
                  }
                  name="interest_cycle"
                  rules={[{ required: true, message: "Interest cycle is required" }]}
                >
                  <Select {...SELECT_PROPS} placeholder="Select interest cycle" className="custom-select">
                    <Option value="Once">Once</Option>
                    <Option value="Daily">Daily</Option>
                    <Option value="Weekly">Weekly</Option>
                    <Option value="Monthly">Monthly</Option>
                    <Option value="Annually">Annually</Option>
                  </Select>
                </Form.Item>
                )}
              </Col>
              <Col xs={24} lg={8}>
                {loadingProductDetails ? (
                  <FormFieldSkeleton label="Repayment Cycle *" />
                ) : (
                <Form.Item
                  label={
                    <span>
                      Repayment Cycle <span className="text-danger">*</span>
                    </span>
                  }
                  name="repayment_cycle"
                  rules={[{ required: true, message: "Repayment cycle is required" }]}
                >
                  <Select 
                    {...SELECT_PROPS} 
                    placeholder="Select repayment cycle" 
                    className="custom-select"
                    onChange={handleRepaymentCycleChange}
                  >
                    <Option value="Once">Once</Option>
                    <Option value="Daily">Daily</Option>
                    <Option value="Weekly">Weekly</Option>
                    <Option value="Monthly">Monthly</Option>
                    <Option value="Yearly">Yearly</Option>
                  </Select>
                </Form.Item>
                )}
              </Col>


                {/* // Loan Status */}
                {/* <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <span>
                      Loan Status <span className="text-danger">*</span>
                    </span>
                  }
                  name="loan_status"
                  rules={[{ required: true, message: "Loan status is required" }]}
                >
                  <Select {...SELECT_PROPS} placeholder="Select loan status" className="custom-select">
                    <Option value="Active">Active</Option>
                    <Option value="Requested">Requested</Option>
                    <Option value="Processing">Processing</Option>
                    <Option value="Completed">Completed</Option>
                    <Option value="Defaulted">Defaulted</Option>
                    <Option value="Denied">Denied</Option>
                  </Select>
             
                 </Form.Item>
               </Col> */}

               {/* Total Repayment */}
               {/* <Col xs={24} lg={8}>
                 <Form.Item
                   label={
                     <Tooltip 
                       title="Total amount to be repaid including principal, interest, and fees" 
                       placement="top" 
                       color="white"
                     >
                       <span>
                         Total Repayment <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                       </span>
                     </Tooltip>
                   }
                 >
                   <div style={{
                     padding: '12px 16px',
                     backgroundColor: '#f6ffed',
                     border: '2px solid #52c41a',
                     borderRadius: 10,
                     color: '#52c41a',
                     fontWeight: 600,
                     fontSize: '16px',
                     minHeight: 50,
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'space-between',
                     cursor: 'help'
                   }}>
                     <span>
                       {totalRepayment.toLocaleString('en-US', {
                         minimumFractionDigits: 2,
                         maximumFractionDigits: 2
                       })}
                     </span>
                     <span style={{ color: '#666', fontSize: '14px', fontWeight: 500 }}>GHS</span>
                   </div>
                 </Form.Item>
               </Col> */}
              {/* <Col xs={24} lg={8}>
                {loadingProductDetails ? (
                  <FormFieldSkeleton label="Installment Amount *" />
                ) : (
                <Form.Item
                  label={
                    <Tooltip 
                      title={
                        installmentType === 'OTI' ? 'One-Time Installment - Installment amount is calculated based on the principal amount and interest rate.' :
                        installmentType === 'EDI' ? 'Equated Daily Installment - Installment amount is calculated based on the principal amount and interest rate.' :
                        installmentType === 'EWI' ? 'Equated Weekly Installment - Installment amount is calculated based on the principal amount and interest rate.' :
                        installmentType === 'EMI' ? 'Equated Monthly Installment - Installment amount is calculated based on the principal amount and interest rate.' :
                        installmentType === 'EYI' ? 'Equated Yearly Installment - Installment amount is calculated based on the principal amount and interest rate.' : ''
                      } 
                      placement="top" 
                      color="white"
                    >
                      <span>
                        {`Installment Amount (${installmentType})`} <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                      </span>
                    </Tooltip>
                  }
                >
                  <div style={{
                    padding: '12px 16px',
                    backgroundColor: '#f0f8ff',
                    border: '2px solid #1890ff',
                    borderRadius: 10,
                    color: '#1890ff',
                    fontWeight: 600,
                    fontSize: '16px',
                    minHeight: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'help'
                  }}>
                    <span>
                      {installmentAmount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                    <span style={{ color: '#666', fontSize: '14px', fontWeight: 500 }}>GHS</span>
                  </div>
                </Form.Item>
                )}
              </Col> */}
            </Row>
          </Card>

          {/* Custom Repayment Schedule */}
          <Card type="inner" title="Custom Repayment Schedule" style={{ marginBottom: 24, borderRadius: 8 }}>
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ margin: 0, color: '#666' }}>Configure custom days when repayments can be made</h4>
            </div>
            
            <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
              <Col xs={24} lg={12}>
                <span>Enable Custom Repayment Schedule</span>
              </Col>
              <Col xs={24} lg={12}>
                <Switch 
                  checked={customRepaymentEnabled} 
                  onChange={setCustomRepaymentEnabled}
                  style={{ backgroundColor: customRepaymentEnabled ? '#722ed1' : '#d9d9d9' }}
                />
              </Col>
            </Row>

            {customRepaymentEnabled && (
              <div style={{ marginTop: 16 }}>
                <Row gutter={[8, 8]}>
                  {daysOfWeek.map((day) => (
                    <Col xs={12} sm={8} md={6} lg={3} key={day.key}>
                      <div
                        style={{
                          padding: '8px 5px',
                          border: selectedDays.includes(day.key) ? '2px solid #722ed1' : '1px solid #d9d9d9',
                          borderRadius: 6,
                          textAlign: 'center',
                          cursor: 'pointer',
                          backgroundColor: selectedDays.includes(day.key) ? '#f0f0ff' : 'white',
                          color: selectedDays.includes(day.key) ? '#722ed1' : '#666',
                          fontWeight: selectedDays.includes(day.key) ? 'bold' : 'normal'
                        }}
                        onClick={() => handleDayToggle(day.key)}
                      >
                        {day.label}
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </Card>

          {/* Fees Configuration */}
          <Card type="inner" title="Fees" style={{ marginBottom: 24, borderRadius: 8 }}>
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ margin: 0, color: '#666' }}>Configure loan fees</h4>
            </div>
            
            {loadingProductDetails ? (
              <div style={{ padding: '20px 0' }}>
                <Skeleton active paragraph={{ rows: 2 }} />
                <div style={{ marginTop: 16 }}>
                  <Skeleton.Button active size="default" style={{ width: 120, height: 40 }} />
                </div>
              </div>
            ) : configuredFees.length === 0 ? (
              <div style={{ 
                border: '2px dashed #d9d9d9', 
                borderRadius: 8, 
                padding: 40, 
                textAlign: 'center',
                backgroundColor: '#fafafa'
              }}>
                <p style={{ color: '#666', marginBottom: 16 }}>No fees configured yet. Add your first fee below.</p>
                <Button type="primary" onClick={handleAddFee} style={{ borderRadius: 8 }}>
                  + Add Fees
                </Button>
              </div>
            ) : (
              <div>
                {configuredFees.map((fee, index) => (
                  <Card 
                    key={fee.id} 
                    size="small" 
                    style={{ marginBottom: 8, borderRadius: 8 }}
                    extra={
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Button 
                          type="text" 
                          size="small"
                          onClick={() => handleEditFee(fee)}
                          style={{ color: '#1890ff' }}
                        >
                          Edit
                        </Button>
                      <Button 
                        type="text" 
                        danger 
                        size="small"
                        onClick={() => removeFee(fee.id)}
                      >
                        Remove
                      </Button>
                      </div>
                    }
                  >
                    <Row gutter={[16, 8]} align="middle">
                      <Col xs={24} lg={6}>
                        <strong>{fee.name}</strong>
                      </Col>
                      <Col xs={24} lg={4}>
                        <span style={{ color: '#666' }}>
                          {fee.type === 'percentage' ? `${fee.percentage}%` : `GH₵ ${fee.amount}`}
                        </span>
                      </Col>
                      <Col xs={24} lg={8}>
                        <span style={{ color: '#666' }}>On: {fee.calculate_on}</span>
                      </Col>
                      <Col xs={24} lg={6}>
                        <span style={{ color: '#666' }}>{fee.type === 'percentage' ? 'Percentage' : 'Fixed'}</span>
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Button type="dashed" onClick={handleAddFee} style={{ width: '100%', marginTop: 8, borderRadius: 8 }}>
                  + Add More Fees
                </Button>
              </div>
            )}
          </Card>

          {/* Late Repayment Penalty */}
          {/* <Card type="inner" title="Late Repayment Penalty" style={{ marginBottom: 24, borderRadius: 8 }}>
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ margin: 0, color: '#666' }}>Configure the penalty for late repayments</h4>
            </div>
            
            {loadingProductDetails ? (
              <div style={{ padding: '20px 0' }}>
                <Skeleton active paragraph={{ rows: 3 }} />
              </div>
            ) : (
              <>
                <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
                  <Col xs={24} lg={12}>
                    <span>Enable Late Repayment Penalty</span>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Switch 
                      checked={latePenaltyEnabled} 
                      onChange={setLatePenaltyEnabled}
                      style={{ backgroundColor: latePenaltyEnabled ? '#722ed1' : '#d9d9d9' }}
                    />
                  </Col>
                </Row>

                {latePenaltyEnabled && (
                  <>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} lg={8}>
                        <Form.Item
                          label={
                            <span>
                              Penalty Type <span className="text-danger">*</span>
                            </span>
                          }
                          name={['late_repayment_penalty', 'penalty_type']}
                          rules={[{ required: latePenaltyEnabled, message: "Penalty type is required" }]}
                        >
                          <Select 
                            {...SELECT_PROPS} 
                            placeholder="Select penalty type" 
                            className="custom-select"
                            onChange={(value) => setPenaltyType(value)}
                          >
                            <Option value="fixed">Fixed Amount</Option>
                            <Option value="percentage">Percentage Based</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                  {penaltyType === 'percentage' && (
                    <Col xs={24} lg={8}>
                      <Form.Item
                        label={
                          <span>
                            Calculate Penalty On <span className="text-danger">*</span>
                          </span>
                        }
                        name={['late_repayment_penalty', 'calculate_penalty_on']}
                        rules={[{ required: latePenaltyEnabled, message: "Calculate penalty on is required" }]}
                      >
                        <Select {...SELECT_PROPS} placeholder="Select calculation basis" className="custom-select">
                          <Option value="Interest Amount">Interest Amount</Option>
                          <Option value="Principal Amount">Principal Amount</Option>
                          <Option value="Principal + Interest Amount">Principal + Interest Amount</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  )}
                  <Col xs={24} lg={8}>
                    <Form.Item
                      label={
                        <span>
                          {penaltyType === 'percentage' ? 'Penalty Percentage' : 'Penalty Amount'} <span className="text-danger">*</span>
                        </span>
                      }
                      name={penaltyType === 'percentage' ? ['late_repayment_penalty', 'penalty_percentage'] : ['late_repayment_penalty', 'penalty_amount']}
                      rules={[{ required: latePenaltyEnabled, message: penaltyType === 'percentage' ? "Penalty percentage is required" : "Penalty amount is required" }]}
                    >
                      {penaltyType === 'percentage' ? (
                        <InputNumber
                          className="custom-number-input"
                          placeholder="Enter penalty percentage"
                          style={FIELD_STYLE}
                          min={0}
                          max={100}
                          addonAfter="%"
                          step={0.01}
                        />
                      ) : (
                        <InputNumber
                          className="custom-number-input"
                          placeholder="Enter penalty amount"
                          style={FIELD_STYLE}
                          min={0}
                          addonAfter="GHS"
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={8}>
                    <Form.Item
                      label={
                        <Tooltip title="The number of days to wait before a penalty fee is applied." placement="top" color="white">
                          <span>
                            Grace Period (Optional) <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                          </span>
                        </Tooltip>
                      }
                      name={['late_repayment_penalty', 'grace_period']}
                    >
                      <InputNumber
                        className="custom-number-input"
                        placeholder="Enter grace period"
                        style={FIELD_STYLE}
                        min={0}
                        addonAfter="days"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={8}>
                    <Form.Item
                      label={
                        <Tooltip title="How often the penalty is to be applied on the loan if overdue on a repayment." placement="top" color="white">
                          <span>
                            Recurring Penalty <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                          </span>
                        </Tooltip>
                      }
                      name={['late_repayment_penalty', 'recurring_penalty']}
                    >
                      <Select {...SELECT_PROPS} placeholder="Select recurring penalty" className="custom-select">
                        <Option value="once">Once</Option>
                        <Option value="daily">Daily</Option>
                        <Option value="weekly">Weekly</Option>
                        <Option value="biweekly">Biweekly</Option>
                        <Option value="monthly">Monthly</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                  </>
                )}
              </>
            )}
          </Card> */}

          {/* Guarantor */}
          <Card type="inner" title="Guarantor" style={{ marginBottom: 24, borderRadius: 8 }}>
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ margin: 0, color: '#666' }}>Details of the guarantor</h4>
            </div>
            
            <Row gutter={[16, 16]}>
            <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <span>
                      Guarantor <span className="text-danger">*</span>
                    </span>
                  }
                  name="guarantor_id"
                  rules={[{ required: true, message: "Guarantor is required" }]}
                >
                  <Select 
                    {...SELECT_PROPS} 
                    placeholder="Select a guarantor" 
                    className="custom-select"
                    loading={loadingGuarantors}
                    notFoundContent={loadingGuarantors ? <Spin size="small" /> : "No guarantors found"}
                  >
                    {activeGuarantors.map((guarantor) => (
                      <Option key={guarantor.guarantor_id} value={guarantor.guarantor_id}>
                        {guarantor.fullname}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <span>
                      Relationship <span className="text-danger">*</span>
                    </span>
                  }
                  name="guarantor_relationship"
                  rules={[{ required: true, message: "Relationship is required" }]}
                >
                  <Select {...SELECT_PROPS} placeholder="Select a relationship" className="custom-select">
                  <Option value="Friend">Friend</Option>
                    <Option value="Family">Family</Option>
                    <Option value="Colleague">Colleague</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>


              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <span>
                      Guarantor Relationship Duration <span className="text-danger">*</span>
                    </span>
                  }
                  name="guarantor_relationship_duration"
                  rules={[{ required: true, message: "Guarantor relationship duration is required" }]}
                >
                  <InputNumber
                    className="custom-number-input"
                    placeholder="Enter guarantor relationship duration"
                    style={FIELD_STYLE}
                    min={1}
                    max={360}
                    addonAfter="years"
                    onChange={() => {
                      setTimeout(() => {
                        calculateInstallmentAmount(installmentType);
                      }, 100);
                    }}
                  />
                </Form.Item>
              </Col>

              
            
            </Row>
          </Card>

          {/* Accounts Configuration */}
          <Card type="inner" title="Accounts" style={{ marginBottom: 24, borderRadius: 8 }}>
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ margin: 0, color: '#666' }}>Configure journal accounts</h4>
            </div>
            
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={8}>
                {loadingProductDetails ? (
                  <FormFieldSkeleton label="Funding Account *" />
                ) : (
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
                    onChange={handleFundingAccountChange}
                  >
                      {CashFundingAccountsData?.data?.map((account) => (
                        <Option key={account.id} value={account.id}>
                          {account.acc_name} ({account.acc_code})
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
                )}
              </Col>
              <Col xs={24} lg={8}>
                {loadingProductDetails ? (
                  <FormFieldSkeleton label="Branch Funding *" />
                ) : (
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
                      placeholder={!selectedFundingAccount ? "Select funding account first" : "Select branch funding"} 
                      className="custom-select"
                      loading={BranchFundingData?.isLoading}
                      disabled={!selectedFundingAccount}
                    >
                      {BranchFundingData?.data?.map((branch) => (
                        <Option key={Number(branch.key)} value={Number(branch.key)}>
                          {branch.name} - {branch.branch_name} ({branch.code})
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}
              </Col>
              <Col xs={24} lg={8}>
                {loadingProductDetails ? (
                  <FormFieldSkeleton label="Loans Receivable Account *" />
                ) : (
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
                )}
              </Col>
              <Col xs={24} lg={8}>
                {loadingProductDetails ? (
                  <FormFieldSkeleton label="Default Interest Income Account *" />
                ) : (
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
                )}
              </Col>
              <Col xs={24} lg={8}>
                {loadingProductDetails ? (
                  <FormFieldSkeleton label="Default Fees Income Account *" />
                ) : (
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
                )}
              </Col>
              <Col xs={24} lg={8}>
                {loadingProductDetails ? (
                  <FormFieldSkeleton label="Default Penalty Income Account *" />
                ) : (
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
                )}
              </Col>
              <Col xs={24} lg={8}>
                {loadingProductDetails ? (
                  <FormFieldSkeleton label="Default Overpayment Account *" />
                ) : (
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
                )}
              </Col>
            </Row>
          </Card>

          <Form.Item style={{ textAlign: "right" }}>
            <Button
              type="primary"
              htmlType="button"
              shape="round"
              size="large"
              style={{ 
                minWidth: 120, 
                marginRight: 16,
                backgroundColor: '#722ed1',
                borderColor: '#722ed1'
              }}
              onClick={handleViewRepaymentSchedule}
            >
              View Repayment Schedule
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              shape="round"
              loading={loading}
              size="large"
              style={{ minWidth: 120 }}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </Card>



      {/* Floating Chat Button */}
      <div style={{
        position: 'fixed',
        bottom: 80,
        right: 24,
        zIndex: 1001
      }}>
        <Button
          type="primary"
          shape="circle"
          size="large"
          style={{
            width: 56,
            height: 56,
            backgroundColor: '#1890ff',
            borderColor: '#1890ff',
            boxShadow: '0 4px 12px rgba(24, 144, 255, 0.4)'
          }}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
          }
        />
      </div>

      {/* Configure Fee Modal */}
      <Modal
        title={editingFee ? "Edit Fee" : "Configure Fee"}
        open={feesModalVisible}
        onCancel={handleFeeCancel}
        footer={null}
        width={600}
      >
        <Form
          form={feeForm}
          layout="vertical"
          onFinish={handleFeeSave}
        >
          <Form.Item
            label={
              <span>
                Name <span className="text-danger">*</span>
              </span>
            }
            name="name"
            rules={[{ required: true, message: "Fee name is required" }]}
          >
            <Input placeholder="Enter fee name" style={FIELD_STYLE} />
          </Form.Item>

          <Form.Item label="Fee Type">
            <Row gutter={16}>
              <Col span={12}>
                <Card
                  hoverable
                  style={{
                    border: feeType === 'percentage' ? '2px solid #1890ff' : '1px solid #d9d9d9',
                    borderRadius: 8,
                    cursor: 'pointer'
                  }}
                  onClick={() => setFeeType('percentage')}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 16, marginBottom: 8 }}>%</div>
                    <div style={{ fontWeight: 'bold' }}>Percentage Based</div>
                    <div style={{ fontSize: 12, color: '#666' }}>Based on principal amount</div>
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  hoverable
                  style={{
                    border: feeType === 'fixed' ? '2px solid #1890ff' : '1px solid #d9d9d9',
                    borderRadius: 8,
                    cursor: 'pointer'
                  }}
                  onClick={() => setFeeType('fixed')}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 16, marginBottom: 8 }}>$</div>
                    <div style={{ fontWeight: 'bold' }}>Fixed Amount</div>
                    <div style={{ fontSize: 12, color: '#666' }}>Fixed one-time charge</div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Form.Item>

          {feeType === 'percentage' && (
            <>
              <Form.Item
                label={
                  <span>
                    Calculate Fee On <span className="text-danger">*</span>
                  </span>
                }
                name="calculate_on"
                rules={[{ required: true, message: "Please select what to calculate fee on" }]}
              >
                <Select {...SELECT_PROPS} placeholder="Select calculation basis" className="custom-select">
                  <Option value="Principal Amount">Principal Amount</Option>
                  <Option value="Interest Amount">Interest Amount</Option>
                  <Option value="Principal + Interest Amount">Principal + Interest Amount</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    Fee Percentage <span className="text-danger">*</span>
                  </span>
                }
                name="percentage"
                rules={[{ required: true, message: "Fee percentage is required" }]}
              >
                <InputNumber
                  placeholder="Enter percentage"
                  style={FIELD_STYLE}
                  min={0}
                  max={100}
                  addonAfter="%"
                  step={0.01}
                />
              </Form.Item>
            </>
          )}

          {feeType === 'fixed' && (
            <Form.Item
              label={
                <span>
                  Fee Amount <span className="text-danger">*</span>
                </span>
              }
              name="amount"
              rules={[{ required: true, message: "Fee amount is required" }]}
            >
              <InputNumber
                placeholder="Enter fee amount"
                style={FIELD_STYLE}
                min={0}
                // addonBefore="GHC"
                addonAfter="GHS"
              />
            </Form.Item>
          )}

          <Form.Item
            label={
              <Tooltip
               title="i.e if you give a loan for 2,000 and the fee is 100, the fee would be deducted from 2,000 and remaining amount of 1,900 would be given to the borrower."
                placement="top" color="white">
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  Deduct from principal amount <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                </span>
              </Tooltip>
            }
            name="deduct_from_principal"
            valuePropName="checked"
          >
            <Switch 
              onChange={checked => {
                if (checked) {
                  feeForm.setFieldsValue({ spread_across_repayments: false });
                }
              }}
              checked={feeForm.getFieldValue('deduct_from_principal') || false}
            />
          </Form.Item>
         

          <Form.Item
            label={
              <Tooltip title="The fee amount will be divided equally and added to each repayment installment." placement="top" color="white">
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  Spread across repayments <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                </span>
              </Tooltip>
            }
            name="spread_across_repayments"
            valuePropName="checked"
          >
            <Switch 
              onChange={checked => {
                if (checked) {
                  feeForm.setFieldsValue({ deduct_from_principal: false });
                }
              }}
              checked={feeForm.getFieldValue('spread_across_repayments') || false}
            />
          </Form.Item>
        
          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Button onClick={handleFeeCancel} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button
  {...BUTTON_CONFIGS.SAVE_BUTTON()}
  htmlType="submit"
  loading={loading}
  size="small"
  shape="round"
  disabled={loading}

>
 {loading ? 'Loading...' : 'Save'}
</Button>
          </div>
        </Form>
      </Modal>

      {/* Repayment Schedule Modal */}
      <RepaymentScheduleModal
        visible={repaymentScheduleModalVisible}
        onClose={() => setRepaymentScheduleModalVisible(false)}
        scheduleData={repaymentSchedule}
        title="Repayment Schedule"
        jwt={jwt}
        loanData={{
          loan_amount: form.getFieldValue('principal_amount'),
          loan_duration: form.getFieldValue('loan_duration'),
          loan_period: form.getFieldValue('duration_period'),
          interest_rate: form.getFieldValue('interest_rate'),
          interest_cycle: form.getFieldValue('interest_cycle'),
          repayment_cycle: form.getFieldValue('repayment_cycle'),
          interest_method: form.getFieldValue('interest_method'),
          loan_release_date: form.getFieldValue('loan_release_date'),
          fees: configuredFees
        }}
      />
    </div>
  );
};

export default AddLoan;
