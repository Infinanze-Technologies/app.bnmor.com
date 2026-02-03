import React, { useState } from 'react'
import { URL_GET_VISITOR_DASHBOARD_STATS, URL_GET_VISITOR_DASHBOARD_COMPREHENSIVE_ANALYTICS, URL_GET_ANNUAL_INCOME, URL_GET_HR_DASHBOARD_COMPREHENSIVE_ANALYTICS, URL_GET_FINANCE_DASHBOARD_COMPREHENSIVE_ANALYTICS } from '@/config/api-paths';
import OverviewDashboard from './components/OverviewDashboard';
import VisitorDashboard from './visitor-dashboard';
import HrDashboard from './components/HrDashboard';
import FinanceDashboard from './components/FinanceDashboard';
import useFetchQuery from '@/hooks/ReactQuery/useFetchQuery';

const home = (props) => {
let {session,role_name,role_status,role_is_super} = props;
  let jwt = props?.session?.jwt;
  const [getBranch, setBranch] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  // Set default dashboard based on role
  const getDefaultDashboard = () => {
    switch (role_name) {
      case 'Super Admin':
        return 'overview';
      case 'Receptionist':
        return 'visitor';
      case 'HR':
        return 'hr';
      case 'Finance':
        return 'finance';
      default:
        return 'overview';
    }
  };

  const [activeDashboard, setActiveDashboard] = useState(getDefaultDashboard());
  
  // Create filter for branch and year
  let filter = '';
  if (getBranch !== 'ALL') {
    filter += `?branch_id=${getBranch}`;
  }
  if (selectedYear) {
    filter += filter ? `&year=${selectedYear}` : `?year=${selectedYear}`;
  }

 

  const AnnualIncomeDataObject = useFetchQuery({
    url: URL_GET_ANNUAL_INCOME,
    jwt: jwt,
    tableKey  : "AnnualIncome",
    filter : filter
  })



  const HrComprehensiveAnalyticsDataObject = useFetchQuery({
    url: URL_GET_HR_DASHBOARD_COMPREHENSIVE_ANALYTICS,
    jwt: jwt,
    tableKey  : "HrComprehensiveAnalytics",
    filter : filter
  })

  const FinanceComprehensiveAnalyticsDataObject = useFetchQuery({
    url: URL_GET_FINANCE_DASHBOARD_COMPREHENSIVE_ANALYTICS,
    jwt: jwt,
    tableKey  : "FinanceComprehensiveAnalytics",
    filter : ''
  });



  // Fetch visitor dashboard stats
  const visitorStatsDataObject = useFetchQuery({
    url: URL_GET_VISITOR_DASHBOARD_STATS,
    jwt: jwt,
    tableKey  : "VisitorStats",
    filter : ''
  });

  // Fetch comprehensive analytics
  const comprehensiveAnalyticsDataObject = useFetchQuery({
    url: URL_GET_VISITOR_DASHBOARD_COMPREHENSIVE_ANALYTICS,
    jwt: jwt,
    tableKey  : "ComprehensiveAnalytics",
    filter : ''
  });



  // Dashboard navigation tabs based on role
  const getDashboardTabs = () => {
    const allTabs = [
      { id: 'overview', label: 'System Overview', icon: 'fas fa-chart-line' },
      { id: 'visitor', label: 'Visitor Management', icon: 'fas fa-users' },
      { id: 'hr', label: 'HR Management', icon: 'fas fa-user-tie' },
      { id: 'finance', label: 'Finance Management', icon: 'fas fa-money-bill-wave' }
    ];

    switch (role_name) {
      case 'Super Admin':
        return allTabs.filter(tab => ['overview', 'visitor'].includes(tab.id));
      case 'Receptionist':
        return allTabs.filter(tab => tab.id === 'visitor');
      case 'HR':
        return allTabs.filter(tab => tab.id === 'hr');
      case 'Finance':
        return allTabs.filter(tab => tab.id === 'finance');
      default:
        return allTabs.filter(tab => ['overview', 'visitor'].includes(tab.id));
    }
  };

  const dashboardTabs = getDashboardTabs();

  const renderDashboardContent = () => {
    switch (activeDashboard) {
  
      case 'overview':
        return (
          <div className="overview-dashboard-wrapper">
            <OverviewDashboard 
              visitorStatsData={visitorStatsDataObject} 
              comprehensiveAnalyticsData={comprehensiveAnalyticsDataObject} 
              AnnualIncomeDataObject={AnnualIncomeDataObject}
              HrComprehensiveAnalyticsDataObject={HrComprehensiveAnalyticsDataObject}
              FinanceComprehensiveAnalyticsDataObject={FinanceComprehensiveAnalyticsDataObject}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              jwt={jwt}
            />
          </div>
        );
      case 'visitor':
        return (
          <VisitorDashboard session={props?.session}
          visitorStatsData={visitorStatsDataObject} 
          />
        );
      case 'hr':
        return (
          <div className="hr-dashboard-wrapper">
            <HrDashboard 
              HrComprehensiveAnalyticsDataObject={HrComprehensiveAnalyticsDataObject}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
            />
          </div>
        );
      case 'finance':
        return (
          <div className="finance-dashboard-wrapper">
            <FinanceDashboard 
              FinanceComprehensiveAnalyticsDataObject={FinanceComprehensiveAnalyticsDataObject}
              comprehensiveAnalyticsData={comprehensiveAnalyticsDataObject}
              AnnualIncomeDataObject={AnnualIncomeDataObject}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
            />
          </div>
        );
      default:
        // Fallback to first available dashboard for the user's role
        const availableTabs = getDashboardTabs();
        if (availableTabs.length > 0) {
          setActiveDashboard(availableTabs[0].id);
          return renderDashboardContent();
        }
        return (
          <div className="access-denied">
            <div className="access-denied-content">
              <i className="fas fa-lock"></i>
              <h2>Access Denied</h2>
              <p>You don't have permission to access any dashboards.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="modern-dashboard">
      {/* Dashboard Navigation */}
      <div className="dashboard-navigation">
        <div className="nav-header">
          <h1 className="nav-title">
            <i className="fas fa-chart-line"></i>
            KLSM Suite Dashboard
          </h1>
          <p className="nav-subtitle">
            Comprehensive business management and analytics platform
          </p>
        </div>
        
        <div className="nav-tabs pb-3">
          {dashboardTabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${activeDashboard === tab.id ? 'active' : ''}`}
              onClick={() => setActiveDashboard(tab.id)}
            >
              <i className={tab.icon}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>


      {/* Dashboard Content */}
      <div className="dashboard-content">
        {renderDashboardContent()}
      </div>

      <style jsx>{`
        .modern-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%);
          padding: 20px;
        }

        /* Dashboard Navigation */
        .dashboard-navigation {
          background: linear-gradient(135deg, #4D4D4D 0%, #4347D9 100%);
          border-radius: 20px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 10px 40px rgba(95, 99, 242, 0.2);
          position: relative;
          overflow: hidden;
        }

        .dashboard-navigation::before {
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

        .nav-header {
          text-align: center;
          margin-bottom: 30px;
          position: relative;
          z-index: 2;
        }

        .nav-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0 0 10px 0;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
        }

        .nav-title i {
          font-size: 2rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .nav-subtitle {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.1rem;
          margin: 0;
          font-weight: 400;
        }

        .nav-tabs {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
          position: relative;
          z-index: 2;
        }

        .nav-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .nav-tab:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-2px);
        }

        .nav-tab.active {
          background: rgba(255, 255, 255, 0.2);
          border-color: #ffffff;
          box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
        }

        .nav-tab i {
          font-size: 1rem;
        }

        /* Filter Controls */
        .filter-controls {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 30px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .filter-section {
          display: flex;
          gap: 24px;
          align-items: end;
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 200px;
        }

        .filter-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #374151;
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
        }

        .filter-label i {
          color: #667eea;
          font-size: 0.8rem;
        }

        .filter-select {
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #374151;
          background: #ffffff;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .filter-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .filter-select:hover {
          border-color: #9ca3af;
        }

        .dashboard-content {
          min-height: 600px;
        }

        .main-dashboard,
        .overview-dashboard,
        .visitor-dashboard,
        .hr-dashboard,
        .finance-dashboard {
          animation: fadeIn 0.5s ease-in-out;
        }

        .overview-dashboard-wrapper,
        .hr-dashboard-wrapper,
        .finance-dashboard-wrapper {
          position: relative;
          min-height: 600px;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dashboard-hero {
          background: linear-gradient(135deg, #4D4D4D 0%, #4347D9 100%);
          border-radius: 20px;
          padding: 40px;
          margin-bottom: 30px;
          box-shadow: 0 10px 40px rgba(95, 99, 242, 0.2);
          position: relative;
          overflow: hidden;
        }

        .dashboard-hero::before {
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

        .hero-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 2;
        }

        .hero-text {
          flex: 1;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 800;
          margin: 0 0 10px 0;
          line-height: 1.2;
        }

        .welcome-text {
          display: block;
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.2rem;
          font-weight: 400;
          margin-bottom: 5px;
        }

        .brand-text {
          display: block;
          color: #ffffff;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .hero-subtitle {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.1rem;
          margin: 0 0 30px 0;
          font-weight: 400;
        }

        .hero-stats {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .stat-badge {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 25px;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #ffffff;
          font-weight: 500;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stat-badge i {
          font-size: 14px;
        }

        .hero-visual {
          position: relative;
        }

        .floating-card {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

         .section-header {
           text-align: left;
           margin-bottom: 30px;
         }

         .section-title {
           font-size: 2rem;
           font-weight: 700;
           color: #2c3e50;
           margin: 0 0 10px 0;
           display: flex;
           align-items: center;
           justify-content: flex-start;
           gap: 10px;
         }

        .section-title i {
          color: #4D4D4D;
          font-size: 1.5rem;
        }

        .section-subtitle {
          color: #6c757d;
          font-size: 1rem;
          margin: 0;
          font-weight: 400;
        }

        .stats-section {
          margin-bottom: 40px;
        }

         .stats-grid {
           display: grid;
           grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
           gap: 20px;
         }

        .charts-section {
          margin-bottom: 40px;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          max-width: 800px;
          margin: 0 auto;
        }

        .chart-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 25px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(95, 99, 242, 0.1);
          transition: all 0.3s ease;
        }

        .chart-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(95, 99, 242, 0.15);
        }

        .primary-chart {
          border-left: 4px solid #4D4D4D;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #f1f3f4;
        }

        .chart-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #2c3e50;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .chart-title i {
          color: #4D4D4D;
        }

        .chart-actions {
          display: flex;
          gap: 8px;
        }

        .chart-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: #f8f9fa;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6c757d;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 32px;
          min-height: 32px;
        }

        .chart-btn:hover {
          background: #4D4D4D;
          color: #ffffff;
          transform: scale(1.05);
        }

        .chart-content {
          min-height: 300px;
        }

        .announcements-section {
          margin-bottom: 40px;
        }

        .announcements-container {
          background: #ffffff;
          border-radius: 20px;
          padding: 25px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(95, 99, 242, 0.1);
        }

        .access-denied {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .access-denied-content {
          text-align: center;
          color: #6b7280;
        }

        .access-denied-content i {
          font-size: 4rem;
          color: #ef4444;
          margin-bottom: 20px;
        }

        .access-denied-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 10px 0;
        }

        .access-denied-content p {
          font-size: 1rem;
          margin: 0;
        }

        /* Large screens (1200px and up) */
        @media (min-width: 1200px) {
          .modern-dashboard {
            padding: 30px;
          }
          
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 25px;
          }
          
          .charts-grid {
            grid-template-columns: 1fr;
            gap: 25px;
            max-width: 1000px;
          }
          
          .chart-card {
            padding: 30px;
          }
        }

        /* Medium screens (992px to 1199px) */
        @media (max-width: 1199px) and (min-width: 992px) {
          .modern-dashboard {
            padding: 25px;
          }
          
          .stats-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }
          
          .charts-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .chart-card {
            padding: 25px;
          }
          
          .section-title {
            font-size: 1.8rem;
          }
        }

        /* Tablet screens (768px to 991px) */
        @media (max-width: 991px) and (min-width: 768px) {
          .modern-dashboard {
            padding: 20px;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 18px;
          }
          
          .charts-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }
          
          .chart-card {
            padding: 22px;
          }
          
          .section-title {
            font-size: 1.6rem;
          }
          
          .chart-title {
            font-size: 1.1rem;
          }
        }

        /* Mobile screens (576px to 767px) */
        @media (max-width: 767px) and (min-width: 576px) {
          .modern-dashboard {
            padding: 15px;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }
          
          .charts-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          
          .chart-card {
            padding: 20px;
          }
          
          .section-title {
            font-size: 1.4rem;
          }
          
          .chart-title {
            font-size: 1rem;
          }
          
          .chart-content {
            min-height: 250px;
          }
        }

        /* Small mobile screens (below 576px) */
        @media (max-width: 575px) {
          .modern-dashboard {
            padding: 12px;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          
          .charts-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          
          .chart-card {
            padding: 18px;
          }
          
          .section-title {
            font-size: 1.2rem;
          }
          
          .chart-title {
            font-size: 0.9rem;
          }
          
          .chart-content {
            min-height: 200px;
          }
          
          .chart-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .chart-actions {
            align-self: flex-end;
          }
          
          .chart-btn {
            width: 36px;
            height: 36px;
            min-width: 36px;
            min-height: 36px;
          }
        }

        /* Touch device improvements */
        @media (hover: none) and (pointer: coarse) {
          .chart-btn:hover {
            background: #f8f9fa;
            color: #6c757d;
            transform: none;
          }
          
          .chart-btn:active {
            background: #4D4D4D;
            color: #ffffff;
            transform: scale(0.95);
          }
          
          .chart-card:hover {
            transform: none;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
          }

          .nav-tab:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
            transform: none;
          }
          
          .nav-tab:active {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(0.98);
          }
        }

        /* Navigation Responsive Design */
        @media (max-width: 1200px) {
          .modern-dashboard {
            padding: 25px;
          }
          
          .dashboard-navigation {
            padding: 25px;
          }
          
          .nav-title {
            font-size: 2.2rem;
          }
        }

        @media (max-width: 768px) {
          .modern-dashboard {
            padding: 20px;
          }
          
          .dashboard-navigation {
            padding: 20px;
          }
          
          .nav-title {
            font-size: 1.8rem;
          }
          
          .nav-tabs {
            flex-direction: column;
            gap: 8px;
          }
          
          .nav-tab {
            justify-content: center;
            padding: 14px 20px;
          }
        }

        @media (max-width: 480px) {
          .modern-dashboard {
            padding: 15px;
          }
          
          .dashboard-navigation {
            padding: 18px;
          }
          
          .nav-title {
            font-size: 1.5rem;
          }
          
          .nav-subtitle {
            font-size: 1rem;
          }
          
          .nav-tab {
            padding: 12px 16px;
            font-size: 0.85rem;
          }
          
          .nav-tab i {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  )
}

export default home
