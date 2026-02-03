import { Button, Card, Col, Row } from 'antd';
import React from 'react'
import  { useState } from 'react'
import ChangePassword from './components/ChangePassword';
import EditProfile from './components/EditProfile';
import GetSingleEntity from '@/hooks/ReactQuery/GetSingleEntity';
import { URL_GET_USER_BY_ID } from '@/config/api-paths';



const index = (props) => {

  let jwt = props?.session?.jwt;
  const ProfileObjectData = GetSingleEntity({
    url: URL_GET_USER_BY_ID,
    jwt: jwt,
    id : props?.session?.user?.user_id,
  })


  // console.log('====================================');
  // console.log(ProfileObjectData);
  // console.log('====================================');


  return (
    <>
    <Card style={{ padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: 'none' }}>
  





<Row>
  <Col span={12} md={12}>
<EditProfile ProfileObjectData={ProfileObjectData} jwt={jwt} />
  </Col>

  <Col span={12} md={12}>
<ChangePassword ProfileObjectData={ProfileObjectData} jwt={jwt}/>
</Col>
  
</Row>



            </Card>



    </>
  )
}

export default index