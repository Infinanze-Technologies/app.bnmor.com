import React from 'react';

const RecentActivity = ({ visitorStatsData }) => {
  if (!visitorStatsData || !visitorStatsData.recentActivity) {
    return (
      <div className="recent-activity-loading">
        <div className="loading-skeleton">
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
        </div>
      </div>
    );
  }

  const { recentActivity } = visitorStatsData;
  const { entries = [], appointments = [] } = recentActivity;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Available': 'success',
      'Unavailable': 'warning',
      'Checked-in': 'info',
      'Checked-out': 'secondary',
      'Scheduled': 'primary',
      'Completed': 'success',
      'Cancelled': 'danger'
    };
    return statusColors[status] || 'secondary';
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      'Available': 'fas fa-check-circle',
      'Unavailable': 'fas fa-times-circle',
      'Checked-in': 'fas fa-sign-in-alt',
      'Checked-out': 'fas fa-sign-out-alt',
      'Scheduled': 'fas fa-calendar-check',
      'Completed': 'fas fa-check-double',
      'Cancelled': 'fas fa-ban'
    };
    return statusIcons[status] || 'fas fa-circle';
  };

  return (
    <div className="recent-activity">
      <div className="activity-header">
        <h2 className="activity-title">
          <i className="fas fa-clock"></i>
          Recent Activity
        </h2>
        <p className="activity-subtitle">
          Latest visitor entries and appointments
        </p>
      </div>

      <div className="activity-grid">
        {/* Recent Entries */}
        <div className="activity-card entries-card">
          <div className="card-header">
            <h3 className="card-title">
              <i className="fas fa-sign-in-alt"></i>
              Recent Entries
            </h3>
            <div className="card-count">
              {entries.length} entries
            </div>
          </div>
          <div className="card-content">
            {entries.length > 0 ? (
              <div className="activity-list">
                {entries.slice(0, 5).map((entry, index) => (
                  <div key={entry.entry_id || index} className="activity-item">
                    <div className="activity-icon">
                      <i className={getStatusIcon(entry.status)}></i>
                    </div>
                    <div className="activity-details">
                      <div className="activity-main">
                        <span className="guest-name">{entry.guest?.full_name || 'Unknown Guest'}</span>
                        <span className={`status-badge ${getStatusColor(entry.status)}`}>
                          {entry.status}
                        </span>
                      </div>
                      <div className="activity-meta">
                        <span className="visit-type">{entry.visit_type}</span>
                        <span className="entry-type">{entry.entry_type}</span>
                        <span className="activity-time">{formatDate(entry.createdAt)}</span>
                      </div>
                      <div className="activity-contact">
                        <span className="contact-info">
                          <i className="fas fa-phone"></i>
                          {entry.guest?.phone || 'N/A'}
                        </span>
                        <span className="contact-info">
                          <i className="fas fa-envelope"></i>
                          {entry.guest?.email || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data-message">
                <i className="fas fa-sign-in-alt"></i>
                <p>No recent entries</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="activity-card appointments-card">
          <div className="card-header">
            <h3 className="card-title">
              <i className="fas fa-calendar-check"></i>
              Recent Appointments
            </h3>
            <div className="card-count">
              {appointments.length} appointments
            </div>
          </div>
          <div className="card-content">
            {appointments.length > 0 ? (
              <div className="activity-list">
                {appointments.slice(0, 5).map((appointment, index) => (
                  <div key={appointment.appointment_id || index} className="activity-item">
                    <div className="activity-icon">
                      <i className={getStatusIcon(appointment.status)}></i>
                    </div>
                    <div className="activity-details">
                      <div className="activity-main">
                        <span className="guest-name">{appointment.guest?.full_name || 'Unknown Guest'}</span>
                        <span className={`status-badge ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                      <div className="activity-meta">
                        <span className="scheduled-time">
                          <i className="fas fa-clock"></i>
                          {formatDate(appointment.scheduled_for)}
                        </span>
                        <span className="activity-time">{formatDate(appointment.createdAt)}</span>
                      </div>
                      <div className="activity-contact">
                        <span className="contact-info">
                          <i className="fas fa-phone"></i>
                          {appointment.guest?.phone || 'N/A'}
                        </span>
                        <span className="contact-info">
                          <i className="fas fa-envelope"></i>
                          {appointment.guest?.email || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data-message">
                <i className="fas fa-calendar-check"></i>
                <p>No recent appointments</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .recent-activity {
          margin-bottom: 40px;
        }

        .recent-activity-loading {
          margin-bottom: 40px;
        }

        .loading-skeleton {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .skeleton-card {
          background: #f8f9fa;
          border-radius: 16px;
          height: 400px;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .activity-header {
          text-align: left;
          margin-bottom: 30px;
        }

        .activity-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 10px 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .activity-title i {
          color: #667eea;
          font-size: 1.5rem;
        }

        .activity-subtitle {
          color: #6b7280;
          font-size: 1rem;
          margin: 0;
          font-weight: 400;
        }

        .activity-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
        }

        .activity-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .activity-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
        }

        .entries-card::before { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .appointments-card::before { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }

        .activity-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f1f3f4;
        }

        .card-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .card-title i {
          color: #667eea;
          font-size: 1rem;
        }

        .card-count {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .card-content {
          min-height: 300px;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .activity-item {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: #f8f9fa;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
        }

        .activity-item:hover {
          background: #f1f3f4;
          border-color: #d1d5db;
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: #ffffff;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          flex-shrink: 0;
        }

        .activity-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .activity-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .guest-name {
          font-weight: 600;
          color: #1f2937;
          font-size: 0.9rem;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-badge.success { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .status-badge.warning { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .status-badge.info { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .status-badge.secondary { background: rgba(107, 114, 128, 0.1); color: #6b7280; }
        .status-badge.primary { background: rgba(102, 126, 234, 0.1); color: #667eea; }
        .status-badge.danger { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        .activity-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .visit-type, .entry-type {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 2px 6px;
          border-radius: 8px;
          font-weight: 500;
        }

        .scheduled-time {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 500;
        }

        .activity-time {
          font-weight: 500;
        }

        .activity-contact {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .contact-info {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .contact-info i {
          font-size: 10px;
          color: #9ca3af;
        }

        .no-data-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
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
          .activity-grid {
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
          }
          
          .activity-card {
            padding: 20px;
          }
        }

        @media (max-width: 768px) {
          .activity-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }
          
          .activity-card {
            padding: 18px;
          }
          
          .card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          
          .activity-main {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          
          .activity-meta {
            flex-direction: column;
            gap: 4px;
          }
          
          .activity-contact {
            flex-direction: column;
            gap: 6px;
          }
        }

        @media (max-width: 480px) {
          .activity-title {
            font-size: 1.5rem;
          }
          
          .activity-card {
            padding: 16px;
          }
          
          .activity-item {
            padding: 12px;
          }
          
          .activity-icon {
            width: 32px;
            height: 32px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default RecentActivity;
