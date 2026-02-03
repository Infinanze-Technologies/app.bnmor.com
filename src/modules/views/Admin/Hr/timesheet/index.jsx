import React from 'react'
import {URL_GET_TIMESHEET, URL_GET_Qry_BRANCH, URL_QRY_EMPLOYEES } from "@/config/api-paths";
import TimeSheetTable from './components/TimeSheetTable';
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';
import useSelectQuery from '@/hooks/ReactQuery/useSelectQuery';

const index = (props) => {

  let jwt = props?.session?.jwt;


  const TimesheetDataObject = usePaginateQuery({
    url: URL_GET_TIMESHEET,
    jwt: jwt,
    tableKey  : "Timesheet",
    filter : ''

  })


  const QryEmployeeDataObject = useSelectQuery({
    url: URL_QRY_EMPLOYEES,
    jwt: jwt,
    tableKey  : "QryEmployee",

  })

  





  return (
    <>
    <div>


<div className="d-flex justify-content-center pt-5">
  <div className="col-md-12">
<TimeSheetTable jwt={jwt} TimesheetDataObject={TimesheetDataObject } QryEmployeeDataObject={QryEmployeeDataObject}/>
  </div>


  
</div>



            </div>


    </>
  )
}

export default index