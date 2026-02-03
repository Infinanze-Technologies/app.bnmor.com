import React from 'react'
import  { useState } from 'react'
import ModalComponent from "@/components/ModalComponent";
import {Button } from 'antd'
import AddLoan from './conponents/AddLoan';
import {URL_GET_LOAN } from "@/config/api-paths";
import LoanTable from './conponents/LoanTable';
import FilterOptions from './conponents/FilterOptions';
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';
import Link from 'next/link';
import { ADD_LOAN_PAGE } from '@/config/page-routes';

const index = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const [filterUserData, setfilterUserData] = useState('');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    loan_status: '',
    start_date: '',
    end_date: '',
    interest_method: '',
    borrower_id: ''
  });
  
  let jwt = props?.session?.jwt;

  const LoanDataObject = usePaginateQuery({
    url: URL_GET_LOAN,
    jwt: jwt,
    tableKey : "Loans",
    filter : filterUserData ? `?${filterUserData}` : ''
  })

  const showModal = (value) => {
    if (value == "add") {
    setIsModalVisible(true);
    setModalTitle(<AddLoanTitle/>);
    setModalWidth(1200);
    setModalContent(<AddLoan setIsModalVisible={setIsModalVisible} jwt={jwt} setLoading={setLoading}  />)
    }
     else {
      return false;
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const AddLoanTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700}}>
      <h6>Add New Loan</h6>
    </div>
  )






  return (
    <>
    <div>
 


<div className="row">
  <div className="col-md-12 d-flex">
    <LoanTable 
      LoanDataObject={LoanDataObject} 
      jwt={jwt} 
      setLoading={setLoading} 
      loading={loading} 
      setfilterUserData={setfilterUserData}
      setFilters={setFilters}
    />
  </div>
  
</div>



            </div>



            <ModalComponent
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
        title={modalTitle}
        width={modalWidth}
      >
        {modalContent}
      </ModalComponent>
    </>
  )
}

export default index