import React from 'react'
import {URL_GET_Qry_BRANCH, URL_QRY_EMPLOYEES, URL_GET_EMP_TIMESHEET } from "@/config/api-paths";
import TimeSheetTable from './components/TimeSheetTable';
import useFetchQuery from '@/hooks/ReactQuery/useFetchQuery';
import useSelectQuery from '@/hooks/ReactQuery/useSelectQuery';

const index = (props) => {

  let jwt = props?.session?.jwt;
  let employee_id = props?.session?.user?.user_id

  const TimesheetDataObject = useFetchQuery({
    url: URL_GET_EMP_TIMESHEET,
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
<TimeSheetTable jwt={jwt} TimesheetDataObject={TimesheetDataObject } QryEmployeeDataObject={QryEmployeeDataObject} employee_id={employee_id} />
  </div>


  
</div>



            </div>


    </>
  )
}

export default index