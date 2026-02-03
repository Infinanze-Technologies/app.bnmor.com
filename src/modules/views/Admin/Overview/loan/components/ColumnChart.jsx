import React, { useState, useEffect }  from 'react'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })
import dynamic from 'next/dynamic'
import { URL_GET_ANNUAL_INCOME } from "@/config/api-paths";
import {Spin,Skeleton} from "antd";
import axios from "axios";
import { getApiUrl } from "@/config/getApiUrl";
import Years from "@/components/json/years.json"
import { formatChartNumber } from '@/utility/numberFormatter';

function ColumnChart(props) {

  let {jwt} = props
  const currentYear = new Date().getFullYear();
 
  let api_url = getApiUrl();
  const [dataz, setData] = useState([]);
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [getTime, setGetTime] = useState(true);
  const [getYear, setYear] = useState(null);

  let filter = `?year=${getYear == null ? currentYear : getYear}`
  let query = URL_GET_ANNUAL_INCOME+filter;
  
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
  }, []);

  useEffect(() => {
    handleProPerformance();
  }, [getYear]);

  useEffect(() => {
    setCategories(dataz?.labels?.map((dt) => dt));
    const series = [
      {
        name: 'Total Amount (GHC)',
        data: dataz?.series?.map(dt => dt)
      } 
    ]
    setSeries(series);
  }, [dataz]);

  const changeYear = (e) => {
    setYear(e?.target?.value)
  }

  let options = {
    chart: {
      height: 350,
      type: 'bar',
      zoom: {
        enabled: false
      }, 
      toolbar: {
        show: false
      },
      background: 'transparent',
      fontFamily: 'Inter, sans-serif',
      margin: {
        top: 20,
        right: 20,
        bottom: 40,
        left: 20
      },
    },
    plotOptions: {
       bar: {
         horizontal: false,
         columnWidth: '60%',
         endingShape: 'rounded',
         borderRadius: 8,
         distributed: false,
         dataLabels: {
           position: 'top',
         },
         rangeBarOverlap: false,
         rangeBarGroupRows: false,
       },
    },
    colors: ['#4D4D4D'],
    dataLabels: {
      enabled: false,
      formatter: function (val) {
        return val
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ["#304758"]
      }
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '14px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 500,
      labels: {
        colors: '#6c757d'
      },
      markers: {
        width: 12,
        height: 12,
        radius: 6
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    grid: {
      borderColor: '#f1f3f4',
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        top: 20,
        right: 20,
        bottom: 50,
        left: 20
      },
    },
    xaxis: {
      categories: categories,
      position: 'bottom',
      labels: {
        offsetY: 15,
        style: {
          colors: '#6c757d',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        fill: {
          type: 'gradient',
          gradient: {
            colorFrom: '#D8E3F0',
            colorTo: '#BED1E6',
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          }
        }
      },
      tooltip: {
        enabled: true,
        offsetY: -35,
      }
    },
    yaxis: {
      labels: {
        show: true,
        align: 'right',
        minWidth: 0,
        maxWidth: 160,
        style: {
          colors: '#6c757d',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
        },
        offsetX: 0,
        offsetY: 0,
        rotate: 0,
        formatter: function (val) {
          return formatChartNumber(val, 1);
        }
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    fill: {
      opacity: 1,
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: "vertical",
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 0.85,
        stops: [50, 0, 100, 100]
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "GHC " + formatChartNumber(val, 1);
        }
      },
      theme: 'light',
      style: {
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif',
      },
      x: {
        show: true,
        format: 'MMM',
        formatter: undefined,
      },
      marker: {
        show: true,
      },
    },
    responsive: [{
      breakpoint: 480,
      options: {
        plotOptions: {
          bar: {
            columnWidth: '70%'
          }
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div className="chart-title-section">
          <h3 className="chart-title">
            <i className="fas fa-chart-line"></i>
            Annual Performance
          </h3>
          <p className="chart-subtitle">Revenue trends by month</p>
        </div>
        <div className="chart-controls">
          <select 
            className="year-selector"
            value={getYear || currentYear}
            onChange={changeYear}
          >
            {Years.map((year) => (
              <option key={year} value={year}>
                {year}
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
          <Chart
            options={options}
            series={series}
            type="bar"
            height={350}
          />
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
          color: #4D4D4D;
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

        .year-selector {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 10px;
          padding: 8px 15px;
          font-size: 0.9rem;
          color: #495057;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 100px;
        }

        .year-selector:hover {
          border-color: #4D4D4D;
          background: #ffffff;
        }

        .year-selector:focus {
          outline: none;
          border-color: #4D4D4D;
          box-shadow: 0 0 0 3px rgba(95, 99, 242, 0.1);
        }

        .chart-content {
          position: relative;
          min-height: 350px;
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
          color: #4D4D4D;
          margin-bottom: 15px;
        }

        .chart-loading p {
          margin: 0;
          font-size: 0.9rem;
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

          .year-selector {
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

export default ColumnChart