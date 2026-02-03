import {Spin } from 'antd';
import { useForm } from "react-hook-form";
import Link from "next/link";
import {PAGE_LOGIN,PAGE_FORGET_PASSWORD} from "@/config/page-routes";
import { getSession, signIn } from "next-auth/react";
import useToastMessage from "@/hooks/useToastMessage";
import { useRouter } from "next/router";
import { yupResolver } from '@hookform/resolvers/yup';
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { postRequest } from "@/hooks/apiService";
import * as Yup from 'yup';
import { useEffect, useState } from "react";
import { URL_FORGOT_PASSWORD} from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";

function index(props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
 const validationSchema = Yup.object().shape({
  email: Yup.string()
      .required('Email is required')
      .email('Email is invalid')
});
const formOptions = { resolver: yupResolver(validationSchema) };
 const { register, handleSubmit, reset, formState } = useForm(formOptions);
 const { errors } = formState;
 const { toastError } = useToastMessage();
 const router = useRouter();
 const { handleRequestError,handleRequestResponse} = useHandleResponse()



const  onSubmit = (values,e) => {
  e.preventDefault();
  try {
    setIsSubmitting(true)
      postRequest(URL_FORGOT_PASSWORD,{...values},'')
      .then((res) => {
        handleRequestResponse(res)
        setIsSubmitting(false)
        reset();
      }).finally(() => {
        setIsSubmitting(false)
      })
      .catch((err) => {
        // handleRequestError(err);
        return toastError(err?.response?.data?.message?? "Something went wrong.");
        // console.log(err?.response?.data?.message)
        setIsSubmitting(false)
        // 

            
      });


  } catch (error) {
    setLoading(false)
    // console.log(error)
    setIsSubmitting(false)
  }
}

  return (<>

<div className="account-page">
  <div className="main-wrapper">
    <div className="account-content">
      <div className="container">



    
        <div className="account-box">
          <div className="account-wrapper">
            <h3 className="account-title">Forgot Password</h3>
            <p className="account-subtitle">Enter Your registered email to reset your password.</p>
            <form 
            onSubmit={handleSubmit(onSubmit)}
              className="needs-validation custom-form mt-4 pt-2"
             
            >
              <div className="form-group">
                {/* <label htmlFor="useremail" className="form-label">
                  Email
                </label> */}
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="email"
                  placeholder="Enter email"
                  {...register('email')}
                />
                <div className="invalid-feedback">{errors.email?.message}</div>
              </div>
             
              <div className="form-group text-center">
                <Button className="btn btn-primary account-btn" type="submit"  disabled={isSubmitting} 
                >
                
            
            {isSubmitting  === false
            ?
            "Reset Password"
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

              <div className="col-auto">
                  <Link href={PAGE_LOGIN}>
                    <spam className="text-muted signIn-text">
                    Return to signIn
                    </spam>
                    </Link>
                  </div>

            </form>
          </div>
        </div>



      </div>
    </div>
  </div>
</div>



  </>);
}

export default index;