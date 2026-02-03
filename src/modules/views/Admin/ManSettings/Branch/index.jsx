import React from 'react'
import {URL_GET_BRANCH } from "@/config/api-paths";
import BranchTable from './components/BranchTable';
import useFetchQuery from '@/hooks/ReactQuery/useFetchQuery';
import ManagementSettingsTabsWrapper from '@/components/ManagementSettingsTabsWrapper';

const index = (props) => {

  let jwt = props?.session?.jwt;


  const BranchDataObject = useFetchQuery({
    url: URL_GET_BRANCH,
    jwt: jwt,
    tableKey  : "Branch",
    filter : ''

  })




  



  return (
    <>
      <div>
        {/* Management Settings Tab Navigation */}
        <ManagementSettingsTabsWrapper activeKey="branch" />
        
        {/* Branch Table Content */}
        <div className="d-flex justify-content-center pt-3">
          <div className="col-md-12">
            <BranchTable jwt={jwt} BranchDataObject={BranchDataObject}/>
          </div>
        </div>
      </div>
    </>
  )
}

export default index