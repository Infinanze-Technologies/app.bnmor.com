import React from 'react'
import  { useState } from 'react'
import ModalComponent from "@/components/ModalComponent";
import {Button } from 'antd'
import AddMember from './conponents/AddMember';
import {URL_GET_MEMBER,URL_GET_MEMBER_TYPES } from "@/config/api-paths";
import MemberTable from './conponents/MemberTable';
import FilterOptions from './conponents/FilterOptions';
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';
import useGetEntity from '@/hooks/useGetEntity';
import UsersData from "@/components/json/users.json"

const index = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const [filterUserData, setfilterUserData] = useState('ALL');
  const [loading, setLoading] = useState(false);
  
  let jwt = props?.session?.jwt;

  const AdminDataObject = usePaginateQuery({
    url: URL_GET_MEMBER,
    jwt: jwt,
    tableKey : "Admin",
    filter : `?status=${filterUserData == 'ALL' ? '' : filterUserData}`
  })

  const RoleDataObject = useGetEntity({
    url :URL_GET_MEMBER_TYPES,
    jwkToken:jwt
  })

  console.log(RoleDataObject);
  

  const showModal = (value) => {
    if (value == "add") {
    setIsModalVisible(true);
    setModalTitle(<AddMemberTitle/>);
    setModalWidth(800);
    setModalContent(<AddMember setIsModalVisible={setIsModalVisible} jwt={jwt} AdminDataObject={AdminDataObject} RoleDataObject={RoleDataObject} setLoading={setLoading}  />)
    }
     else {
      return false;
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const AddMemberTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700}}>
    <h6>New Member</h6>

    </div>
  )






  return (
    <>
    <div>
    <div className="page-header">
  <div className="row align-items-center">
    <div className="col">
      <h3 className="page-title">Member Page</h3>
      <ul className="breadcrumb">
        <li className="breadcrumb-item">
          <a href="">Dashboard</a>
        </li>
        <li className="breadcrumb-item active">Members</li>
      </ul>
    </div>
    <div className="col-auto float-end ms-auto">
    <div className='submit-button'>
    <Button 
onClick={() =>showModal("add")}
      shape="round" 
    > 
    Create  Member
    </Button>
    </div>
   
    </div>
  </div>
</div>


<div className="row filter-row">
  
 
<FilterOptions  setfilterUserData={setfilterUserData}/>



</div>



<div className="row">
  <div className="col-md-12 d-flex">
<MemberTable AdminDataObject={AdminDataObject} jwt={jwt} RoleDataObject={RoleDataObject} UsersData={UsersData} setLoading={setLoading} loading={loading}/>
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