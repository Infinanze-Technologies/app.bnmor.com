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

function LineChart(props) {
  let {QryBranchDataObject,jwt} = props
  let qryBranchData = QryBranchDataObject?.data

  let api_url = getApiUrl();
  const [dataz, setData] = useState({});
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [getTime, setGetTime] = useState(true);
  const [getBranch, setBranch] = useState('ALL');

  // let filter = `?branch_id=${getBranch === 'ALL' ? '' : getBranch}`


  // if getBranch is ALL, then don't add branch_id to the query
  // if getBranch is not ALL, then add branch_id to the query

  let filter = getBranch === 'ALL' ? '' : `?branch_id=${getBranch}`
  let query = URL_GET_INITIAL_INCOME+filter;
  
  const handleProPerformance = async () => {
    try {
      setIsLoading(true);
       await axios(api_url + query, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      }).then((response) => {
        setData(response?.data?.data);
        setIsLoading(false);
      });
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    setTimeout(() => setGetTime(false), 5000);
  }, [dataz]);

  useEffect(() => {
    handleProPerformance();
  }, [getBranch]);

  const options = {
    colors: ['#28a745', '#4D4D4D', '#ffc107', '#dc3545', '#17a2b8'],
    chart: {
      height: 320,
      type: 'donut',
      background: 'transparent',
      fontFamily: 'Inter, sans-serif',
    },
    labels: ['Account Balance'],
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

  const changeBranch = (e) => {
    setBranch(e?.target?.value)
  }

  const series = [dataz?.amount];
    
  return (
    <div className="chart-container">
      <div className="chart-header">
        <div className="chart-title-section">
          <h3 className="chart-title">
            <i className="fas fa-chart-pie"></i>
            Account Balance
          </h3>
          <p className="chart-subtitle">Current balance overview</p>
        </div>
        <div className="chart-controls">
          <select 
            className="branch-selector"
            value={getBranch}
            onChange={changeBranch}
          >
            <option value="ALL">All Branches</option>
            {qryBranchData?.map((branch) => (
              <option key={branch.branch_id} value={branch.branch_id}>
                {branch.name}
              </option>
            ))}
          </select>
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
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 25px;
          gap: 20px;
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

        .chart-controls {
          flex-shrink: 0;
        }

        .branch-selector {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 10px;
          padding: 8px 15px;
          font-size: 0.9rem;
          color: #495057;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 120px;
        }

        .branch-selector:hover {
          border-color: #28a745;
          background: #ffffff;
        }

        .branch-selector:focus {
          outline: none;
          border-color: #28a745;
          box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
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

          .chart-header {
            flex-direction: column;
            align-items: stretch;
            gap: 15px;
          }

          .chart-title {
            font-size: 1.1rem;
          }

          .branch-selector {
            width: 100%;
            text-align: center;
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

export default LineChart