import React from 'react'
import  { useState } from 'react'
import ModalComponent from "@/components/ModalComponent";
import {Button } from 'antd'

import LoanProductTable from './conponents/LoanProductTable';
// import FilterOptions from './conponents/FilterOptions';
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';
// import useGetEntity from '@/hooks/useGetEntity';
// import UsersData from "@/components/json/users.json"
import Link from 'next/link';
import { ADD_LOAN_PRODUCT_PAGE } from '@/config/page-routes';
import { URL_GET_LOAN_PRODUCT } from '@/config/api-paths';

const index = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const [filterUserData, setfilterUserData] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    is_active: '',
    start_date: '',
    end_date: '',
    interest_method: ''
  });
  
  let jwt = props?.session?.jwt;

  // Build filter query string
  const buildFilterQuery = () => {
    const queryParams = new URLSearchParams();
    
    if (filters.search) {
      queryParams.append('search', filters.search);
    }
    if (filters.is_active) {
      queryParams.append('is_active', filters.is_active);
    }
    if (filters.start_date) {
      queryParams.append('start_date', filters.start_date);
    }
    if (filters.end_date) {
      queryParams.append('end_date', filters.end_date);
    }
    if (filters.interest_method) {
      queryParams.append('interest_method', filters.interest_method);
    }
    return queryParams.toString() ? `?${queryParams.toString()}` : '';
  };


  

  const LoanProductDataObject = usePaginateQuery({
    url: URL_GET_LOAN_PRODUCT,
    jwt: jwt,
    tableKey : "LoanProducts",
    filter : `?${filterUserData}`
  })


 








  return (
    <>
    <div>

<div className="row">
  <div className="col-md-12 d-flex">
    <LoanProductTable LoanProductDataObject={LoanProductDataObject} jwt={jwt} setLoading={setLoading} loading={loading} setfilterUserData={setfilterUserData}/>
  </div>
  
</div>



            </div>



    </>
  )
}

export default index