import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const VisitorStats = ({ visitorStatsData }) => {
  if (!visitorStatsData) {
    return (
      <div className="visitor-stats-loading">
        <div className="loading-skeleton">
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
        </div>
      </div>
    );
  }
  const visitorStatsDataObject = visitorStatsData?.data || visitorStatsData;
  const { overview, today, active, filteredStats } = visitorStatsData;

  const statsCards = [
    {
      title: 'Total Guests',
      value: overview?.totalGuests || 0,
      icon: 'fas fa-users',
      color: 'primary',
      trend: '+12%',
      trendDirection: 'up'
    },
    {
      title: 'Total Appointments',
      value: overview?.totalAppointments || 0,
      icon: 'fas fa-calendar-check',
      color: 'success',
      trend: '+8%',
      trendDirection: 'up'
    },
    {
      title: 'Total Entries',
      value: overview?.totalEntries || 0,
      icon: 'fas fa-sign-in-alt',
      color: 'info',
      trend: '+15%',
      trendDirection: 'up'
    },
    {
      title: 'Pre-registrations',
      value: overview?.totalPreRegistrations || 0,
      icon: 'fas fa-clipboard-list',
      color: 'warning',
      trend: '+5%',
      trendDirection: 'up'
    },
    {
      title: "Today's Entries",
      value: today?.entries || 0,
      icon: 'fas fa-calendar-day',
      color: 'secondary',
      trend: '+3%',
      trendDirection: 'up'
    },
    {
      title: "Today's Appointments",
      value: today?.appointments || 0,
      icon: 'fas fa-clock',
      color: 'dark',
      trend: '+7%',
      trendDirection: 'up'
    },
    {
      title: 'Pending Appointments',
      value: active?.pendingAppointments || 0,
      icon: 'fas fa-hourglass-half',
      color: 'warning',
      trend: '-2%',
      trendDirection: 'down'
    },
    {
      title: 'Checked-in Entries',
      value: active?.checkedInEntries || 0,
      icon: 'fas fa-check-circle',
      color: 'success',
      trend: '+10%',
      trendDirection: 'up'
    },
    {
      title: 'Checked-out Entries',
      value: active?.checkedOutEntries || 0,
      icon: 'fas fa-sign-out-alt',
      color: 'info',
      trend: '+5%',
      trendDirection: 'up'
    },
    {
      title: 'Filtered Entries',
      value: filteredStats?.entries || 0,
      icon: 'fas fa-filter',
      color: 'primary',
      trend: '+12%',
      trendDirection: 'up'
    },
    {
      title: 'Filtered Appointments',
      value: filteredStats?.appointments || 0,
      icon: 'fas fa-calendar-alt',
      color: 'warning',
      trend: '+8%',
      trendDirection: 'up'
    }
  ];

  return (
    <div className="visitor-stats-container">
      <div className="stats-grid">
        {statsCards.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`}>
            <div className="stat-card-header">
              <div className="stat-icon">
                <i className={stat.icon}></i>
              </div>
              <div className="stat-trend">
                <span className={`trend-indicator ${stat.trendDirection}`}>
                  <i className={`fas fa-arrow-${stat.trendDirection === 'up' ? 'up' : 'down'}`}></i>
                  {stat.trend}
                </span>
              </div>
            </div>
            <div className="stat-card-body">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-title">{stat.title}</div>
            </div>
          </div>
          
        ))}
      </div>

      {/* Analytics Section */}
      <div className="visitor-analytics mt-4">
        {/* <div className="analytics-header">
          <h2 className="analytics-title">
            <i className="fas fa-chart-bar"></i>
            Visitor Analytics
          </h2>
          <p className="analytics-subtitle">
            Comprehensive visitor management insights and trends
          </p>
        </div> */}


        <div className="analytics-grid">
          {/* Entry Status - Pie Chart */}
          <div className="chart-card status-chart">
            <div className="chart-header">
              <h3 className="chart-title">
                <i className="fas fa-chart-pie"></i>
                Entry Status
              </h3>
              <div className="chart-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Entries</span>
                  <span className="stat-value">{(() => {
                    const { statusBreakdown } = visitorStatsDataObject || {};
                    if (statusBreakdown?.entries) {
                      return statusBreakdown.entries.reduce((total, status) => total + parseInt(status.count), 0);
                    }
                    return 0;
                  })()}</span>
                </div>
              </div>
            </div>
            <div className="chart-content">
              {(() => {
                const { statusBreakdown } = visitorStatsDataObject || {};
                const statusPieSeries = [];
                const statusPieLabels = [];
                
                if (statusBreakdown?.entries) {
                  statusBreakdown.entries.forEach(status => {
                    statusPieLabels.push(status.status);
                    statusPieSeries.push(parseInt(status.count));
                  });
                }

                const statusPieOptions = {
                  chart: {
                    type: 'pie',
                    height: 350,
                    toolbar: { show: true },
                    animations: { enabled: true, easing: 'easeinout', speed: 800 }
                  },
                  colors: ['#667eea', '#764ba2', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'],
                  labels: statusPieLabels,
                  legend: {
                    position: 'bottom',
                    fontSize: '14px',
                    fontWeight: 500,
                    labels: { colors: '#6b7280' }
                  },
                  title: {
                    text: 'Entry Status Breakdown',
                    align: 'left',
                    style: { fontSize: '18px', fontWeight: 600, color: '#1f2937' }
                  },
                  subtitle: {
                    text: 'Distribution of entry statuses',
                    align: 'left',
                    style: { fontSize: '14px', color: '#6b7280' }
                  },
                  dataLabels: {
                    enabled: true,
                    style: { fontSize: '12px', fontWeight: 600 },
                    formatter: function (val, opts) {
                      return opts.w.config.series[opts.seriesIndex] + ': ' + val.toFixed(1) + '%';
                    }
                  },
                  tooltip: {
                    theme: 'light',
                    y: { formatter: function (val) { return val + ' entries'; } }
                  }
                };

                return statusPieSeries && statusPieSeries.length > 0 ? (
                  <Chart
                    options={statusPieOptions}
                    series={statusPieSeries}
                    type="pie"
                    height={350}
                  />
                ) : (
                  <div className="no-data-message">
                    <i className="fas fa-chart-pie"></i>
                    <p>No entry status data available</p>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Appointment Status - Donut Chart */}
          <div className="chart-card appointment-chart">
            <div className="chart-header">
              <h3 className="chart-title">
                <i className="fas fa-calendar-check"></i>
                Appointments
              </h3>
              <div className="chart-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Appointments</span>
                  <span className="stat-value">{(() => {
                    const { statusBreakdown } = visitorStatsDataObject || {};
                    if (statusBreakdown?.appointments) {
                      return statusBreakdown.appointments.reduce((total, status) => total + parseInt(status.count), 0);
                    }
                    return 0;
                  })()}</span>
                </div>
              </div>
            </div>
            <div className="chart-content">
              {(() => {
                const { statusBreakdown } = visitorStatsDataObject || {};
                const appointmentDonutSeries = [];
                const appointmentDonutLabels = [];
                
                if (statusBreakdown?.appointments) {
                  statusBreakdown.appointments.forEach(status => {
                    appointmentDonutLabels.push(status.status);
                    appointmentDonutSeries.push(parseInt(status.count));
                  });
                }

                const appointmentDonutOptions = {
                  chart: {
                    type: 'donut',
                    height: 350,
                    toolbar: { show: true },
                    animations: { enabled: true, easing: 'easeinout', speed: 800 }
                  },
                  colors: ['#fa709a', '#fee140', '#4facfe', '#00f2fe'],
                  labels: appointmentDonutLabels,
                  legend: {
                    position: 'bottom',
                    fontSize: '14px',
                    fontWeight: 500,
                    labels: { colors: '#6b7280' }
                  },
                  title: {
                    text: 'Appointment Status',
                    align: 'left',
                    style: { fontSize: '18px', fontWeight: 600, color: '#1f2937' }
                  },
                  subtitle: {
                    text: 'Distribution of appointment statuses',
                    align: 'left',
                    style: { fontSize: '14px', color: '#6b7280' }
                  },
                  dataLabels: {
                    enabled: true,
                    style: { fontSize: '12px', fontWeight: 600 },
                    formatter: function (val, opts) {
                      return opts.w.config.series[opts.seriesIndex] + ': ' + val.toFixed(1) + '%';
                    }
                  },
                  tooltip: {
                    theme: 'light',
                    y: { formatter: function (val) { return val + ' appointments'; } }
                  },
                  plotOptions: {
                    pie: {
                      donut: {
                        size: '60%',
                        labels: {
                          show: true,
                          total: {
                            show: true,
                            label: 'Total',
                            formatter: function (w) {
                              return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                            }
                          }
                        }
                      }
                    }
                  }
                };

                return appointmentDonutSeries && appointmentDonutSeries.length > 0 ? (
                  <Chart
                    options={appointmentDonutOptions}
                    series={appointmentDonutSeries}
                    type="donut"
                    height={350}
                  />
                ) : (
                  <div className="no-data-message">
                    <i className="fas fa-calendar-check"></i>
                    <p>No appointment data available</p>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Daily Trends - Line Chart */}
          <div className="chart-card trends-chart">
            <div className="chart-header">
              <h3 className="chart-title">
                <i className="fas fa-chart-line"></i>
                Daily Trends
              </h3>
              <div className="chart-stats">
                <div className="stat-item">
                  <span className="stat-label">Peak Day</span>
                  <span className="stat-value">{(() => {
                    const { trends } = visitorStatsDataObject || {};
                    if (trends?.daily) {
                      return Math.max(...trends.daily.map(day => parseInt(day.count)));
                    }
                    return 0;
                  })()}</span>
                </div>
              </div>
            </div>
            <div className="chart-content">
              {(() => {
                const { trends } = visitorStatsDataObject || {};
                const dailyTrendsSeries = [];
                const dailyTrendsCategories = [];
                
                if (trends?.daily) {
                  trends.daily.forEach(day => {
                    dailyTrendsCategories.push(new Date(day.date).toLocaleDateString());
                    dailyTrendsSeries.push(parseInt(day.count));
                  });
                }

                const dailyTrendsOptions = {
                  chart: {
                    type: 'line',
                    height: 350,
                    toolbar: { show: true },
                    animations: { enabled: true, easing: 'easeinout', speed: 800 }
                  },
                  colors: ['#43e97b', '#38f9d7'],
                  stroke: { curve: 'smooth', width: 3 },
                  markers: { size: 6, hover: { size: 8 } },
                  xaxis: {
                    categories: dailyTrendsCategories,
                    title: {
                      text: 'Dates',
                      style: { color: '#6b7280', fontSize: '14px', fontWeight: 600 }
                    },
                    labels: { style: { colors: '#6b7280', fontSize: '12px' } }
                  },
                  yaxis: {
                    title: {
                      text: 'Count',
                      style: { color: '#6b7280', fontSize: '14px', fontWeight: 600 }
                    },
                    labels: { style: { colors: '#6b7280', fontSize: '12px' } }
                  },
                  title: {
                    text: 'Daily Visitor Trends',
                    align: 'left',
                    style: { fontSize: '18px', fontWeight: 600, color: '#1f2937' }
                  },
                  subtitle: {
                    text: 'Daily visitor activity over time',
                    align: 'left',
                    style: { fontSize: '14px', color: '#6b7280' }
                  },
                  legend: {
                    position: 'top',
                    horizontalAlign: 'right',
                    fontSize: '14px',
                    fontWeight: 500
                  },
                  grid: { borderColor: '#e5e7eb', strokeDashArray: 4 },
                  tooltip: {
                    theme: 'light',
                    y: { formatter: function (val) { return val + ' visitors'; } }
                  }
                };

                return dailyTrendsSeries && dailyTrendsSeries.length > 0 ? (
                  <Chart
                    options={dailyTrendsOptions}
                    series={[{ name: 'Daily Visitors', data: dailyTrendsSeries }]}
                    type="line"
                    height={350}
                  />
                ) : (
                  <div className="no-data-message">
                    <i className="fas fa-chart-line"></i>
                    <p>No daily trends data available</p>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Departments - Horizontal Bar Chart */}
          <div className="chart-card departments-chart">
            <div className="chart-header">
              <h3 className="chart-title">
                <i className="fas fa-building"></i>
                Departments
              </h3>
              <div className="chart-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Departments</span>
                  <span className="stat-value">{(() => {
                    const { analytics } = visitorStatsDataObject || {};
                    if (analytics?.departments) {
                      return analytics.departments.reduce((total, dept) => total + parseInt(dept.count), 0);
                    }
                    return 0;
                  })()}</span>
                </div>
              </div>
            </div>
            <div className="chart-content">
              {(() => {
                const { analytics } = visitorStatsDataObject || {};
                const departmentsSeries = [];
                const departmentsCategories = [];
                
                if (analytics?.departments) {
                  analytics.departments.forEach(dept => {
                    departmentsCategories.push(dept.department_name);
                    departmentsSeries.push(parseInt(dept.count));
                  });
                }

                const departmentsOptions = {
                  chart: {
                    type: 'bar',
                    height: 350,
                    toolbar: { show: true },
                    animations: { enabled: true, easing: 'easeinout', speed: 800 }
                  },
                  colors: ['#667eea', '#764ba2', '#4facfe', '#00f2fe'],
                  plotOptions: {
                    bar: {
                      horizontal: true,
                      borderRadius: 8,
                      borderRadiusApplication: 'end',
                      borderRadiusWhenStacked: 'last'
                    }
                  },
                  dataLabels: {
                    enabled: true,
                    style: { fontSize: '12px', fontWeight: 600, colors: ['#ffffff'] }
                  },
                  xaxis: {
                    categories: departmentsCategories,
                    title: {
                      text: 'Count',
                      style: { color: '#6b7280', fontSize: '14px', fontWeight: 600 }
                    },
                    labels: { style: { colors: '#6b7280', fontSize: '12px' } }
                  },
                  yaxis: {
                    title: {
                      text: 'Departments',
                      style: { color: '#6b7280', fontSize: '14px', fontWeight: 600 }
                    },
                    labels: { style: { colors: '#6b7280', fontSize: '12px' } }
                  },
                  title: {
                    text: 'Department Distribution',
                    align: 'left',
                    style: { fontSize: '18px', fontWeight: 600, color: '#1f2937' }
                  },
                  subtitle: {
                    text: 'Visitor distribution by department',
                    align: 'left',
                    style: { fontSize: '14px', color: '#6b7280' }
                  },
                  legend: {
                    position: 'top',
                    horizontalAlign: 'right',
                    fontSize: '14px',
                    fontWeight: 500
                  },
                  grid: { borderColor: '#e5e7eb', strokeDashArray: 4 },
                  tooltip: {
                    theme: 'light',
                    y: { formatter: function (val) { return val + ' visitors'; } }
                  }
                };

                return departmentsSeries && departmentsSeries.length > 0 ? (
                  <Chart
                    options={departmentsOptions}
                    series={[{ name: 'Visitors', data: departmentsSeries }]}
                    type="bar"
                    height={350}
                  />
                ) : (
                  <div className="no-data-message">
                    <i className="fas fa-building"></i>
                    <p>No department data available</p>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Guest Types - Donut Chart */}
          <div className="chart-card guest-types-chart">
            <div className="chart-header">
              <h3 className="chart-title">
                <i className="fas fa-users"></i>
                Guest Types
              </h3>
              <div className="chart-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Guests</span>
                  <span className="stat-value">{(() => {
                    const { analytics } = visitorStatsDataObject || {};
                    if (analytics?.guestTypes) {
                      return analytics.guestTypes.reduce((total, guestType) => total + parseInt(guestType.count), 0);
                    }
                    return 0;
                  })()}</span>
                </div>
              </div>
            </div>
            <div className="chart-content">
              {(() => {
                const { analytics } = visitorStatsDataObject || {};
                const guestTypesSeries = [];
                const guestTypesLabels = [];
                
                if (analytics?.guestTypes) {
                  analytics.guestTypes.forEach(guestType => {
                    guestTypesLabels.push(guestType.type);
                    guestTypesSeries.push(parseInt(guestType.count));
                  });
                }

                const guestTypesOptions = {
                  chart: {
                    type: 'donut',
                    height: 350,
                    toolbar: { show: true },
                    animations: { enabled: true, easing: 'easeinout', speed: 800 }
                  },
                  colors: ['#43e97b', '#38f9d7', '#4facfe', '#00f2fe'],
                  labels: guestTypesLabels,
                  legend: {
                    position: 'bottom',
                    fontSize: '14px',
                    fontWeight: 500,
                    labels: { colors: '#6b7280' }
                  },
                  title: {
                    text: 'Guest Types',
                    align: 'left',
                    style: { fontSize: '18px', fontWeight: 600, color: '#1f2937' }
                  },
                  subtitle: {
                    text: 'Distribution of guest types',
                    align: 'left',
                    style: { fontSize: '14px', color: '#6b7280' }
                  },
                  dataLabels: {
                    enabled: true,
                    style: { fontSize: '12px', fontWeight: 600 },
                    formatter: function (val, opts) {
                      return opts.w.config.series[opts.seriesIndex] + ': ' + val.toFixed(1) + '%';
                    }
                  },
                  tooltip: {
                    theme: 'light',
                    y: { formatter: function (val) { return val + ' guests'; } }
                  },
                  plotOptions: {
                    pie: {
                      donut: {
                        size: '60%',
                        labels: {
                          show: true,
                          total: {
                            show: true,
                            label: 'Total',
                            formatter: function (w) {
                              return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                            }
                          }
                        }
                      }
                    }
                  }
                };

                return guestTypesSeries && guestTypesSeries.length > 0 ? (
                  <Chart
                    options={guestTypesOptions}
                    series={guestTypesSeries}
                    type="donut"
                    height={350}
                  />
                ) : (
                  <div className="no-data-message">
                    <i className="fas fa-users"></i>
                    <p>No guest type data available</p>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .visitor-stats-container {
          margin-bottom: 30px;
        }

        .visitor-stats-loading {
          margin-bottom: 30px;
        }

        .loading-skeleton {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .skeleton-card {
          background: #f8f9fa;
          border-radius: 12px;
          height: 120px;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--card-color);
        }

        .stat-card.primary::before { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .stat-card.success::before { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
        .stat-card.info::before { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
        .stat-card.warning::before { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
        .stat-card.secondary::before { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); }
        .stat-card.dark::before { background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .stat-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: #ffffff;
          background: var(--card-color);
        }

        .stat-card.primary .stat-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .stat-card.success .stat-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
        .stat-card.info .stat-icon { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
        .stat-card.warning .stat-icon { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
        .stat-card.secondary .stat-icon { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); }
        .stat-card.dark .stat-icon { background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); }

        .stat-trend {
          display: flex;
          align-items: center;
        }

        .trend-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 20px;
        }

        .trend-indicator.up {
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }

        .trend-indicator.down {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        .stat-card-body {
          text-align: left;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
          line-height: 1;
        }

        .stat-title {
          font-size: 0.9rem;
          color: #6b7280;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 18px;
          }
          
          .stat-card {
            padding: 20px;
          }
          
          .stat-value {
            font-size: 2.2rem;
          }
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
          }
          
          .stat-card {
            padding: 18px;
          }
          
          .stat-value {
            font-size: 2rem;
          }
          
          .stat-icon {
            width: 40px;
            height: 40px;
            font-size: 18px;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          
          .stat-card {
            padding: 16px;
          }
          
          .stat-value {
            font-size: 1.8rem;
          }
          
          .stat-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .stat-trend {
            align-self: flex-end;
          }
        }

        /* Analytics Styles */
        .visitor-analytics {
          margin-bottom: 40px;
        }

        .visitor-analytics-loading {
          margin-bottom: 40px;
        }

        .loading-skeleton {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .skeleton-chart {
          background: #f8f9fa;
          border-radius: 16px;
          height: 400px;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .analytics-header {
          text-align: left;
          margin-bottom: 30px;
        }

        .analytics-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 10px 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .analytics-title i {
          color: #667eea;
          font-size: 1.5rem;
        }

        .analytics-subtitle {
          color: #6b7280;
          font-size: 1rem;
          margin: 0;
          font-weight: 400;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
        }

        .chart-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .chart-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
        }

        .status-chart::before { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .appointment-chart::before { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
        .visit-types-chart::before { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
        .trends-chart::before { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
        .departments-chart::before { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); }
        .guest-types-chart::before { background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); }

        .chart-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f1f3f4;
        }

        .chart-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .chart-title i {
          color: #667eea;
          font-size: 1rem;
        }

        .chart-stats {
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: right;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
        }

        .chart-content {
          min-height: 350px;
        }

        .no-data-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 350px;
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

        /* Responsive Design for Analytics */
        @media (max-width: 1200px) {
          .analytics-grid {
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
          }
          
          .chart-card {
            padding: 20px;
          }
        }

        @media (max-width: 768px) {
          .analytics-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }
          
          .chart-card {
            padding: 18px;
          }
          
          .chart-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          
          .chart-stats {
            flex-direction: row;
            gap: 16px;
            align-self: flex-end;
          }
          
          .stat-item {
            align-items: flex-start;
          }
        }

        @media (max-width: 480px) {
          .analytics-title {
            font-size: 1.5rem;
          }
          
          .chart-card {
            padding: 16px;
          }
          
          .chart-content {
            min-height: 300px;
          }
          
          .chart-stats {
            flex-direction: column;
            gap: 8px;
            align-self: stretch;
          }
          
          .stat-item {
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default VisitorStats;
