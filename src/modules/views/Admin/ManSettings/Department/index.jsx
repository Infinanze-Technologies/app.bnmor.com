import React from 'react'
import {URL_GET_DEPARTMENT, URL_GET_Qry_BRANCH } from "@/config/api-paths";
import DepartmentTable from './components/DepartmentTable';
import useFetchQuery from '@/hooks/ReactQuery/useFetchQuery';
import useSelectQuery from '@/hooks/ReactQuery/useSelectQuery';
import ManagementSettingsTabsWrapper from '@/components/ManagementSettingsTabsWrapper';

const index = (props) => {

  let jwt = props?.session?.jwt;


  const DepartmentDataObject = useFetchQuery({
    url: URL_GET_DEPARTMENT,
    jwt: jwt,
    tableKey  : "Department",
    filter : ''

  })


  const QryBranchDataObject = useSelectQuery({
    url: URL_GET_Qry_BRANCH,
    jwt: jwt,
    tableKey  : "QryBranch",

  })

  





  return (
    <>
      <div>
        {/* Management Settings Tab Navigation */}
        <ManagementSettingsTabsWrapper activeKey="department" />
        
        {/* Department Table Content */}
        <div className="d-flex justify-content-center pt-3">
          <div className="col-md-12">
            <DepartmentTable jwt={jwt} DepartmentDataObject={DepartmentDataObject} QryBranchDataObject={QryBranchDataObject}/>
          </div>
        </div>
      </div>
    </>
  )
}

export default index