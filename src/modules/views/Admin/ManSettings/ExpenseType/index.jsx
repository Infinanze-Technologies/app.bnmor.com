import React from 'react'
import {URL_GET_ATTRIBUTES } from "@/config/api-paths";
import ExpenseTypeTable from './components/ExpenseTypeTable';
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';
import ManagementSettingsTabsWrapper from '@/components/ManagementSettingsTabsWrapper';

const index = (props) => {

  let jwt = props?.session?.jwt;


  const AttributesDataObject = usePaginateQuery({
    url: URL_GET_ATTRIBUTES,
    jwt: jwt,
    tableKey  : "ExpenseType",
    filter : '?attribute_type=Expense Type'

  })




  



  return (
    <>
    <div>


<ManagementSettingsTabsWrapper activeKey="expenseType" />

<div className="d-flex justify-content-center pt-5">
  <div className="col-md-12">
<ExpenseTypeTable jwt={jwt} AttributesDataObject={AttributesDataObject}/>
  </div>


  
</div>



            </div>


    </>
  )
}

export default index