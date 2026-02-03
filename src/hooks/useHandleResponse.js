import { PAGE_LOGIN } from "@/config/page-routes";
import { signOut } from "next-auth/react";
import React from "react";
import useToastMessage from "./useToastMessage";

export default function useHandleResponse() {
  const { toastError, toastSuccess } = useToastMessage();
 



  const handleRequestError = (err) => {
    try {
        console.log(err)
      if (!err.response) {
         toastError("request-network-error");
        throw err
      } else {
      
        if (err?.response?.status == 401) {
          toastError(err?.response?.data?.error);
          signOut({
            redirect: PAGE_LOGIN
          })
          
        }else if (err?.response?.status  == 404){
          toastError("Route Not found");
          throw err
        }

        // console.log(err?.response?.data)

        toastError(err?.response?.data?.error ?? err?.response?.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  
  const handleRequestResponse = (res) => {
    let  message  = res?.data?.message ?? res?.data?.error;
    toastSuccess(message);
  };

  return {handleRequestError,handleRequestResponse };
}
