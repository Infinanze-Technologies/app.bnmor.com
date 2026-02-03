import { Button } from 'antd';
import React from 'react'
import  { useState } from 'react'
import UpdateSettings from './components/UpdateSettings';
import GetSingleEntity from '@/hooks/ReactQuery/GetSingleEntity';
import { URL_GET_BUSINESS_SETTINGS, URL_GET_CURRENCY } from '@/config/api-paths';
import useGetEntity from '@/hooks/useGetEntity';


const index = (props) => {

  let jwt = props?.session?.jwt;
  const ProfileObjectData = GetSingleEntity({
    url: URL_GET_BUSINESS_SETTINGS,
    jwt: jwt,
    id : props?.session?.user?.business_id,
  })



  const currencyObject = useGetEntity({
    url: URL_GET_CURRENCY,
    jwkToken: jwt,
  })


// 


  return (
    <>
    <div>
   





<div className="row">
  <div className="col-md-12">
  <UpdateSettings ProfileObjectData={ProfileObjectData} jwt={jwt} currencyObject={currencyObject} user_id = {props?.session?.user?.user_id} />
  </div>

  
</div>



            </div>



    </>
  )
}

export default index