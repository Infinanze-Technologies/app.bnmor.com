import React from 'react'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })
import dynamic from 'next/dynamic'
function ExpensesChart() {
    const series = [
        {
        name: 'Total Expenses (GHC)',
        data: [20, 29, 37, 36, 44, 45, 50, 20, 29, 37, 36, 44]
      }
    ]

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
          

        },

        plotOptions: {
           bar: {
             horizontal: false,
             columnWidth: '20%',
             endingShape: 'rounded',
             borderRadius: 10
           },
       },
       legend: {
         show: true,
           
       },

       colors: ['#9B0000'],
        dataLabels: {
          enabled: false
        },
        stroke: {
           show: true,
           width: 2,
           colors: ['transparent']
         },
        xaxis: {
           categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul','Aug','Sept','Oct','Nov','Dec'],
          title: {
        //    text: 'Total Sales (GHC)'
          },
         
          labels: {
              show :true
          }
        },
        yaxis: {
         title: {
        //    text: 'Total Sales (GHC)',
         },
         },
         fill: {
           opacity: 1
         },
         tooltip: {
           y: {
             formatter: function (val) {
               return  "GHS " +  val
             }
           }
         }
      
    }
 
  return (
    <div className="card card-table flex-fill">
    <div className="card-header">
      <h4 className="card-title mb-0" style={{fontSize:'16px'}}>Annual Expenses</h4>
    </div>
    <div className="card-body">
    <Chart options={options} series={series} type="bar" height="307" width="100%"/>
    </div>
    </div>
  )
}

export default ExpensesChart;