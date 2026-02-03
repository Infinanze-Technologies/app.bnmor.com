# Backend Function Prompt: Loan Repayment Schedule Calculator

## **Objective**
Create a backend function that calculates loan repayment schedules with the same logic as the frontend `calculateRepaymentSchedule` function. This function should handle various loan types, interest methods, and fee structures.

## **Function Signature**
```javascript
function calculateRepaymentSchedule(loanData) {
  // Implementation here
  return {
    schedule: [...],
    totalRepayment: "0.00"
  };
}
```

## **Input Parameters Structure**
```javascript
const loanData = {
  principal_amount: 10000,           // Number - Loan principal amount
  loan_duration: 12,                 // Number - Duration value
  duration_period: "Months",         // String - "Days", "Weeks", "Months", "Years"
  duration_type: "Fixed",            // String - "Fixed" or "Flexible"
  interest_rate: 15.5,               // Number - Annual interest rate percentage
  interest_method: "Flat",           // String - "Flat" or "Reducing Balance"
  repayment_cycle: "Monthly",        // String - "Once", "Daily", "Weekly", "Monthly", "Yearly"
  loan_release_date: "2024-01-15",   // String - ISO date format
  fees: [                            // Array of fee objects
    {
      name: "Processing Fee",
      type: "percentage",             // "percentage" or "fixed"
      calculate_on: "Principal Amount", // "Principal Amount", "Interest Amount", "Principal + Interest Amount"
      percentage: 2.5,               // Number - For percentage fees
      amount: 100,                   // Number - For fixed fees
      deduct_from_principal: false,  // Boolean
      spread_across_repayments: true // Boolean
    }
  ]
};
```

## **Output Structure**
```javascript
{
  schedule: [
    {
      dueDate: "15/02/2024",         // String - DD/MM/YYYY format
      description: "EMI 1",          // String - Installment description
      repayment: "1000.00",          // String - Total repayment amount
      principal: "875.00",           // String - Principal portion
      interest: "125.00",            // String - Interest portion
      fees: "0.00",                  // String - Fees portion
      balance: "9125.00"             // String - Remaining balance
    }
    // ... more schedule entries
  ],
  totalRepayment: "12000.00"         // String - Total repayment amount
}
```

## **Business Logic Requirements**

### **1. Installment Type Mapping**
```javascript
const installmentTypeMap = {
  "Once": "OTI",      // One-Time Installment
  "Daily": "EDI",     // Equated Daily Installment
  "Weekly": "EWI",    // Equated Weekly Installment
  "Monthly": "EMI",   // Equated Monthly Installment
  "Yearly": "EYI"     // Equated Yearly Installment
};
```

### **2. Duration Calculation**
- **Fixed Duration**: Use `loan_duration` directly
- **Flexible Duration**: Use average of `min_loan_duration` and `max_loan_duration`
- **Duration Conversion**: Convert all durations to the same unit for calculations

### **3. Interest Calculation**

**Flat Interest Method:**
```javascript
// Convert duration to years
let durationInYears = duration;
if (duration_period === "Days") durationInYears = duration / 365;
else if (duration_period === "Weeks") durationInYears = duration / 52;
else if (duration_period === "Months") durationInYears = duration / 12;
else if (duration_period === "Years") durationInYears = duration;

totalInterest = (principal * interest_rate * durationInYears) / 100;
totalAmount = principal + totalInterest;
```

**Reducing Balance Method:**
```javascript
// EMI Formula for reducing balance
const monthlyRate = interest_rate / 100 / 12;
const numberOfMonths = duration_period === "Months" ? duration : 
                      duration_period === "Years" ? duration * 12 :
                      duration_period === "Days" ? duration / 30 : duration;

if (monthlyRate > 0) {
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths) / 
             (Math.pow(1 + monthlyRate, numberOfMonths) - 1);
  totalAmount = emi * numberOfMonths;
  totalInterest = totalAmount - principal;
}
```

### **4. Number of Installments Calculation**
```javascript
let numberOfInstallments = 1;

switch (installmentType) {
  case "OTI":
    numberOfInstallments = 1;
    break;
  case "EDI":
    if (duration_period === "Days") numberOfInstallments = duration;
    else if (duration_period === "Weeks") numberOfInstallments = duration * 7;
    else if (duration_period === "Months") numberOfInstallments = duration * 30;
    else if (duration_period === "Years") numberOfInstallments = duration * 365;
    break;
  case "EWI":
    if (duration_period === "Days") numberOfInstallments = Math.ceil(duration / 7);
    else if (duration_period === "Weeks") numberOfInstallments = duration;
    else if (duration_period === "Months") numberOfInstallments = duration * 4;
    else if (duration_period === "Years") numberOfInstallments = duration * 52;
    break;
  case "EMI":
    if (duration_period === "Days") numberOfInstallments = Math.ceil(duration / 30);
    else if (duration_period === "Weeks") numberOfInstallments = Math.ceil(duration / 4);
    else if (duration_period === "Months") numberOfInstallments = duration;
    else if (duration_period === "Years") numberOfInstallments = duration * 12;
    break;
  case "EYI":
    if (duration_period === "Days") numberOfInstallments = Math.ceil(duration / 365);
    else if (duration_period === "Weeks") numberOfInstallments = Math.ceil(duration / 52);
    else if (duration_period === "Months") numberOfInstallments = Math.ceil(duration / 12);
    else if (duration_period === "Years") numberOfInstallments = duration;
    break;
}
```

### **5. Fee Processing**
```javascript
let totalFees = 0;
let feesToDeductFromPrincipal = 0;
let feesPerInstallment = 0;

fees.forEach(fee => {
  let feeAmount = 0;
  
  if (fee.type === "percentage") {
    let calculateOnAmount = 0;
    switch (fee.calculate_on) {
      case "Principal Amount":
        calculateOnAmount = principal;
        break;
      case "Interest Amount":
        calculateOnAmount = totalInterest;
        break;
      case "Principal + Interest Amount":
        calculateOnAmount = principal + totalInterest;
        break;
      default:
        calculateOnAmount = principal;
    }
    feeAmount = (calculateOnAmount * fee.percentage) / 100;
  } else {
    feeAmount = fee.amount || 0;
  }
  
  totalFees += feeAmount;
  
  if (fee.deduct_from_principal) {
    feesToDeductFromPrincipal += feeAmount;
  } else if (fee.spread_across_repayments) {
    feesPerInstallment += feeAmount / numberOfInstallments;
  }
});

// Adjust total amount
totalAmount += totalFees - feesToDeductFromPrincipal;
```

### **6. Schedule Generation**
```javascript
const installmentAmount = Number((totalAmount / numberOfInstallments).toFixed(2));
const releaseDate = new Date(loan_release_date);

for (let i = 0; i < numberOfInstallments; i++) {
  const dueDate = new Date(releaseDate);
  // Add appropriate time based on installment type
  dueDate.setDate(dueDate.getDate() + (i * getDaysPerInstallment()));
  
  const isLastInstallment = i === numberOfInstallments - 1;
  
  // Calculate fees for this installment
  let installmentFees = 0;
  if (feesPerInstallment > 0) {
    installmentFees = feesPerInstallment;
  } else if (i === 0 && totalFees > 0) {
    installmentFees = totalFees;
  }
  
  // Calculate repayment amount
  let repaymentAmount = installmentAmount;
  if (installmentType === "OTI" && isLastInstallment) {
    repaymentAmount = totalAmount;
  }
  
  // Calculate principal and interest portions
  let installmentPrincipal = 0;
  let installmentInterest = 0;
  
  if (installmentType === "OTI" && isLastInstallment) {
    installmentPrincipal = principal - feesToDeductFromPrincipal;
    installmentInterest = totalInterest;
  } else {
    installmentPrincipal = (principal - feesToDeductFromPrincipal) / numberOfInstallments;
    installmentInterest = totalInterest / numberOfInstallments;
  }
  
  // Calculate balance
  let balance = 0;
  if (installmentType === "OTI") {
    balance = isLastInstallment ? 0 : (principal - feesToDeductFromPrincipal);
  } else {
    balance = Math.max(0, (principal - feesToDeductFromPrincipal) - (installmentPrincipal * (i + 1)));
  }
  
  schedule.push({
    dueDate: formatDate(dueDate), // DD/MM/YYYY format
    description: `${installmentType} ${i + 1}`,
    repayment: repaymentAmount.toFixed(2),
    principal: installmentPrincipal.toFixed(2),
    interest: installmentInterest.toFixed(2),
    fees: installmentFees.toFixed(2),
    balance: balance.toFixed(2)
  });
}
```

### **7. Total Repayment Calculation**
```javascript
// Calculate actual total from schedule rows to ensure consistency
const actualTotal = schedule.reduce((sum, row) => {
  return sum + parseFloat(row.repayment);
}, 0);

return {
  schedule,
  totalRepayment: actualTotal.toFixed(2)
};
```

## **Helper Functions Needed**
1. **Date formatting function** to convert dates to DD/MM/YYYY format
2. **Days per installment calculation** based on installment type
3. **Input validation** for required fields
4. **Error handling** for invalid inputs

## **Validation Requirements**
- `principal_amount` must be > 0
- `interest_rate` must be between 0 and 100
- `loan_duration` must be > 0
- `loan_release_date` must be a valid date
- For flexible duration, both `min_loan_duration` and `max_loan_duration` are required

## **Error Handling**
Return appropriate error messages for:
- Missing required fields
- Invalid date formats
- Invalid numeric values
- Division by zero scenarios

## **Testing Scenarios**
Test with various combinations:
- Different interest methods (Flat vs Reducing Balance)
- Different repayment cycles (Once, Monthly, Weekly, etc.)
- Different fee structures (percentage vs fixed, deduction vs spreading)
- Edge cases (zero interest rate, single installment, etc.)

## **Important Notes**
- All monetary values should be rounded to 2 decimal places
- Date calculations should handle month/year boundaries correctly
- The function should produce identical results to the frontend calculation logic
- Ensure consistency between theoretical totals and actual schedule totals
- Handle edge cases gracefully (e.g., zero interest rate, single installment loans)

This function should produce identical results to the frontend calculation logic to ensure consistency across your application.
