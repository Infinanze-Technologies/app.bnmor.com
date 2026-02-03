 import {Spin } from 'antd';
import { useForm } from "react-hook-form";
import Link from "next/link";
import {PAGE_HOME,PAGE_FORGET_PASSWORD} from "@/config/page-routes";
import { getSession, signIn } from "next-auth/react";
import useToastMessage from "@/hooks/useToastMessage";
import { useRouter } from "next/router";
import { yupResolver } from '@hookform/resolvers/yup';
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import * as Yup from 'yup';
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"

function index(props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
 const validationSchema = Yup.object().shape({
  email: Yup.string()
      .required('Email is required')
      .email('Email is invalid'),
  password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required')
});
const formOptions = { resolver: yupResolver(validationSchema) };
 const { register, handleSubmit, reset, formState } = useForm(formOptions);
 const { errors } = formState;

 const router = useRouter();

 const { toastError } = useToastMessage();

 async function onSubmit(values) {

  try {
    setIsSubmitting(true)
    setLoading(true)
    const res = await signIn("local", {
      ...values,
      redirect: false,
    });  
   
    if (res.ok === true && res.error == null) {
      let session = await getSession(); 
      if (session) {  
      return router.push(PAGE_HOME);
      }
     
    }else if(res.ok === false && res.error != null){
      // console.log(res)
      setIsSubmitting(false)
      setLoading(false)
      return toastError(res.error ?? "Something went wrong.");
    }else{
      // console.log(res)
      setLoading(false)
      return toastError(res.error ?? "Something went wrong.");
    }  
    
  } catch (error) {
    setLoading(false)
    console.log(error)
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
            <h3 className="account-title">Welcome Back</h3>
            <p className="account-subtitle">Sign In To Continue</p>
            <form 
            onSubmit={handleSubmit(onSubmit)}
              className="needs-validation custom-form mt-4 pt-2"
             
            >
              <div className="form-group">
                <label htmlFor="useremail" className="form-label">
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
                    <label htmlFor="userpassword" className="form-label">
                      Password
                    </label>
                  </div>
                  <div className="col-auto">
                  <Link href={PAGE_FORGET_PASSWORD}>
                    <spam className="text-muted forgot-pass-text">
                      Forgot password?
                    </spam>
                    </Link>
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
              <div className="form-group text-center">
                <Button className="btn btn-primary account-btn" type="submit"  disabled={isSubmitting} 
                >
                
            
            {isSubmitting  === false
            ?
            "Login"
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