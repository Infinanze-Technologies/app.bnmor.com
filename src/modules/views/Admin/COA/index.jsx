import React from 'react'
import {URL_GET_BRANCH, URL_GET_CASH_FUNDING_ACCOUNTS, URL_GET_COA_HIERARCHY, URL_GET_FUNDING_HIERARCHY } from "@/config/api-paths";
import ChartsOfAccountsTable from './components/ChartsOfAccountsTable';
import FundingAccountsTable from './components/FundingAccountsTable';
import FinancialYearConfig from './components/FinancialYearConfig';
import useFetchQuery from '@/hooks/ReactQuery/useFetchQuery';
import useGetEntity from '@/hooks/useGetEntity';

const index = (props) => {

  let jwt = props?.session?.jwt;

  // Fetch branch data
  const BranchDataObject = useFetchQuery({
    url: URL_GET_BRANCH,
    jwt: jwt,
    tableKey  : "Branch",
    filter : ''
  })

  const COADataObject = useGetEntity({
    url: URL_GET_COA_HIERARCHY,
    jwkToken: jwt,
    tableKey  : "COA",
  })

  const FundingDataObject = useGetEntity({
    url: URL_GET_FUNDING_HIERARCHY,
    jwkToken: jwt,
    tableKey  : "Funding",
  })

  const CashFundingDataObject = useFetchQuery({
    url: URL_GET_CASH_FUNDING_ACCOUNTS,
    jwt: jwt,
    tableKey  : "CashFunding",
  })


  let coaData = COADataObject?.data;
  let fundingData = FundingDataObject?.data;
  let cashFundingData = CashFundingDataObject?.data;
  


  return (
    <>
      <div className="container-fluid">
        {/* Financial Year Configuration */}
        {/* <div className="row mb-4">
          <div className="col-12">
            <FinancialYearConfig jwt={jwt} />
          </div>
        </div> */}



          {/* Funding Accounts Table */}
          <div className="row">
          <div className="col-12">
            <FundingAccountsTable 
              jwt={jwt} 
              branchData={BranchDataObject?.data} 
              fundingData={fundingData}
              loading={FundingDataObject?.loading}
              error={FundingDataObject?.error}
              FundingDataObject={FundingDataObject}
              CashFundingDataObject={CashFundingDataObject}
            />
          </div>
        </div>


        {/* Charts of Accounts Table */}
        <div className="row mb-4">
          <div className="col-12">
            <ChartsOfAccountsTable 
              jwt={jwt} 
              accountsData={coaData}
              loading={COADataObject?.loading}
              error={COADataObject?.error}
              onRefetch={COADataObject?.refetch}
            />
          </div>
        </div>

      
      </div>
    </>
  )
}

export default index