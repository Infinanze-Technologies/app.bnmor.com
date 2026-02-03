import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const FinanceDashboard = ({ FinanceComprehensiveAnalyticsDataObject, comprehensiveAnalyticsData, AnnualIncomeDataObject, selectedYear, setSelectedYear }) => {
  
  let financeComprehensiveAnalyticsData = FinanceComprehensiveAnalyticsDataObject?.data

  const [timeRange, setTimeRange] = useState('7d');

  // Professional number formatting function following accounting standards
  const formatAccountingNumber = (num, isCurrency = false) => {
    if (num === null || num === undefined || isNaN(num)) return isCurrency ? '₵0.00' : '0';
    
    const absNum = Math.abs(num);
    const isNegative = num < 0;
    
    if (isCurrency) {
      // For currency, always show 2 decimal places and use proper formatting
      if (absNum >= 1e9) {
        const formatted = (absNum / 1e9).toFixed(2);
        return `₵${isNegative ? '-' : ''}${formatted}B`;
      } else if (absNum >= 1e6) {
        const formatted = (absNum / 1e6).toFixed(2);
        return `₵${isNegative ? '-' : ''}${formatted}M`;
      } else if (absNum >= 1e3) {
        const formatted = (absNum / 1e3).toFixed(2);
        return `₵${isNegative ? '-' : ''}${formatted}K`;
      } else {
        return `₵${num.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`;
      }
    } else {
      // For counts, use integer formatting with K, M, B notation
      if (absNum >= 1e9) {
        const formatted = (absNum / 1e9).toFixed(1);
        return `${isNegative ? '-' : ''}${formatted}B`;
      } else if (absNum >= 1e6) {
        const formatted = (absNum / 1e6).toFixed(1);
        return `${isNegative ? '-' : ''}${formatted}M`;
      } else if (absNum >= 1e3) {
        const formatted = (absNum / 1e3).toFixed(1);
        return `${isNegative ? '-' : ''}${formatted}K`;
      } else {
        return num.toLocaleString('en-US');
      }
    }
  };

  // Generate year options (current year and 5 years back)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);

  // Add error boundary and data validation
  if (!financeComprehensiveAnalyticsData) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading Finance dashboard data...</p>
        </div>
      </div>
    );
  }

  // Finance metrics cards
  const financeCards = [
    {
      title: 'Total Transactions',
      value: formatAccountingNumber(financeComprehensiveAnalyticsData?.totalCount || 0),
      icon: 'fas fa-exchange-alt',
      color: 'primary',
      trend: financeComprehensiveAnalyticsData?.thisMonthCount > financeComprehensiveAnalyticsData?.lastMonthCount ? '+10%' : '-5%',
      trendDirection: financeComprehensiveAnalyticsData?.thisMonthCount > financeComprehensiveAnalyticsData?.lastMonthCount ? 'up' : 'down'
    },
    {
      title: 'Active Transactions',
      value: formatAccountingNumber(financeComprehensiveAnalyticsData?.activeCount || 0),
      icon: 'fas fa-check-circle',
      color: 'success',
      trend: '+8%',
      trendDirection: 'up'
    },
    {
      title: 'Total Amount',
      value: formatAccountingNumber(financeComprehensiveAnalyticsData?.totalAmount || 0, true),
      icon: 'fas fa-money-bill-wave',
      color: 'info',
      trend: '+12%',
      trendDirection: 'up'
    },
    {
      title: 'Net Cash Flow',
      value: formatAccountingNumber(financeComprehensiveAnalyticsData?.transactionMetrics?.netCashFlow || 0, true),
      icon: 'fas fa-chart-line',
      color: financeComprehensiveAnalyticsData?.transactionMetrics?.netCashFlow >= 0 ? 'success' : 'warning',
      trend: financeComprehensiveAnalyticsData?.transactionMetrics?.netCashFlow >= 0 ? '+5%' : '-3%',
      trendDirection: financeComprehensiveAnalyticsData?.transactionMetrics?.netCashFlow >= 0 ? 'up' : 'down'
    },
    {
      title: 'Total Deposits',
      value: formatAccountingNumber(financeComprehensiveAnalyticsData?.transactionMetrics?.totalDeposits || 0, true),
      icon: 'fas fa-arrow-up',
      color: 'success',
      trend: '+15%',
      trendDirection: 'up'
    },
    {
      title: 'Total Expenses',
      value: formatAccountingNumber(financeComprehensiveAnalyticsData?.transactionMetrics?.totalExpenses || 0, true),
      icon: 'fas fa-arrow-down',
      color: 'warning',
      trend: '+8%',
      trendDirection: 'up'
    },
    {
      title: 'Average Amount',
      value: formatAccountingNumber(financeComprehensiveAnalyticsData?.averageAmount || 0, true),
      icon: 'fas fa-calculator',
      color: 'info',
      trend: '+5%',
      trendDirection: 'up'
    },
    {
      title: 'Account Utilization',
      value: `${financeComprehensiveAnalyticsData?.financialHealth?.accountUtilization || 0}%`,
      icon: 'fas fa-percentage',
      color: 'primary',
      trend: '+2%',
      trendDirection: 'up'
    }
  ];

  // Chart data from API - Separate trends
  const chartData = {
    payroll: {
      series: [{
        name: 'Payroll Analytics',
        data: comprehensiveAnalyticsData?.data?.payrollAnalytics?.trendData?.series || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }],
      categories: comprehensiveAnalyticsData?.data?.payrollAnalytics?.trendData?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    finance: {
      series: [{
        name: 'Finance Analytics',
        data: financeComprehensiveAnalyticsData?.trendData?.series || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }],
      categories: financeComprehensiveAnalyticsData?.trendData?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  };

  // Payroll Analytics chart options
  const payrollTrendsOptions = {
    chart: {
      type: 'line',
      height: 300,
      toolbar: {
        show: true
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: ['#f093fb'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    markers: {
      size: 6,
      hover: {
        size: 8
      }
    },
    xaxis: {
      categories: chartData.payroll.categories,
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Payroll Count',
        style: {
          color: '#6b7280',
          fontSize: '14px',
          fontWeight: 600
        }
      },
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px'
        }
      }
    },
    title: {
      text: 'Payroll Analytics Trends',
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: 600,
        color: '#1f2937'
      }
    },
    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 4
    },
    tooltip: {
      theme: 'light'
    }
  };

  // Finance Analytics chart options
  const financeTrendsOptions = {
    chart: {
      type: 'line',
      height: 300,
      toolbar: {
        show: true
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: ['#4facfe'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    markers: {
      size: 6,
      hover: {
        size: 8
      }
    },
    xaxis: {
      categories: chartData.finance.categories,
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Transaction Count',
        style: {
          color: '#6b7280',
          fontSize: '14px',
          fontWeight: 600
        }
      },
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px'
        }
      }
    },
    title: {
      text: 'Finance Analytics Trends',
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: 600,
        color: '#1f2937'
      }
    },
    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 4
    },
    tooltip: {
      theme: 'light'
    }
  };

  // Annual Income Bar Chart data and options
  const annualIncomeSeries = [{
    name: 'Monthly Income',
    data: AnnualIncomeDataObject?.data?.series || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }];

  const annualIncomeOptions = {
    chart: {
      type: 'bar',
      height: 400,
      toolbar: {
        show: true
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: ['#667eea'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        endingShape: 'rounded',
        borderRadius: 8
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: AnnualIncomeDataObject?.data?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Income (₵)',
        style: {
          color: '#6b7280',
          fontSize: '14px',
          fontWeight: 600
        }
      },
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px'
        },
        formatter: function (val) {
          return '₵' + val.toLocaleString();
        }
      }
    },
    title: {
      text: `Annual Income Analysis - ${selectedYear}`,
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: 600,
        color: '#1f2937'
      }
    },
    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 4
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: function (val) {
          return formatAccountingNumber(val, true);
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: ['#764ba2'],
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0.3,
        stops: [0, 100]
      }
    }
  };

  return (
    <div className="finance-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="dashboard-title">
              <i className="fas fa-chart-line"></i>
              Finance Management Dashboard
            </h1>
            <p className="dashboard-subtitle">
              Financial analytics and transaction management insights
            </p>
          </div>
          <div className="header-actions">
            <div className="status-indicators">
              <div className="status-item">
                <i className="fas fa-circle text-success"></i>
                <span>Finance System Online</span>
              </div>
              <div className="status-item">
                <i className="fas fa-clock"></i>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Finance Cards */}
      <div className="finance-cards">
        {financeCards.map((card, index) => (
          <div key={index} className={`finance-card ${card.color}`}>
            <div className="card-header">
              <div className="card-icon">
                <i className={card.icon}></i>
              </div>
              <div className="card-trend">
                <span className={`trend ${card.trendDirection}`}>
                  <i className={`fas fa-arrow-${card.trendDirection === 'up' ? 'up' : 'down'}`}></i>
                  {card.trend}
                </span>
              </div>
            </div>
            <div className="card-body">
              <div className="card-value">{card.value}</div>
              <div className="card-title">{card.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="charts-grid">
          {/* Payroll Analytics Chart */}
          <div className="chart-container">
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">
                  <i className="fas fa-money-bill-wave"></i>
                  Payroll Analytics
                </h3>
                <div className="chart-actions">
                  <button className="action-btn">
                    <i className="fas fa-download"></i>
                  </button>
                  <button className="action-btn">
                    <i className="fas fa-expand"></i>
                  </button>
                </div>
              </div>
              <div className="chart-content">
                {chartData.payroll.series && chartData.payroll.series.length > 0 ? (
                  <Chart
                    options={payrollTrendsOptions}
                    series={chartData.payroll.series}
                    type="line"
                    height={300}
                  />
                ) : (
                  <div className="no-data-message">
                    <i className="fas fa-money-bill-wave"></i>
                    <p>No payroll data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Finance Analytics Chart */}
          <div className="chart-container">
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">
                  <i className="fas fa-chart-line"></i>
                  Finance Analytics
                </h3>
                <div className="chart-actions">
                  <button className="action-btn">
                    <i className="fas fa-download"></i>
                  </button>
                  <button className="action-btn">
                    <i className="fas fa-expand"></i>
                  </button>
                </div>
              </div>
              <div className="chart-content">
                {chartData.finance.series && chartData.finance.series.length > 0 ? (
                  <Chart
                    options={financeTrendsOptions}
                    series={chartData.finance.series}
                    type="line"
                    height={300}
                  />
                ) : (
                  <div className="no-data-message">
                    <i className="fas fa-chart-line"></i>
                    <p>No finance data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Annual Income Bar Chart */}
          <div className="chart-container chart-full-width">
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">
                  <i className="fas fa-chart-bar"></i>
                  Annual Income Analysis
                </h3>
                <div className="chart-controls">
                  <div className="year-selector-container">
                    <label className="year-label">Year:</label>
                    <select 
                      className="year-selector"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    >
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="chart-actions">
                    <button className="action-btn">
                      <i className="fas fa-download"></i>
                    </button>
                    <button className="action-btn">
                      <i className="fas fa-expand"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="chart-content">
                {AnnualIncomeDataObject?.data?.series && AnnualIncomeDataObject.data.series.length > 0 ? (
                  <Chart
                    options={annualIncomeOptions}
                    series={annualIncomeSeries}
                    type="bar"
                    height={400}
                  />
                ) : (
                  <div className="no-data-message">
                    <i className="fas fa-chart-bar"></i>
                    <p>No income data available for {selectedYear}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .finance-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%);
          padding: 20px;
        }

        .dashboard-header {
          background: linear-gradient(135deg, #4D4D4D 0%, #4347D9 100%);
          border-radius: 20px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 10px 40px rgba(95, 99, 242, 0.2);
          position: relative;
          overflow: hidden;
        }

        .dashboard-header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 2;
        }

        .header-text {
          flex: 1;
        }

        .dashboard-title {
          font-size: 2rem;
          font-weight: 800;
          margin: 0 0 10px 0;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .dashboard-title i {
          font-size: 1.5rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .dashboard-subtitle {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.95rem;
          margin: 0;
          font-weight: 400;
        }

        .header-actions {
          display: flex;
          align-items: center;
        }

        .status-indicators {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
          background: rgba(255, 255, 255, 0.1);
          padding: 8px 16px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }

        .status-item i {
          font-size: 12px;
        }

        .finance-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .finance-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .finance-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
        }

        .finance-card.primary::before { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .finance-card.success::before { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
        .finance-card.warning::before { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
        .finance-card.info::before { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }

        .finance-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .card-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: #ffffff;
        }

        .finance-card.primary .card-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .finance-card.success .card-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
        .finance-card.warning .card-icon { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
        .finance-card.info .card-icon { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }

        .card-trend {
          display: flex;
          align-items: center;
        }

        .trend {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 20px;
        }

        .trend.up {
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }

        .trend.down {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        .card-body {
          text-align: left;
        }

        .card-value {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
          line-height: 1;
        }

        .card-title {
          font-size: 0.8rem;
          color: #6b7280;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .charts-section {
          margin-bottom: 30px;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .chart-container {
          background: #ffffff;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .chart-full-width {
          grid-column: 1 / -1;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f1f3f4;
        }

        .chart-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .chart-title i {
          color: #667eea;
          font-size: 0.9rem;
        }

        .chart-controls {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .year-selector-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .year-label {
          font-size: 0.9rem;
          color: #6b7280;
          font-weight: 500;
        }

        .year-selector {
          background: #f8f9fa;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 6px 12px;
          color: #1f2937;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .year-selector:hover {
          border-color: #667eea;
          background: #ffffff;
        }

        .year-selector:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .chart-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: #f8f9fa;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          background: #667eea;
          color: #ffffff;
          transform: scale(1.05);
        }

        .chart-content {
          min-height: 400px;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .loading-spinner {
          text-align: center;
          color: #6b7280;
        }

        .loading-spinner i {
          font-size: 2rem;
          margin-bottom: 10px;
          color: #667eea;
        }

        .loading-spinner p {
          font-size: 1rem;
          margin: 0;
        }

        .no-data-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          color: #6b7280;
          text-align: center;
        }

        .no-data-message i {
          font-size: 3rem;
          margin-bottom: 15px;
          color: #d1d5db;
        }

        .no-data-message p {
          font-size: 1rem;
          margin: 0;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .charts-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .finance-dashboard {
            padding: 20px;
          }
          
          .dashboard-header {
            padding: 20px;
          }
          
          .header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
          
          .dashboard-title {
            font-size: 1.8rem;
          }
          
          .finance-cards {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
          }
          
          .card-value {
            font-size: 1.6rem;
          }

          .charts-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .chart-controls {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .year-selector-container {
            width: 100%;
          }

          .year-selector {
            width: 100%;
            max-width: 120px;
          }
        }

        @media (max-width: 480px) {
          .finance-dashboard {
            padding: 15px;
          }
          
          .dashboard-title {
            font-size: 1.5rem;
          }
          
          .finance-cards {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          
          .card-value {
            font-size: 1.4rem;
          }
        }
      `}</style>
    </div>
  );
};

export default FinanceDashboard;
