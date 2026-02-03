import React from 'react'
import {
    Button,
    Select,
    Form,
    Input,
   Space, Upload, Spin, Skeleton, 
   Image
  } from "antd";
import { useState } from 'react';
import ModalComponent from "@/components/ModalComponent";
import { useEffect } from 'react';
import useHandleResponse from '@/hooks/useHandleResponse';
import useToastMessage from '@/hooks/useToastMessage';
  const { Option } = Select;
  import { getRequest, updateRequest } from "@/hooks/apiService";
import { URL_UPDATE_EMPLOYEE_DOCUMENT } from '@/config/api-paths';
import ViewDocument from './ViewDocument';

  const toBase64 = file =>
new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});


function EditDocument(props) {
    let {session,SingleEmployeeDocumentData} = props
    let jwt = session?.jwt;
     let get_cutomer = SingleEmployeeDocumentData?.data?.data
     const [getTime, setGetTime] = useState(false);

     const [isModalVisible, setIsModalVisible] = useState(false);
     const [modalTitle, setModalTitle] = useState();
     const [modalWidth, setModalWidth] = useState();
     const [modalContent, setModalContent] = useState("");


     let public_path = process.env.NEXT_PUBLIC_PUBLIC_IMAGES
     const [fileType, setFileType] = useState('profile');
     const { handleRequestError,handleRequestResponse} = useHandleResponse()
     const { toastError } = useToastMessage();

  const handleChangeFile = (type) => {

    if(type === null){
        setFileType('profile')
    }else{
        setFileType(type)
    }


  }







 
  useEffect(() => {
    
  }, [props,public_path,fileType]);


  const showModal = (value, record) => {

     if (value == "view") {
      setIsModalVisible(true);
      setModalTitle(<ViewDocumentTitle />);
      setModalWidth(800);
      setModalContent(
        <ViewDocument
          setIsModalVisible={setIsModalVisible}
          record={record}
          fileType={fileType}
     
        
        />
      );
    } else {
      return false;
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const ViewDocumentTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
      <h6>View File</h6>
    </div>
  );


  return (
 <>
     <div className="col-sm-12">
    <div className="form-group custom-select">
      <label className="col-form-label">
      Select Document Type 
      </label>
      <Form.Item
     name="file_type"
    
      >
  
  <Select
                  showSearch
                  style={{
                    width: 200,
                  }}
                  placeholder="Select Document Type"
                  optionFilterProp="children" 
                  onChange={(e) => handleChangeFile(e)}  
                  defaultValue="profile"
                >
              <Option value="profile" key={1}>Profile</Option>
              <Option value="certificate" key={2}>Certificate</Option>
              <Option value="resume" key={3}>Resume</Option>
                  
                </Select>
      </Form.Item>
    </div>

  </div>


  <div className="col-sm-12">
    <div className="form-group custom-select">
    {fileType == 'profile' &&
    (
        <>
        <div className="view-profile-card">

        {
            SingleEmployeeDocumentData?.loading === true &&
            (
                <>
                    <Skeleton/>
                </>
            )
        }

     
      
        </div>



        <div className="col-sm-12">
<div className="doc-box">

<Button disabled={getTime}  className="view-profile-button" onClick={() => showModal("view", get_cutomer)}> 
{
  getTime === true
  &&
  (
    <>
Preparing File For Preview
    </>
  )
}

{
  getTime === false
  &&
  (
    <>
    View Employee Profile
    </>
  )
}
       
        </Button>

</div>
       

</div>


      
        </>
    )
    }

 

    {fileType == 'certificate' &&
    (
        <>
        <div className="view-profile-card">

        {
            SingleEmployeeDocumentData?.loading === true &&
            (
                <>
                    <Skeleton/>
                </>
            )
        }

     
      

      

        </div>


        <div className="col-sm-12">
<div className="doc-box">

<Button disabled={getTime} className="view-profile-button" onClick={() => showModal("view", get_cutomer)}> 
{
  getTime === true
  &&
  (
    <>
Preparing File For Preview
    </>
  )
}

{
  getTime === false
  &&
  (
    <>
    View Employee Certificate File
    </>
  )
}
        </Button>

</div>
       

</div>


           
        </>
    )
    }


    {fileType == 'resume' &&
    (
        <>
       
        <div className="view-profile-card">

        {
            SingleEmployeeDocumentData?.loading === true &&
            (
                <>
                    <Skeleton/>
                </>
            )
        }

    
        
        </div>


        <div className="col-sm-12">
<div className="doc-box">

<Button disabled={getTime} className="view-profile-button" onClick={() => showModal("view", get_cutomer)}> 
{
  getTime === true
  &&
  (
    <>
Preparing File For Preview
    </>
  )
}

{
  getTime === false
  &&
  (
    <>
    View Employee Resume File
    </>
  )
}
        </Button>

</div>
       

</div>

  
    
        </>
    )
    }

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

export default EditDocument