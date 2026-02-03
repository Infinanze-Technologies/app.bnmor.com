import React, { useState } from 'react';
import VisitorStats from './components/VisitorStats';
import RecentActivity from './components/RecentActivity';

const VisitorDashboard = (props) => {
  let jwt = props?.session?.jwt;
  const [activeTab, setActiveTab] = useState('overview');
  // Get the visitor stats data from props
  const visitorStatsDataObject = props?.visitorStatsData?.data || props?.visitorStatsData;
//   console.log('Visitor Stats Data:', visitorStatsDataObject);

 

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'fas fa-tachometer-alt' },
    // { id: 'visitor-analytics', label: 'Visitor Analytics', icon: 'fas fa-chart-bar' },
    { id: 'recent-activity', label: 'Recent Activity', icon: 'fas fa-clock' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="overview-tab">
            <VisitorStats visitorStatsData={visitorStatsDataObject} />
          </div>
        );
    //   case 'visitor-analytics':
    //     return (
    //       <div className="visitor-analytics-tab">
    //         <VisitorStats visitorStatsData={visitorStatsDataObject} />
    //       </div>
    //     );
      case 'recent-activity':
        return (
          <div className="recent-activity-tab">
            <RecentActivity visitorStatsData={visitorStatsDataObject} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="visitor-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="dashboard-title">
              <i className="fas fa-users"></i>
              Visitor Management Dashboard
            </h1>
            <p className="dashboard-subtitle">
              Comprehensive visitor tracking and analytics platform
            </p>
          </div>
          <div className="header-actions">
            <div className="status-indicators">
              <div className="status-item">
                <i className="fas fa-circle text-success"></i>
                <span>System Online</span>
              </div>
              <div className="status-item">
                <i className="fas fa-clock"></i>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <div className="tabs-container">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={tab.icon}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="dashboard-content">
        {renderTabContent()}
      </div>

      <style jsx>{`
        .visitor-dashboard {
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
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0 0 10px 0;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .dashboard-title i {
          font-size: 2rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .dashboard-subtitle {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.1rem;
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

        .dashboard-tabs {
          margin-bottom: 30px;
        }

        .tabs-container {
          display: flex;
          gap: 8px;
          background: #ffffff;
          padding: 8px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .tab-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border: none;
          background: transparent;
          border-radius: 12px;
          color: #6b7280;
          font-weight: 500;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .tab-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .tab-button:hover::before {
          opacity: 0.1;
        }

        .tab-button.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .tab-button.active::before {
          opacity: 0;
        }

        .tab-button i {
          font-size: 1rem;
        }

        .dashboard-content {
          min-height: 600px;
        }

        .overview-tab,
        .visitor-analytics-tab,
        .recent-activity-tab {
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .visitor-dashboard {
            padding: 25px;
          }
          
          .dashboard-header {
            padding: 25px;
          }
          
          .dashboard-title {
            font-size: 2.2rem;
          }
        }

        @media (max-width: 768px) {
          .visitor-dashboard {
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
          
          .status-indicators {
            flex-direction: column;
            gap: 10px;
            align-self: stretch;
          }
          
          .tabs-container {
            flex-direction: column;
            gap: 4px;
          }
          
          .tab-button {
            justify-content: center;
            padding: 14px 20px;
          }
        }

        @media (max-width: 480px) {
          .visitor-dashboard {
            padding: 15px;
          }
          
          .dashboard-header {
            padding: 18px;
          }
          
          .dashboard-title {
            font-size: 1.5rem;
          }
          
          .dashboard-subtitle {
            font-size: 1rem;
          }
          
          .tab-button {
            padding: 12px 16px;
            font-size: 0.85rem;
          }
          
          .tab-button i {
            font-size: 0.9rem;
          }
        }

        /* Touch device improvements */
        @media (hover: none) and (pointer: coarse) {
          .tab-button:hover::before {
            opacity: 0;
          }
          
          .tab-button:active {
            transform: scale(0.98);
          }
        }
      `}</style>
    </div>
  );
};

export default VisitorDashboard;
