import {Spin } from 'antd';
import { useForm } from "react-hook-form";
import Link from "next/link";
import {PAGE_LOGIN} from "@/config/page-routes";
import { getSession, signIn } from "next-auth/react";
import useToastMessage from "@/hooks/useToastMessage";
import { useRouter } from "next/router";
import { yupResolver } from '@hookform/resolvers/yup';
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import * as Yup from 'yup';
import { useEffect, useState } from "react";
import { postRequest } from "@/hooks/apiService";
import { URL_RESET_PASSWORD} from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";

function index(props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
 const validationSchema = Yup.object().shape({
  email: Yup.string()
      .required('Email is required')
      .email('Email is invalid'),
      password: Yup.string()
      .required("Please Enter your password")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
  ),
  confirmPassword: Yup.string()
  .oneOf([Yup.ref('password'), null], 'Passwords must match')
  
});
const formOptions = { resolver: yupResolver(validationSchema) };
 const { register, handleSubmit, reset, formState } = useForm(formOptions);
 const { errors } = formState;
 const { handleRequestError,handleRequestResponse} = useHandleResponse()
 const { toastError } = useToastMessage();
 const router = useRouter();

 const { token } = router.query;
//  console.log(token)


 const  onSubmit = (values,e) => {
  e.preventDefault();
  let data = {
    email : values?.email,
    password : values?.password,
    token : token
  }
  try {
    setIsSubmitting(true)
    setLoading(true)
      postRequest(URL_RESET_PASSWORD,{...data},'')
      .then((res) => {
        handleRequestResponse(res)
        router.push(PAGE_LOGIN);
        setIsSubmitting(false)
        reset()
       
      }).finally(() => {
        setIsSubmitting(false)
       
      })
      .catch((err) => {
        // handleRequestError(err);
        setIsSubmitting(false)
        setLoading(false)
        // console.log(err?.response?.data?.message)
        return toastError(err?.response?.data?.message?? "Something went wrong.");
       
       
        // 

            
      });


  } catch (error) {
    setLoading(false)
    setIsSubmitting(false)
  }
}


  return (<>

<div className="account-page">
  <div className="main-wrapper">
    <div className="account-content">
      <div className="container">


  
      <Spin spinning={loading}>
        <div className="account-box">
          <div className="account-wrapper">
            <h3 className="account-title">Reset Password</h3>
            {/* <p className="account-subtitle">Access to our dashboard</p> */}
            <form 
            onSubmit={handleSubmit(onSubmit)}
              className="needs-validation custom-form mt-4 pt-2"
             
            >

<div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="useremail"
                  placeholder="Enter email"
                  {...register('email')}
                />
                <div className="invalid-feedback">{errors.email?.message}</div>
              </div>

             
              <div className="form-group">
                <div className="row">
                  <div className="col">
                    <label htmlFor="password" className="form-label">
                     New Password
                    </label>
                  </div>
                 
                </div>
                <div className="position-relative">
                  <input
                    type={showPass === true ? "text" : "password"}
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    placeholder="Enter password"
                    {...register('password')} 
                    
                  />
                  
                  <div className="invalid-feedback">{errors.password?.message}</div>
                  <span className={showPass === true ? "fa fa-eye" : "fa fa-eye-slash"} id="toggle-password"  onClick={() => setShowPass(!showPass)}/>
                </div>
              </div>

              <div className="form-group">
                <div className="row">
                  <div className="col">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confrim Password
                    </label>
                  </div>
                 
                </div>
                <div className="position-relative">
                  <input
                    type={showPass === true ? "text" : "password"}
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    id="confirmPassword"
                    placeholder="Enter password"
                    {...register('confirmPassword')} 
                    
                  />
                  
                  <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                  <span className={showPass === true ? "fa fa-eye" : "fa fa-eye-slash"} id="toggle-password"  onClick={() => setShowPass(!showPass)}/>
                </div>
              </div>
              <div className="form-group text-center">
                <Button className="btn btn-primary account-btn" type="submit"  disabled={isSubmitting} 
                 isloading={isSubmitting}
                >
                
            
            {isSubmitting  === false
            ?
            "Reset"
:
            (
              <>
              
              <Spinner
               animation="grow" 
               role="status"
               aria-hidden="true"
               variant="light" />
        
              </>
            )
              }
                  
                </Button>
              </div>
            </form>
          </div>
        </div>
</Spin>


      </div>
    </div>
  </div>
</div>



  </>);
}

export default index;