import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const HrDashboard = ({ HrComprehensiveAnalyticsDataObject, selectedYear, setSelectedYear }) => {
  
  let hrComprehensiveAnalyticsData = HrComprehensiveAnalyticsDataObject?.data

  const [timeRange, setTimeRange] = useState('7d');

  // Professional number formatting function following accounting standards
  const formatNumber = (num, isCurrency = false, showDecimals = true) => {
    if (num === null || num === undefined || isNaN(num)) return isCurrency ? '₵0.00' : '0';
    
    const absNum = Math.abs(num);
    const isNegative = num < 0;
    const currency = isCurrency ? '₵' : '';
    
    // For very large numbers, use abbreviated format
    if (absNum >= 1e9) {
      const formatted = (absNum / 1e9).toFixed(1);
      return `${currency}${isNegative ? '-' : ''}${formatted}B`;
    } else if (absNum >= 1e6) {
      const formatted = (absNum / 1e6).toFixed(1);
      return `${currency}${isNegative ? '-' : ''}${formatted}M`;
    } else if (absNum >= 1e3) {
      const formatted = (absNum / 1e3).toFixed(1);
      return `${currency}${isNegative ? '-' : ''}${formatted}K`;
    } else {
      // For smaller numbers, use proper formatting
      if (isCurrency) {
        return `${currency}${num.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`;
      } else {
        return num.toLocaleString('en-US', {
          minimumFractionDigits: showDecimals ? 0 : 0,
          maximumFractionDigits: showDecimals ? 1 : 0
        });
      }
    }
  };

  // Generate year options (current year and 5 years back)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);

  // Add error boundary and data validation
  if (!hrComprehensiveAnalyticsData) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading HR dashboard data...</p>
        </div>
      </div>
    );
  }

  // HR metrics cards
  const hrCards = [
    {
      title: 'Total Employees',
      value: formatNumber(hrComprehensiveAnalyticsData?.employeeMetrics?.totalEmployees || 0),
      icon: 'fas fa-users',
      color: 'primary',
      trend: '+12%',
      trendDirection: 'up'
    },
    {
      title: 'Active Employees',
      value: formatNumber(hrComprehensiveAnalyticsData?.employeeMetrics?.activeEmployees || 0),
      icon: 'fas fa-user-check',
      color: 'success',
      trend: '+8%',
      trendDirection: 'up'
    },
    {
      title: 'New Hires',
      value: formatNumber(hrComprehensiveAnalyticsData?.employeeMetrics?.newHires || 0),
      icon: 'fas fa-user-plus',
      color: 'success',
      trend: '+15%',
      trendDirection: 'up'
    },
    {
      title: 'Resignations',
      value: formatNumber(hrComprehensiveAnalyticsData?.employeeMetrics?.resignations || 0),
      icon: 'fas fa-user-minus',
      color: 'warning',
      trend: '+5%',
      trendDirection: 'up'
    },
    {
      title: 'Total Awards',
      value: formatNumber(hrComprehensiveAnalyticsData?.performanceMetrics?.totalAwards || 0),
      icon: 'fas fa-trophy',
      color: 'warning',
      trend: '+20%',
      trendDirection: 'up'
    },
    {
      title: 'Leave Requests',
      value: formatNumber(hrComprehensiveAnalyticsData?.leaveMetrics?.totalLeaveRequests || 0),
      icon: 'fas fa-calendar-times',
      color: 'info',
      trend: '+5%',
      trendDirection: 'up'
    },
    {
      title: 'Approved Leaves',
      value: formatNumber(hrComprehensiveAnalyticsData?.leaveMetrics?.approvedLeaves || 0),
      icon: 'fas fa-calendar-check',
      color: 'success',
      trend: '+8%',
      trendDirection: 'up'
    },
    {
      title: 'Overtime Hours',
      value: formatNumber(hrComprehensiveAnalyticsData?.attendanceMetrics?.overtimeHours || 0),
      icon: 'fas fa-clock',
      color: 'primary',
      trend: '+8%',
      trendDirection: 'up'
    },
    {
      title: 'Late Arrivals',
      value: formatNumber(hrComprehensiveAnalyticsData?.attendanceMetrics?.lateArrivals || 0),
      icon: 'fas fa-exclamation-triangle',
      color: 'warning',
      trend: '+3%',
      trendDirection: 'up'
    }
  ];

  // HR Analytics chart data
  const hrChartData = {
    series: [{
      name: 'HR Analytics',
      data: hrComprehensiveAnalyticsData?.trendData?.series || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }],
    categories: hrComprehensiveAnalyticsData?.trendData?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  };

  // HR Analytics chart options
  const hrTrendsOptions = {
    chart: {
      type: 'area',
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
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: ['#764ba2'],
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: hrChartData.categories,
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Employee Count',
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
      text: 'HR Analytics Trends',
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

  return (
    <div className="hr-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="dashboard-title">
              <i className="fas fa-users"></i>
              HR Management Dashboard
            </h1>
            <p className="dashboard-subtitle">
              Human resources analytics and employee management insights
            </p>
          </div>
          <div className="header-actions">
            <div className="status-indicators">
              <div className="status-item">
                <i className="fas fa-circle text-success"></i>
                <span>HR System Online</span>
              </div>
              <div className="status-item">
                <i className="fas fa-clock"></i>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HR Cards */}
      <div className="hr-cards">
        {hrCards.map((card, index) => (
          <div key={index} className={`hr-card ${card.color}`}>
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

      {/* HR Analytics Chart */}
      <div className="charts-section">
        <div className="chart-container">
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">
                <i className="fas fa-chart-area"></i>
                HR Analytics Trends
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
              {hrChartData.series && hrChartData.series.length > 0 ? (
                <Chart
                  options={hrTrendsOptions}
                  series={hrChartData.series}
                  type="area"
                  height={400}
                />
              ) : (
                <div className="no-data-message">
                  <i className="fas fa-chart-area"></i>
                  <p>No HR analytics data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hr-dashboard {
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

        .hr-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .hr-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .hr-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
        }

        .hr-card.primary::before { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .hr-card.success::before { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
        .hr-card.warning::before { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
        .hr-card.info::before { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }

        .hr-card:hover {
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

        .hr-card.primary .card-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .hr-card.success .card-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
        .hr-card.warning .card-icon { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
        .hr-card.info .card-icon { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }

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

        .chart-container {
          background: #ffffff;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
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
        @media (max-width: 768px) {
          .hr-dashboard {
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
          
          .hr-cards {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
          }
          
          .card-value {
            font-size: 1.6rem;
          }
        }

        @media (max-width: 480px) {
          .hr-dashboard {
            padding: 15px;
          }
          
          .dashboard-title {
            font-size: 1.5rem;
          }
          
          .hr-cards {
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

export default HrDashboard;
