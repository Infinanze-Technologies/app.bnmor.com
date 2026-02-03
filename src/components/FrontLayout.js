
import React,{ useEffect, useState } from "react";

export default function FrontLayout({ children }) {



    return (
        <>

                {/* <div className="col-lg-12 login-auto">  */}
                <div className="col-lg-12 super_container"> 

                    {children}

                </div>
            


        </>
    )
}
