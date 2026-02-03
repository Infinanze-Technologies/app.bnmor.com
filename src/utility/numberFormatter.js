/**
 * Formats a number into a readable figure with appropriate suffix
 * @param {number} num - The number to format
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted number string
 */
export const formatNumber = (num, decimals = 1) => {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }

  const absNum = Math.abs(num);
  
  if (absNum >= 1000000000) {
    return (num / 1000000000).toFixed(decimals).replace(/\.0$/, '') + 'B';
  }
  
  if (absNum >= 1000000) {
    return (num / 1000000).toFixed(decimals).replace(/\.0$/, '') + 'M';
  }
  
  if (absNum >= 1000) {
    return (num / 1000).toFixed(decimals).replace(/\.0$/, '') + 'K';
  }
  
  return num.toString();
};

/**
 * Formats currency amounts with appropriate suffix
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency symbol (default: 'GHC ')
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'GHC ', decimals = 1) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return currency + '0';
  }

  const absAmount = Math.abs(amount);
  
  if (absAmount >= 1000000000) {
    return currency + (amount / 1000000000).toFixed(decimals).replace(/\.0$/, '') + 'B';
  }
  
  if (absAmount >= 1000000) {
    return currency + (amount / 1000000).toFixed(decimals).replace(/\.0$/, '') + 'M';
  }
  
  if (absAmount >= 1000) {
    return currency + (amount / 1000).toFixed(decimals).replace(/\.0$/, '') + 'K';
  }
  
  return currency + amount.toLocaleString();
};



/**
 * Formats numbers for display in charts and tables
 * @param {number} num - The number to format
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted number string
 */
export const formatChartNumber = (num, decimals = 0) => {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }

  const absNum = Math.abs(num);
  
  if (absNum >= 1000000000) {
    return (num / 1000000000).toFixed(decimals) + 'B';
  }
  
  if (absNum >= 1000000) {
    return (num / 1000000).toFixed(decimals) + 'M';
  }
  
  if (absNum >= 1000) {
    return (num / 1000).toFixed(decimals) + 'K';
  }
  
  return num.toLocaleString();
};

/**
 * Formats percentage values
 * @param {number} value - The value to format as percentage
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }
  
  return value.toFixed(decimals) + '%';
};

/**
 * Formats numbers with comma separators (e.g., 100000 to 100,000)
 * @param {number} num - The number to format
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted number string with commas
 */
export const formatNumberWithCommas = (num, decimals = 0) => {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }
  
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}; 