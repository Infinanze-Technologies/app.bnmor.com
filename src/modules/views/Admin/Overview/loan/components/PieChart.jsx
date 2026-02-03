import React, { useState, useEffect }  from 'react'
import dynamic from 'next/dynamic'
import { Suspense } from 'react';
import { Select } from 'antd';
import { URL_GET_INITIAL_INCOME } from '@/config/api-paths';
import {Spin,Skeleton} from "antd";
import axios from "axios";
import { getApiUrl } from "@/config/getApiUrl";
import { formatCurrency, formatChartNumber } from '@/utility/numberFormatter';
const Chart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
  });

function PieChart(props) {
  let {QryBranchDataObject,jwt, BusinessLoanSummaryDataObject} = props
  let qryBranchData = QryBranchDataObject?.data
  let BusinessLoanSummaryData = BusinessLoanSummaryDataObject?.data?.data?.globalSummary?.repayment_summary

  let api_url = getApiUrl();
  const [dataz, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [getTime, setGetTime] = useState(true);
  
  const handleProPerformance = () => {
    try {
      setIsLoading(true);
  
      
      // Get all repayment status values from BusinessLoanSummaryData
      const repaymentData = {
        pending: BusinessLoanSummaryData?.repayment_pending || 0,
        confirmed: BusinessLoanSummaryData?.repayment_confirmed || 0,
        failed: BusinessLoanSummaryData?.repayment_failed || 0,
        reversed: BusinessLoanSummaryData?.repayment_reversed || 0
      };
      
      // If no data is available, use sample data for testing
      if (!BusinessLoanSummaryData) {
        const sampleData = {
          pending: 0,
          confirmed: 5205,
          failed: 0,
          reversed: 0
        };
        console.log('Using sample data:', sampleData);
        setData(sampleData);
      } else {
        console.log('Repayment Data:', repaymentData);
        setData(repaymentData);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.log('Error in handleProPerformance:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => setGetTime(false), 5000);
  }, [dataz]);

  useEffect(() => {
    // Run immediately to show sample data or real data
    handleProPerformance();
  }, [BusinessLoanSummaryData]);

  const options = {
    colors: ['#28a745', '#4D4D4D', '#ffc107', '#dc3545', '#17a2b8'],
    chart: {
      height: 320,
      type: 'donut',
      background: 'transparent',
      fontFamily: 'Inter, sans-serif',
    },
    labels: ['Pending', 'Confirmed', 'Failed', 'Reversed'],
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return opts.w.globals.seriesTotals.reduce((a, b) => a + b, 0) > 0 
          ? formatChartNumber((opts.w.globals.seriesTotals.reduce((a, b) => a + b, 0) * val) / 100, 1)
          : '0';
      },
      style: {
        fontSize: '14px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 600,
        colors: ['#ffffff']
      },
      dropShadow: {
        enabled: true,
        opacity: 0.3,
        blur: 3,
        left: 1,
        top: 1
      }
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '14px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
      labels: {
        colors: '#2c3e50'
      },
      markers: {
        width: 12,
        height: 12,
        radius: 6
      },
      itemMargin: {
        horizontal: 15,
        vertical: 8
      },
      offsetY: -15
    },
    plotOptions: {
      pie: {
        customScale: 0.8,
        donut: {
          size: '60%',
          background: 'transparent',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '18px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              color: '#2c3e50',
              offsetY: -15
            },
            value: {
              show: true,
              fontSize: '26px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              color: '#4D4D4D',
              offsetY: 15,
              formatter: function (val) {
                return formatCurrency(val, 'GHC ', 1);
              }
            },
            total: {
              show: true,
              label: 'Total Balance',
              fontSize: '16px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              color: '#6c757d',
              formatter: function (w) {
                return formatCurrency(w.globals.seriesTotals.reduce((a, b) => a + b, 0), 'GHC ', 1);
              }
            }
          }
        },
        offsetY: 0,
      },
    },
    stroke: {
      width: 2,
      colors: ['#ffffff']
    },
    tooltip: {
      enabled: true,
      theme: 'light',
      style: {
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif',
      },
      y: {
        formatter: function (val) {
          return formatCurrency(val, 'GHC ', 1);
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          height: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const series = [
    dataz?.pending || 0,
    dataz?.confirmed || 0,
    dataz?.failed || 0,
    dataz?.reversed || 0
  ];

  // console.log('Series data:', series);
  // console.log('Dataz:', dataz);
    
  return (
    <div className="chart-container">
      <div className="chart-header">
        <div className="chart-title-section">
          <h3 className="chart-title">
            <i className="fas fa-chart-pie"></i>
            Repayments Status
          </h3>
          <p className="chart-subtitle">Loan repayment status</p>
        </div>
      </div>
      
      <div className="chart-content">
        {isLoading ? (
          <div className="chart-loading">
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
            </div>
            <p>Loading chart data...</p>
          </div>
        ) : (
          <div className="donut-chart-wrapper">
            <Chart
              options={options}
              series={series}
              type="donut"
              height={350}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        .chart-container {
          background: #ffffff;
          border-radius: 20px;
          padding: 25px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(95, 99, 242, 0.1);
          height: 100%;
          overflow: visible;
        }

        .chart-header {
          margin-bottom: 25px;
        }

        .chart-title-section {
          flex: 1;
        }

        .chart-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 5px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .chart-title i {
          color: #28a745;
          font-size: 1.1rem;
        }

        .chart-subtitle {
          color: #6c757d;
          font-size: 0.9rem;
          margin: 0;
          font-weight: 400;
        }


        .chart-content {
          position: relative;
          min-height: 350px;
          padding-bottom: 10px;
        }

        .chart-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 350px;
          color: #6c757d;
        }

        .loading-spinner {
          font-size: 2rem;
          color: #28a745;
          margin-bottom: 15px;
        }

        .chart-loading p {
          margin: 0;
          font-size: 0.9rem;
        }

        .donut-chart-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 330px;
          margin-bottom: 5px;
        }

        @media (max-width: 768px) {
          .chart-container {
            padding: 20px;
          }

          .chart-title {
            font-size: 1.1rem;
          }
        }

        @media (max-width: 480px) {
          .chart-container {
            padding: 15px;
          }

          .chart-title {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default PieChart