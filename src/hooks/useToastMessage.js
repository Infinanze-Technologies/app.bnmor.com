import React from "react";
import toast from "react-hot-toast";

export default function useToastMessage() {
  const toastError = (message) => {
    toast.error(message);
  };

  const toastSuccess = (message) => {
    toast.success(message, {
        duration: 5000,
    });
  };

  // const customTast = () => {
  //   toast.promise(
  //     saveSettings(settings),
  //      {
  //        loading: 'Saving...'
  //      }
  //    );
  // }

  return {
    toastError,
    toastSuccess,
   
  };
}


