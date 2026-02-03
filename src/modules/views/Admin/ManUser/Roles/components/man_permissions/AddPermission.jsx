import { useEffect, useState } from "react";
import { Form, Input, Button,Select,Checkbox} from "antd";
import useCreatePermission from "@/store/AllPermissionStore";
import { postRequest } from "@/hooks/apiService";
import { URL_CREATE_PERMISSIONS } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";

function AddPermission(props) {
    const {record,RoleWithPermissionsDataObject,jwt,setIsModalVisible} = props;
    const {Perm,loading }  = useCreatePermission((state) => state)
       const { handleRequestError,handleRequestResponse} = useHandleResponse()

    useEffect(() => {
        try {
          form.setFieldsValue({
            ...record,
          });
        } catch (error) {
          console.log(error);
        }
      }, [record]);

    //  console.log(record)

    const [form] = Form.useForm();
    const [isloadingSubmit, setIsloadingSubmit] = useState(false);
  
    const onFinish = (values) => {
      try {
          const data = {
              name : record?.id,
              permission : values.permission
          }
     
      
        console.log(data);
        // return false;
        // setIsloadingSubmit(true);
     
        postRequest(URL_CREATE_PERMISSIONS,{...data},jwt)
        .then((res) => {
          setIsloadingSubmit(false);
          handleRequestResponse(res)
          RoleWithPermissionsDataObject.refetchEntity();
          setIsModalVisible(false);
        }).finally(() => {
            setIsloadingSubmit(false);
        })
        .catch((err) => {
          handleRequestError(err);
        
          
        });
  
      } catch (error) {
        console.log(error);
      }
    };



      function onChange(checkedValues) {
        // console.log('checked = ', checkedValues);
      }

    return (
        <div className="users_form">
        <Form onFinish={onFinish} form={form} name="basic" size="middle">
          <div className="row">
            <div className="col-12">
            <div className="form-group custom-select">
              <label forHtml="">Role Name</label>
              <Form.Item
                name="name"
              >
              <Input 
                className="form-control"
                disabled
                defaultValue={record?.name}
              />
                   {/* <Select 
                   defaultValue={record?.name}
              style={{ width: 200 }} 
              disabled
              className="form-control"
            >
            
              
          <Option  value={record?.id} >{record?.name}</Option>
                
           
            </Select> */}
              </Form.Item>
            </div>
            </div>

            {/* <div className="form-group custom-select">
              <label className="col-form-label">
                First Name <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="first_name"
                rules={[
                  {
                    required: true,
                    message: "Please input your first_name!",
                  },
                ]}
              >
                <Input className="form-control" type="text" />
              </Form.Item>
            </div> */}

            <div className="col-md-12">
            <Form.Item name="permission">
            
            <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
                
    <div className="row">
  
        {Perm?.map((item,index) =>{
            
        

return (
    <>
<div className="col-12 mb-3 mt-3" key={index}>
    <div  style={{ color : "#0E0E0E", fontWeight: "bold"}}>
 
    {`${item?.m_name === 'Requests' ? 'Book Requests' : item?.m_name === 'Requests' ? 'Book Circulations' : item?.m_name  }`}   
    </div>
 
   
    </div>

  

    {
        item?.permission?.map(ele =>  
            // {console.log(ele)}
            <>
            <div className="col-md-3 mb-1" key={ele?.id}>
        <Checkbox value={ele?.id}>{ele?.name}</Checkbox>
      </div>
      </>
         

        )
    }
    

</>

      )


        
        })}
     
    </div>


    </Checkbox.Group>
  </Form.Item>
            </div>

          
          
          </div>
  
          <div className="row mt-3">
            <div className="col-8"></div>
            <div className="col-4">
              <div className="d-flex justify-content-end save_btn mt-4">
                <Form.Item>
                  <Button
                    loading={isloadingSubmit}
                    type="primary"
                    htmlType="submit"
                  >
                    Save
                  </Button>
                </Form.Item>
              </div>
            </div>
          </div>

        </Form>
      </div>
    )
}
export default AddPermission