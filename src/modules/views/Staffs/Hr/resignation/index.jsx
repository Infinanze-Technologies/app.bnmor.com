import React from 'react'
import {URL_QRY_EMPLOYEES, URL_GET_QRY_ATTRIBUTE, URL_GET_AWARD, URL_GET_TERMINATION, URL_GET_RESIGNATION, URL_GET_EMP_RESIGNATION } from "@/config/api-paths";
import TerminationTable from './components/ResignationTable';
import useFetchQuery from '@/hooks/ReactQuery/useFetchQuery';
import useSelectQuery from '@/hooks/ReactQuery/useSelectQuery';

const index = (props) => {

  let jwt = props?.session?.jwt;
  let employee_id = props?.session?.user?.user_id


  const TerminaitonDataObject = useFetchQuery({
    url: URL_GET_EMP_RESIGNATION,
    jwt: jwt,
    tableKey  : "Resignation",
    filter : ''

  })


  const QryEmployeeDataObject = useSelectQuery({
    url: URL_QRY_EMPLOYEES,
    jwt: jwt,
    tableKey  : "QryEmployee",
    filter : ''

  })

  const AttributesDataObject = useSelectQuery({
    url: URL_GET_QRY_ATTRIBUTE,
    jwt: jwt,
    tableKey  : "QryTerminationType",
    filter : '?attribute_type=Termination Type'

  })

  // URL_GET_QRY_ATTRIBUTE





  return (
    <>
    <div>


<div className="d-flex justify-content-center pt-5">
  <div className="col-md-12">
<TerminationTable jwt={jwt} TerminaitonDataObject={TerminaitonDataObject } QryEmployeeDataObject={QryEmployeeDataObject} AttributesDataObject={AttributesDataObject} employee_id={employee_id}/>
  </div>


  
</div>



            </div>


    </>
  )
}

export default index