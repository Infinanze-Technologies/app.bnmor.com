import React from 'react'
import {URL_QRY_EMPLOYEES, URL_GET_QRY_ATTRIBUTE, URL_GET_EMP_PROMOTION } from "@/config/api-paths";
import PromotionTable from './components/PromotionTable';
import useFetchQuery from '@/hooks/ReactQuery/useFetchQuery';
import useSelectQuery from '@/hooks/ReactQuery/useSelectQuery';

const index = (props) => {

  let jwt = props?.session?.jwt;


  const AwardDataObject = useFetchQuery({
    url: URL_GET_EMP_PROMOTION,
    jwt: jwt,
    tableKey  : "Promotion",
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
    tableKey  : "QryAwardType",
    filter : '?attribute_type=Award Type'

  })

  // URL_GET_QRY_ATTRIBUTE





  return (
    <>
    <div>


<div className="d-flex justify-content-center pt-5">
  <div className="col-md-12">
<PromotionTable jwt={jwt} AwardDataObject={AwardDataObject } QryEmployeeDataObject={QryEmployeeDataObject} AttributesDataObject={AttributesDataObject}/>
  </div>


  
</div>



            </div>


    </>
  )
}

export default index