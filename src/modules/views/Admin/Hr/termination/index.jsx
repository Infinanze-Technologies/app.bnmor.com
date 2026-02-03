import React from 'react'
import {URL_QRY_EMPLOYEES, URL_GET_QRY_ATTRIBUTE, URL_GET_AWARD, URL_GET_TERMINATION } from "@/config/api-paths";
import TerminationTable from './components/TerminationTable';
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';
import useSelectQuery from '@/hooks/ReactQuery/useSelectQuery';

const index = (props) => {

  let jwt = props?.session?.jwt;


  const TerminaitonDataObject = usePaginateQuery({
    url: URL_GET_TERMINATION,
    jwt: jwt,
    tableKey  : "Terminaiton",
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
<TerminationTable jwt={jwt} TerminaitonDataObject={TerminaitonDataObject } QryEmployeeDataObject={QryEmployeeDataObject} AttributesDataObject={AttributesDataObject}/>
  </div>


  
</div>



            </div>


    </>
  )
}

export default index