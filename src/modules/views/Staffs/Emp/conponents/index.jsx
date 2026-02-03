import { useEffect, useState } from "react";
import {
  Button,
  Select,
  Form,
  Input,
 Space, Upload, Image, Spin, Skeleton 
} from "antd";
const { Option } = Select;
import { getRequest, updateRequest } from "@/hooks/apiService";
import { URL_ADD_EMPLOYEE, URL_GET_ALL_EMP_ROLES, URL_GET_DEPARTMENT_BY_BRANCH, URL_GET_DESIGNATION_BY_DEPARTMENT, URL_GET_Qry_BRANCH, URL_UPDATE_EMPLOYEE } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import Router from 'next/router'
import moment from 'moment'
import { DatePicker } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import useSelectQuery from "@/hooks/ReactQuery/useSelectQuery";
import useToastMessage from "@/hooks/useToastMessage";
import EditDocument from "./EditDocument";
const dateFormat = 'Y-m-d';

const toBase64 = file =>
new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

const EditStaff = (props) => {
  let {session,SingleEmployeeData,SingleEmployeeDocumentData} = props
  let jwt = session?.jwt;

   let get_cutomer = SingleEmployeeData?.data?.data


   const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
    const [getdob, setGetDob] = useState( moment().format(dateFormat))
        const [getjoinDate, setGetJoinDate] = useState( moment().format(dateFormat))
        const [branchId, setBranchId] = useState(0);
        const [departmentId, setDepartmentId] = useState(0);
        const [getDepartments, setGetDepartments] = useState([]);
        const [getDesignations, setGetDesignations] = useState([]);

        const [isloadingDepartment, setIsloadingDepartment] = useState(false);

        const [isloadingDesignation, setIsloadingDesignation] = useState(false);


        const { toastError } = useToastMessage();

  useEffect(() => {
    try {
      form.setFieldsValue({
        ...get_cutomer,
        ...get_cutomer?.bank,
        role: get_cutomer?.role?.name,
        department: get_cutomer?.department?.name,
        designation: get_cutomer?.designation?.name,
        branch: get_cutomer?.branch?.name
        // department_id: get_cutomer?.department?.id
        // admin_status: record?.admin_status,
      });
      setBranchId(get_cutomer?.branch_id)
      setDepartmentId(get_cutomer?.department_id)
      DepartmentById(get_cutomer?.branch_id)
      DesignationById(get_cutomer?.department_id)
    } catch (error) {
      console.log(error);
    }
  }, [props,SingleEmployeeData,get_cutomer]);

  
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



  const handleChangeBranch = (id) => {

    if(id == 0){
      setGetDepartments([])
      setGetDesignations([])
      form.setFieldsValue({ branch_id: 0 })
      form.setFieldsValue({ department_id: 0 })
      form.setFieldsValue({ designation_id: 0 })
       setBranchId(0)
       setDepartmentId(0)
    }else{
      setBranchId(id)
      DepartmentById(id)
      form.setFieldsValue({ department_id: 0 })
      form.setFieldsValue({ designation_id: 0 })
    }


  }


  const handleChangeDepartment = (id) => {
    if(id == 0){
      setGetDesignations([])
      form.setFieldsValue({ designation_id: 0 })
      //  setDepartmentId(0)
    }else{
      setDepartmentId(id)
      DesignationById(id)
      form.setFieldsValue({ designation_id: 0 })
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
 






  

  return (
    <>
   
  


   <div className="edit-staff-container">
    <div className="page-header">
  <div className="row align-items-center">
    <div className="col">
      {/* <h3 className="page-title">Create Employee </h3> */}
      <ul className="breadcrumb">
        <li className="breadcrumb-item">
          <a href="">View</a>
        </li>
        <li className="breadcrumb-item active">Employee</li>
      </ul>
    </div>
    <div className="col-auto float-end ms-auto">
    <div className='submit-button'>
    <Button
    shape='round'
    onClick={() => Router.back()}
    >
  

    Go Back
  
    </Button>
    
    </div>
   
    </div>
  </div>
</div>


<Form  form={form} name="basic" size="middle">
<Spin spinning={SingleEmployeeData?.loading}>
<div className="row edit-staff-form">


{/* Personal Detail */}

  <div className="col-lg-6 col-md-12 col-lg-12 col-md-12 col-sm-12">
 

  <div className="card card-table flex-fill">
        <div className="card-header">
          <h3 className="card-title mb-0">Personal Detail</h3>
        </div>
        <div className="card-body">
        <div style={{ height:'450px' }}>
        <div className="row px-3">

        {
  SingleEmployeeData?.loading === true &&
  (
    <>
    <Skeleton  />
    </>
  )
}

{
  SingleEmployeeData?.loading === false &&
  (
    <>
      
    <div className="col-lg-6 col-md-6 col-lg-12 col-md-12 col-sm-12">
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


        <div className="col-lg-6 col-md-6 col-lg-12 col-md-12 col-sm-12">
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



          <div className="col-lg-6 col-md-6 col-lg-12 col-md-12 col-sm-12">
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




          <div className="col-lg-6 col-md-6 col-lg-12 col-md-12 col-sm-12">
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



      




 <div className="col-lg-6 col-md-6 col-lg-12 col-md-12 col-sm-12">
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
               <Input className="form-control" type="text" />
              </Form.Item>
            </div>
          </div>

          <div className="col-lg-6 col-md-6 col-lg-12 col-md-12 col-sm-12">
            <div className="form-group custom-select">
              <label className="col-form-label">
               Role <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="role"
                rules={[
                  {
                    required: true,
                    message: "Please select role!",
                  },
                ]}
              >
            <Input className="form-control" type="text" />
              </Form.Item>
            </div>
          </div>


          <div className="col-lg-12 col-md-12 col-sm-12">
            <div className="form-group custom-select">
              <label className="col-form-label">
                 Date Of Birth <span className="text-danger">*</span>
              </label>
              <Form.Item
             name="set_dob"
                // rules={[
                //   {
                //     required: true,
                //     message: "Please input your dob!",
                //   },
                // ]}
              >
                <DatePicker
              onChange={(date, dateString) =>
                            handleChangeDOB(date, dateString)
                            
                          }
                          defaultValue={moment(get_cutomer?.dob)}
                  style={{ width:'100%',height:'50px' }}/>
              </Form.Item>
            </div>
            <Form.Item hidden={true} name="dob">
                      <Input />
                    </Form.Item>
          </div>


    </>
  )
}





        </div>
        
        </div>
        </div>
        </div>


 

  </div>

  {/* Company Detail */}

  <div className="col-lg-6 col-md-12 col-lg-12 col-md-12 col-sm-12">
  <div className="card card-table flex-fill">
        <div className="card-header">
          <h3 className="card-title mb-0">Company Detail</h3>
        </div>
        <div className="card-body">

        <div style={{ height:'450px' }}>
        <div className="row px-3">
{
  SingleEmployeeData?.loading === true &&
  (
   
    <>
    <Skeleton  />
 
    </>
  )
}

{
  SingleEmployeeData?.loading === false &&
  (
    <>
    <div className="col-lg-12 col-md-12 col-sm-12">
    <div className="form-group custom-select">
      <label className="col-form-label">
       Branch <span className="text-danger">*</span>
      </label>
      <Form.Item
        name="branch"
      
      >
      <Input className="form-control" type="text" />
      </Form.Item>
    </div>
  </div>



  <div className="col-lg-12 col-md-12 col-sm-12">
    <div className="form-group custom-select">
      <label className="col-form-label">
      Department <span className="text-danger">*</span>
      </label>

      <Form.Item
        name="department"
     
      >
  <Input className="form-control" type="text" />
      </Form.Item>

    </div>
  </div>



  <div className="col-lg-12 col-md-12 col-sm-12">
    <div className="form-group custom-select">
      <label className="col-form-label">
      Designation <span className="text-danger">*</span>
      </label>

      <Form.Item
        name="designation"
  
      >
  <Input className="form-control" type="text" />
      </Form.Item>
   
   
    </div>
  </div>







  <div className="col-lg-12 col-md-12 col-sm-12">
    <div className="form-group custom-select">
      <label className="col-form-label">
      Date Of Joining <span className="text-danger">*</span>
      </label>
      <Form.Item
     name="set_join_date"
        // rules={[
        //   {
        //     required: true,
        //     message: "Please input your join_date!",
        //   },
        // ]}
      >
        <DatePicker
      onChange={(date, dateString) =>
                    handleChangeJoinDate(date, dateString)
                  }
                  defaultValue={moment(get_cutomer?.join_date)}
          style={{ width:'100%',height:'50px' }}/>
      </Form.Item>
    </div>
    <Form.Item hidden={true} name="join_date">
              <Input />
            </Form.Item>
  </div>


    </>
  )
}










</div>
        </div>

        </div>
        </div>

</div>


{/* Document */}

<div className="col-lg-6 col-md-12 col-lg-12 col-md-12 col-sm-12">
  <div className="card card-table flex-fill">
        <div className="card-header">
          <h3 className="card-title mb-0">Document</h3>
        </div>
        <div className="card-body">

        <div style={{ height:'470px' }}>


        <div className="row px-3">
        {
  SingleEmployeeData?.loading === true &&
  (
    <>
    <Skeleton  />
    </>
  )
}

{
  SingleEmployeeData?.loading === false &&
  (
    <>
   
    <EditDocument session ={session} SingleEmployeeDocumentData={SingleEmployeeDocumentData}/>
   

    </>
  )
}

</div>
</div>
</div>
</div>
</div>




  {/* Bank Account Detail */}

  <div className="col-lg-6 col-md-12 col-lg-12 col-md-12 col-sm-12">
  <div className="card card-table flex-fill">
        <div className="card-header">
          <h3 className="card-title mb-0">Bank Account Detail</h3>
        </div>
        <div className="card-body">

        <div style={{ height:'470px' }}>

    
        <div className="row px-3">


        {
  SingleEmployeeData?.loading === true &&
  (
    <>
    <Skeleton  />
    </>
  )
}

{
  SingleEmployeeData?.loading === false &&
  (
    <>
    <div className="col-lg-6 col-md-6 col-lg-12 col-md-12 col-sm-12">
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


            <div className="col-lg-6 col-md-6 col-lg-12 col-md-12 col-sm-12">
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



            <div className="col-lg-6 col-md-6 col-lg-12 col-md-12 col-sm-12">
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


            <div className="col-lg-6 col-md-6 col-lg-12 col-md-12 col-sm-12">
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





            <div className="col-lg-6 col-md-6 col-lg-12 col-md-12 col-sm-12">
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





            <div className="col-lg-6 col-md-6 col-lg-12 col-md-12 col-sm-12">
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


    </>
  )
}

       


          </div>

        
        </div>

        </div>
        </div>

</div>




</div>
</Spin>
</Form>






            </div>

            <style jsx>{`
              .edit-staff-container {
                padding: 20px;
                background: #f8f9fa;
                min-height: 100vh;
              }

              .edit-staff-form {
                gap: 20px;
              }

              .card {
                margin-bottom: 20px;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                border: 1px solid #e8e9ea;
              }

              .card-header {
                background: linear-gradient(135deg, #4D4D4D 0%, #4347D9 100%);
                color: white;
                border-radius: 12px 12px 0 0;
                padding: 15px 20px;
                border: none;
              }

              .card-title {
                color: white;
                font-weight: 600;
                margin: 0;
                font-size: 1.1rem;
              }

              .card-body {
                padding: 20px;
              }

              .form-group {
                margin-bottom: 20px;
              }

              .col-form-label {
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 8px;
                display: block;
              }

              .text-danger {
                color: #e74c3c !important;
              }

              .form-control {
                border-radius: 8px;
                border: 1px solid #ddd;
                padding: 12px 15px;
                font-size: 14px;
                transition: all 0.3s ease;
                height: auto;
              }

              .form-control:focus {
                border-color: #4D4D4D;
                box-shadow: 0 0 0 2px rgba(95, 99, 242, 0.2);
                outline: none;
              }

              .page-header {
                background: white;
                padding: 20px;
                border-radius: 12px;
                margin-bottom: 20px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              }

              .breadcrumb {
                margin: 0;
                padding: 0;
                background: none;
                font-size: 14px;
              }

              .breadcrumb-item {
                color: #6c757d;
              }

              .breadcrumb-item.active {
                color: #4D4D4D;
                font-weight: 600;
              }

              .submit-button .ant-btn {
                border-radius: 8px;
                font-weight: 600;
                padding: 8px 20px;
                height: auto;
              }

              /* Large screens (1200px and up) */
              @media (min-width: 1200px) {
                .edit-staff-container {
                  padding: 30px;
                }
                
                .edit-staff-form {
                  gap: 25px;
                }
                
                .card-body {
                  padding: 25px;
                }
              }

              /* Medium screens (992px to 1199px) */
              @media (max-width: 1199px) and (min-width: 992px) {
                .edit-staff-container {
                  padding: 25px;
                }
                
                .edit-staff-form {
                  gap: 20px;
                }
                
                .card-body {
                  padding: 22px;
                }
              }

              /* Tablet screens (768px to 991px) */
              @media (max-width: 991px) and (min-width: 768px) {
                .edit-staff-container {
                  padding: 20px;
                }
                
                .edit-staff-form {
                  gap: 18px;
                }
                
                .card-body {
                  padding: 20px;
                }
                
                .card-header {
                  padding: 12px 18px;
                }
                
                .card-title {
                  font-size: 1rem;
                }
              }

              /* Mobile screens (576px to 767px) */
              @media (max-width: 767px) and (min-width: 576px) {
                .edit-staff-container {
                  padding: 15px;
                }
                
                .edit-staff-form {
                  gap: 15px;
                }
                
                .card-body {
                  padding: 18px;
                }
                
                .card-header {
                  padding: 10px 15px;
                }
                
                .card-title {
                  font-size: 0.95rem;
                }
                
                .form-control {
                  padding: 10px 12px;
                  font-size: 13px;
                }
                
                .page-header {
                  padding: 15px;
                }
              }

              /* Small mobile screens (below 576px) */
              @media (max-width: 575px) {
                .edit-staff-container {
                  padding: 12px;
                }
                
                .edit-staff-form {
                  gap: 12px;
                }
                
                .card-body {
                  padding: 15px;
                }
                
                .card-header {
                  padding: 8px 12px;
                }
                
                .card-title {
                  font-size: 0.9rem;
                }
                
                .form-control {
                  padding: 8px 10px;
                  font-size: 12px;
                }
                
                .page-header {
                  padding: 12px;
                }
                
                .breadcrumb {
                  font-size: 12px;
                }
                
                .submit-button .ant-btn {
                  padding: 6px 15px;
                  font-size: 12px;
                }
              }

              /* Touch device improvements */
              @media (hover: none) and (pointer: coarse) {
                .form-control:focus {
                  border-color: #4D4D4D;
                  box-shadow: 0 0 0 2px rgba(95, 99, 242, 0.2);
                }
                
                .submit-button .ant-btn:active {
                  transform: scale(0.98);
                }
              }
            `}</style>

     
    </>
  );
};

export default EditStaff;
