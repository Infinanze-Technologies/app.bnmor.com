import { useEffect, useState } from "react";
import {
  Button,
  Select,
  Form,
  Input,
 Space, Upload, Image, Spin 
} from "antd";
const { Option } = Select;
import { getRequest, postRequest } from "@/hooks/apiService";
import { URL_ADD_EMPLOYEE, URL_GET_ALL_EMP_ROLES, URL_GET_DEPARTMENT_BY_BRANCH, URL_GET_DESIGNATION_BY_DEPARTMENT, URL_GET_Qry_BRANCH } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import Router from 'next/router'
import moment from 'moment'
import { DatePicker } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import useSelectQuery from "@/hooks/ReactQuery/useSelectQuery";
import useToastMessage from "@/hooks/useToastMessage";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";
const dateFormat = 'Y-m-d';

const toBase64 = file =>
new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

const AddStaff = (props) => {
  let jwt = props?.session?.jwt;
   const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
    const [getdob, setGetDob] = useState( moment().format(dateFormat))
        const [getjoinDate, setGetJoinDate] = useState( moment().format(dateFormat))
        const [profileUpload, setProfileUpload] = useState(null);
        const [certificateUpload, setCertificateUpload] = useState(null);
        const [resumeUpload, setResumeUpload] = useState(null);
        const [pfileList, setProfileFileList] = useState([]);
        const [branchId, setBranchId] = useState(0);
        const [departmentId, setDepartmentId] = useState(0);
        const [getDepartments, setGetDepartments] = useState([]);
        const [getDesignations, setGetDesignations] = useState([]);

        const [isloadingDepartment, setIsloadingDepartment] = useState(false);

        const [isloadingDesignation, setIsloadingDesignation] = useState(false);
        const { toastError } = useToastMessage();


  
      const handleChangeDOB = (date, dateString) => {
    setGetDob(dateString)
  }

       const handleChangeJoinDate = (date, dateString) => {
    setGetJoinDate(dateString)
  }

  form.setFieldsValue({
    dob: getdob,
    join_date :getjoinDate
 
  })

  const handleProfilefile = async ({ fileList }) => {



    // const base64 = await toBase64(e.target.files[0]);
    // setProfileFileList(base64);
  

    const base64Files = await Promise.all(
      fileList.map(async file => {
        const base64 = await toBase64(file.originFileObj);
        return { ...file, base64 };
      })
    );

     setProfileFileList(base64Files);



   
    
  }



  const handleChangeBranch = (id) => {

    if(id == 0){
      setGetDepartments([])
      setGetDesignations([])
      form.setFieldsValue({ department_id: 0 })
      form.setFieldsValue({ designation_id: 0 })
       setDepartmentId(0)
    }else{
      setBranchId(id)
      DepartmentById(id)
    }


  }


  const handleChangeDepartment = (id) => {
    if(id == 0){
      setGetDesignations([])
      form.setFieldsValue({ designation_id: 0 })
       setDepartmentId(0)
    }else{
      setDepartmentId(id)
      DesignationById(id)
    }
 
  }


  const QryBranchDataObject = useSelectQuery({
    url: URL_GET_Qry_BRANCH,
    jwt: jwt,
    tableKey  : "QryBranch",
    filter : ''

  });
    const QryRolesDataObject = useSelectQuery({
    url: URL_GET_ALL_EMP_ROLES,
    jwt: jwt,
    tableKey  : "QryRoles",
    filter : ''

  })







  
  let qryBranchData = QryBranchDataObject?.data
  let qryRoleData = QryRolesDataObject?.data
  
  

  // let get_branch_id = typeof(branchId) == 'undefined' ? '' : branchId == 0 ? '' : branchId


let DepartmentById = async (id) => {
  // setGetDepartments([])
  setIsloadingDepartment(true)
  await getRequest(URL_GET_DEPARTMENT_BY_BRANCH+`/${id}`, jwt)
  .then((res) => {
    setIsloadingDepartment(false)
    setGetDepartments(res.data?.data)
    return res.data?.data;
  })
  .catch((err) => {
    console.log(err)
    // return err
  });
}

let DesignationById = async (id) => {
  // setGetDesignations([])
  setIsloadingDesignation(true)
  await getRequest(URL_GET_DESIGNATION_BY_DEPARTMENT+`/${id}`, jwt)
  .then((res) => {
    console.log(res.data?.data);
    setIsloadingDesignation(false)
    setGetDesignations(res.data?.data)
    return res.data?.data;
  })
  .catch((err) => {
    console.log(err)
    // return err
  });
}
 



  // console.log('====================================');
  // // console.log(get_branch_id);
  // console.log(getDesignations);
  // console.log('====================================');
  

  useEffect(() => {
  }, [getDepartments,getDesignations])


  const handleCertificatefile = async (e) => {
    const file = e.target.files[0];

    // setCoverUpload(e.target.files[0]);

    await toBase64(file)
    .then(result => {
      file["base64"] = result;
      setCertificateUpload(file["base64"]);

    })
    .catch(err => {
      console.log(err);
    });



   

    
  }



  const handleResumefile = async (e) => {


    const file = e.target.files[0];

    // setCoverUpload(e.target.files[0]);

    await toBase64(file)
    .then(result => {
      file["base64"] = result;
      setResumeUpload(file["base64"]);

    })
    .catch(err => {
      console.log(err);
    });




 
    
  }


 


  const onProfilePreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
  
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  }



  const beforeProfileUpload = (file) => {

    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
        // Add the base64 content to the file object
        file.base64 = reader.result;
        setProfileUpload(reader.result)
        resolve(file);
      };
      reader.onerror = (error) => reject(error);
    });
  };






  const onFinish =  (values) => {
    try {
      if(profileUpload === null)
      return toastError("Profile is required");
      
      if(certificateUpload === null)
      return toastError("Certificate is required");

      if(resumeUpload === null)
      return toastError("Resume is required");

      if(branchId === null || branchId == 0)
      return toastError("Branch is required");

      if(departmentId === null || departmentId == 0)
      return toastError("Department is required");

      if(values?.designation_id == 0)
      return toastError("Designation is required");



      let employee = {
        "fullname": values?.fullname,
        "email":values?.email,
        "phone": values?.phone,
        "address": values?.address,
        "dob": values?.dob,
        "gender":values?.gender,
        "role_id":  values?.role_id,
        "branch_id": branchId,
        "department_id": departmentId,
        "designation_id": values?.designation_id,
        "join_date":values?.join_date,
      }

      let bank_details = {
        "holder_name": values?.holder_name,
        "bank_name": values?.bank_name,
        "branch_location": values?.branch_location,
        "bank_code": values?.bank_code,
        "account_number": values?.account_number,
        "tax_payer_id": values?.tax_payer_id,
      }

      let files = {
        "certificate": certificateUpload,
        "resume": resumeUpload,
        "profile": profileUpload
      }

      let data = {
        employee,
        bank_details,
        files
      }

      console.log({...data});

    // return;




      setIsloadingSubmit(true);
      postRequest(URL_ADD_EMPLOYEE,{...data},jwt)
        .then((res) => {
          // console.log(res?.response)
          setIsloadingSubmit(false);
          handleRequestResponse(res)
          setProfileUpload(null)
          setCertificateUpload(null)
          setProfileFileList(null)
          setBranchId(0)
          setDepartmentId(0)
          setGetDepartments([])
          setGetDesignations([])   
          setProfileFileList([])       
          form.resetFields()   
       
        }).finally(() => {
          setIsloadingSubmit(false);
        })
        .catch((err) => {
          // console.log(err?.response);
          handleRequestError(err);
        
          
        });
      
    } catch (error) {
      setIsloadingSubmit(false);
      console.log(error)
      
    }
  
  };



  

  return (
    <>
   
  


   <div>
    <div className="page-header">
  <div className="row align-items-center">
    <div className="col">
      {/* <h3 className="page-title">Create Employee </h3> */}
      <ul className="breadcrumb">
        <li className="breadcrumb-item">
          <a href="">Create</a>
        </li>
        <li className="breadcrumb-item active">Employee</li>
      </ul>
    </div>
    <div className="col-auto float-end ms-auto">
    <div className='submit-button'>
    <Button
    {...BUTTON_CONFIGS.GO_BACK_BUTTON()}
    onClick={() => Router.back()}
    >
  

    Go Back
  
    </Button>
    
    </div>
   
    </div>
  </div>
</div>


<Form onFinish={onFinish} form={form} name="basic" size="middle">

<div className="row">


{/* Personal Detail */}

  <div className="col-md-6">
 

  <div className="card card-table flex-fill">
        <div className="card-header">
          <h3 className="card-title mb-0">Personal Detail</h3>
        </div>
        <div className="card-body">
        <div style={{ height:'450px' }}>
        <div className="row px-3">

        <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
                 Name <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="fullname"
                rules={[
                  {
                    required: true,
                    message: "Please input your name!",
                  },
                ]}
              >
                <Input className="form-control" type="text" />
              </Form.Item>
            
             
            </div>
          </div>


        <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
                 Email <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                  },
                ]}
              >
                <Input className="form-control" type="email" />
              </Form.Item>
            
             
            </div>
          </div>



          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
                 Phone <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please input your phone!",
                  },
                ]}
              >
                <Input className="form-control" type="text" />
              </Form.Item>
            
             
            </div>
          </div>




          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
                 Address <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Please input your address!",
                  },
                ]}
              >
                <Input className="form-control" type="text" />
              </Form.Item>
            
             
            </div>
          </div>



      




 <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
               Gender <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="gender"
                rules={[
                  {
                    required: true,
                    message: "Please select gender!",
                  },
                ]}
              >
                <Select
                  showSearch
                  style={{
                    width: 200,
                  }}
                  placeholder="Select Gender"
                  optionFilterProp="children"   
                >
                 <Option value='' >Select Gender</Option>
              <Option value="Male" key={1}>Male</Option>
              <Option value="Female" key={2}>Female</Option>
                  
                </Select>
              </Form.Item>
            </div>
          </div>

          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
               Role <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="role_id"
                rules={[
                  {
                    required: true,
                    message: "Please select role!",
                  },
                ]}
              >
                <Select
                  showSearch
                  style={{
                    width: 200,
                  }}
                  placeholder="Select Role"
                  optionFilterProp="children"   
                >
              
              { qryRoleData?.map((item,index)=> 

<>
<Option value={item?.id} key={index}>{item?.name}</Option>
</>
)

}
          
                </Select>
              </Form.Item>
            </div>
          </div>


          <div className="col-sm-12">
            <div className="form-group custom-select">
              <label className="col-form-label">
                 Date Of Birth <span className="text-danger">*</span>
              </label>
              <Form.Item
             name="date"
                rules={[
                  {
                    required: true,
                    message: "Please input your dob!",
                  },
                ]}
              >
                <DatePicker
              onChange={(date, dateString) =>
                            handleChangeDOB(date, dateString)
                          }
                       
                  style={{ width:'100%',height:'50px' }}/>
              </Form.Item>
            </div>
            <Form.Item hidden={true} name="dob">
                      <Input />
                    </Form.Item>
          </div>




        </div>
        
        </div>
        </div>
        </div>


 

  </div>

  {/* Company Detail */}

  <div className="col-md-6">
  <div className="card card-table flex-fill">
        <div className="card-header">
          <h3 className="card-title mb-0">Company Detail</h3>
        </div>
        <div className="card-body">

        <div style={{ height:'450px' }}>
        <div className="row px-3">


        <div className="col-sm-6">
    <div className="form-group custom-select">
      <label className="col-form-label">
       Branch <span className="text-danger">*</span>
      </label>
      <Form.Item
        name="branch_id"
        rules={[
          {
            required: true,
            message: "Please select branch!",
          },
        ]}
      >
        <Select
          showSearch
          style={{
            width: 200,
          }}
          placeholder="Select Branch"
          optionFilterProp="children"   
          onChange={(e) => handleChangeBranch(e)}
        >
         <Option value={0} key={0} >Select Branch</Option>
         { qryBranchData?.map((item,index)=> 

<>
<Option value={item?.branch_id} key={item?.id}>{item?.name}</Option>
</>
)

}
          
        </Select>
      </Form.Item>
    </div>
  </div>



  <div className="col-sm-6">
    <div className="form-group custom-select">
      <label className="col-form-label">
      Department <span className="text-danger">*</span>
      </label>
      <Spin spinning={isloadingDepartment}>
      <Form.Item
        name="department_id"
        rules={[
          {
            required: true,
            message: "Please select department!",
          },
        ]}
      >
        <Select
          showSearch
          style={{
            width: 200,
          }}
          placeholder="Select Gender"
          optionFilterProp="children"
          onChange={(e) => handleChangeDepartment(e)}
      
        >
         <Option value={0} key={0} >Select Department</Option>
         
         { getDepartments?.map((item,index)=> 

<>
<Option value={item?.id} key={item?.id}>{item?.name}</Option>
</>
)

}

          
        </Select>
      </Form.Item>
      </Spin>
    </div>
  </div>



  <div className="col-sm-6">
    <div className="form-group custom-select">
      <label className="col-form-label">
      Designation <span className="text-danger">*</span>
      </label>
      <Spin spinning={isloadingDesignation}>
      <Form.Item
        name="designation_id"
        rules={[
          {
            required: true,
            message: "Please select designation!",
          },
        ]}
      >
        <Select
          showSearch
          style={{
            width: 200,
          }}
          placeholder="Select Designation"
          optionFilterProp="children" 
       
        >
         <Option value={0} key={0} >Select Designation</Option>
        
         { getDesignations?.map((item,index)=> 

<>
<Option value={item?.id} key={item?.id}>{item?.name}</Option>
</>
)

}
          
        </Select>
      </Form.Item>
      </Spin>
   
    </div>
  </div>







  <div className="col-sm-6">
    <div className="form-group custom-select">
      <label className="col-form-label">
      Date Of Joining <span className="text-danger">*</span>
      </label>
      <Form.Item
     name="date1"
        rules={[
          {
            required: true,
            message: "Please input your join_date!",
          },
        ]}
      >
        <DatePicker
      onChange={(date, dateString) =>
                    handleChangeJoinDate(date, dateString)
                  }
               
          style={{ width:'100%',height:'50px' }}/>
      </Form.Item>
    </div>
    <Form.Item hidden={true} name="join_date">
              <Input />
            </Form.Item>
  </div>










</div>
        </div>

        </div>
        </div>

</div>


{/* Document */}

<div className="col-md-6">
  <div className="card card-table flex-fill">
        <div className="card-header">
          <h3 className="card-title mb-0">Document</h3>
        </div>
        <div className="card-body">

        <div style={{ height:'470px' }}>


        <div className="row px-3">


<div className="col-sm-12">
<div className="form-group custom-select">
<label className="col-form-label">
Certificate <span className="text-danger">*</span>
</label>
<div className="file-buttom">
<Form.Item
 name="certificate"
                rules={[
                  {
                    required: true,
                    message: "Please input your certificate!",
                  },
                ]}
>
<Input className="form-control" type="file" accept=".pdf" onChange={(e)=>handleCertificatefile(e)}  />
  </Form.Item>
</div>
</div>
</div>






<div className="col-sm-12">
<div className="form-group custom-select">
<label className="col-form-label">
Resume <span className="text-danger">*</span>
</label>
<div className="file-buttom">
<Form.Item
 name="resume"
                rules={[
                  {
                    required: true,
                    message: "Please input your resume!",
                  },
                ]}
>
<Input className="form-control" type="file" accept=".pdf" onChange={(e)=>handleResumefile(e)}  />
  </Form.Item>
</div>
       
</div>
</div>



<div className="col-sm-12">
<div className="form-group custom-select">
<label className="col-form-label">
Photo <span className="text-danger">*</span>
</label>

<div className="file-buttom">
<Form.Item>
        <ImgCrop rotationSlider>
      <Upload
        // listType="picture-card"
        // fileList={fileList}
        // onChange={handleProfilefile}
        // onPreview={onProfilePreview}
        // type="file"
        accept="image/webp,image/jpeg,image/png,image/jpg"
        // beforeUpload ={beforeProfileUpload}
        listType="picture-card"
        fileList={pfileList}
        onChange={handleProfilefile}
        onPreview={onProfilePreview}
        beforeUpload ={beforeProfileUpload}
      >
        {pfileList.length < 1 && '+ Upload'}
      </Upload>
    </ImgCrop>
   
</Form.Item>
</div>
       
</div>
</div>















</div>
        
        </div>

        </div>
        </div>

  </div>

  {/* Bank Account Detail */}

  <div className="col-md-6">
  <div className="card card-table flex-fill">
        <div className="card-header">
          <h3 className="card-title mb-0">Bank Account Detail</h3>
        </div>
        <div className="card-body">

        <div style={{ height:'470px' }}>

    
        <div className="row px-3">

        <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
              Account Holder Name <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="holder_name"
                rules={[
                  {
                    required: true,
                    message: "Please input your holder_name!",
                  },
                ]}
              >
                <Input className="form-control" type="text" />
              </Form.Item>
            
             
             </div>
            </div>


            <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
              
Account Number <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="account_number"
                rules={[
                  {
                    required: true,
                    message: "Please input your account_number!",
                  },
                ]}
              >
                <Input className="form-control" type="number" />
              </Form.Item>
            
             
             </div>
            </div>



            <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
              
              Bank Name <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="bank_name"
                rules={[
                  {
                    required: true,
                    message: "Please input your bank_name!",
                  },
                ]}
              >
                <Input className="form-control" type="text" />
              </Form.Item>
            
             
             </div>
            </div>


            <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
              
              
Bank Identifier Code <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="bank_code"
                rules={[
                  {
                    required: true,
                    message: "Please input your bank_code!",
                  },
                ]}
              >
                <Input className="form-control" type="text" />
              </Form.Item>
            
             
             </div>
            </div>





            <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
              
              
              Branch Location<span className="text-danger">*</span>
              </label>
              <Form.Item
                name="branch_location"
                rules={[
                  {
                    required: true,
                    message: "Please input your branch_location!",
                  },
                ]}
              >
                <Input className="form-control" type="text" />
              </Form.Item>
            
             
             </div>
            </div>





            <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
              
              
              Tax Payer Id<span className="text-danger">*</span>
              </label>
              <Form.Item
                name="tax_payer_id"
                rules={[
                  {
                    required: true,
                    message: "Please input your tax_payer_id!",
                  },
                ]}
              >
                <Input className="form-control" type="text" />
              </Form.Item>
            
             
             </div>
            </div>




          </div>

        
        </div>

        </div>
        </div>

</div>


<div className="col-12">
            <div className="d-flex justify-content-end">
                <div className="d-grid">
                  <div className="d-flex justify-content-end submit_buttom mt-4 w-100">
                    <Form.Item>
                      <Button
                        // loading={isloadingSubmit}
                        {...BUTTON_CONFIGS.SAVE_BUTTON()}
                        htmlType="submit"
                        shape='round'
                        size="small"
                      >
                        Save
                      </Button>
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>



</div>

</Form>






            </div>



     
    </>
  );
};

export default AddStaff;
