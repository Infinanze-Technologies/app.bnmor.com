import React, { useState } from 'react'
import { URL_GET_DASH_STATS,URL_GET_DASH_USERS,URL_GET_DASH_CUSTOMERS,URL_GET_DASH_COMPLAINTS,URL_GET_ALL_CAT_WITH_PRODUCT,URL_GET_DASH_ROLES, URL_GET_Qry_BRANCH, URL_GET_Announcement, URL_GET_BUSINESS_LOAN_SUMMARY } from '@/config/api-paths';
import useGetEntity from '@/hooks/useGetEntity';
import Stats from './components/Stats';
import DashAnnouncement from './components/DashAnnouncement';

import ColumnChart from './components/ColumnChart';
import PieChart from './components/PieChart';
import useSelectQuery from '@/hooks/ReactQuery/useSelectQuery';
import useFetchQuery from '@/hooks/ReactQuery/useFetchQuery';

const home = (props) => {

  let jwt = props?.session?.jwt;
  const [getBranch, setBranch] = useState('ALL');
  let filter = getBranch === 'ALL' ? '' : `?branch_id=${getBranch}`

  const StatsDataObject = useGetEntity({
    url: URL_GET_DASH_STATS,
    jwkToken: jwt
  })

  const BusinessLoanSummaryDataObject = useGetEntity({
    url: URL_GET_BUSINESS_LOAN_SUMMARY,
    jwkToken: jwt
  })

  const AnnouncementDataObject = useFetchQuery({
    url: URL_GET_Announcement,
    jwt: jwt,
    tableKey  : "Announcement",
    filter : filter
  })

  const QryBranchDataObject = useSelectQuery({
    url: URL_GET_Qry_BRANCH,
    jwt: jwt,
    tableKey  : "QryBranch",
    filter : ''
  });


  return (
    <div className="modern-dashboard">
      {/* Hero Section */}
      {/* <div className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="welcome-text">Welcome to</span>
              <span className="brand-text">ERP Suite</span>
            </h1>
            <p className="hero-subtitle">
              Your comprehensive business management solution
            </p>
            <div className="hero-stats">
              <div className="stat-badge">
                <i className="fas fa-chart-line"></i>
                <span>Real-time Analytics</span>
              </div>
              <div className="stat-badge">
                <i className="fas fa-shield-alt"></i>
                <span>Secure & Reliable</span>
              </div>
              <div className="stat-badge">
                <i className="fas fa-mobile-alt"></i>
                <span>Mobile Ready</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card">
              <i className="fas fa-rocket"></i>
            </div>
          </div>
        </div>
      </div> */}

      {/* Stats Section */}
      <div className="stats-section">
        <div className="section-header">
          <h2 className="section-title">
            <i className="fas fa-tachometer-alt"></i>
            Dashboard Overview
          </h2>
          <p className="section-subtitle">Key metrics and performance indicators</p>
        </div>
        <div className="stats-grid">
          <Stats StatsDataObject={StatsDataObject} BusinessLoanSummaryDataObject={BusinessLoanSummaryDataObject}/>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="section-header">
          <h2 className="section-title">
            <i className="fas fa-chart-bar"></i>
            Analytics & Insights
          </h2>
          {/* <p className="section-subtitle">Visual data representation and trends</p> */}
        </div>
        <div className="charts-grid">
          <div className="chart-card primary-chart">
            <div className="chart-header">
              <h3 className="chart-title">
                <i className="fas fa-chart-line"></i>
                Performance Analytics
              </h3>
              <div className="chart-actions">
                <button className="chart-btn">
                  <i className="fas fa-download"></i>
                </button>
                <button className="chart-btn">
                  <i className="fas fa-expand"></i>
                </button>
              </div>
            </div>
            <div className="chart-content">
              <ColumnChart QryBranchDataObject={QryBranchDataObject} jwt={jwt}/>
            </div>
          </div>
          
          <div className="chart-card secondary-chart">
            <div className="chart-header">
              <h3 className="chart-title">
                <i className="fas fa-chart-pie"></i>
               Loan Repayment Summary
              </h3>
              <div className="chart-actions">
                <button className="chart-btn">
                  <i className="fas fa-download"></i>
                </button>
                <button className="chart-btn">
                  <i className="fas fa-expand"></i>
                </button>
              </div>
            </div>
            <div className="chart-content">
              <PieChart QryBranchDataObject={QryBranchDataObject} jwt={jwt} BusinessLoanSummaryDataObject={BusinessLoanSummaryDataObject}/>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements Section */}
      {/* <div className="announcements-section">
        <div className="section-header">
          <h2 className="section-title">
            <i className="fas fa-bullhorn"></i>
            Announcements & Updates
          </h2>
          <p className="section-subtitle">Stay informed with the latest news</p>
        </div>
        <div className="announcements-container">
          <DashAnnouncement 
            AnnouncementDataObject={AnnouncementDataObject} 
            QryBranchDataObject={QryBranchDataObject} 
            jwt={jwt} 
            setBranch={setBranch}
          />
        </div>
      </div> */}

      <style jsx>{`
        .modern-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%);
          padding: 20px;
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
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
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

        .secondary-chart {
          border-left: 4px solid #28a745;
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
            grid-template-columns: 2fr 1fr;
            gap: 25px;
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
        }
      `}</style>
    </div>
  )
}

export default home
