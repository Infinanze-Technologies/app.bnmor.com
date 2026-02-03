import React from 'react'
import Image from "next/image";
import { Empty } from 'antd';
const ViewImages = (props) => {
  let {record} = props
  console.log(record?.pro_images)
  let tableData = record?.pro_images;
  let localimagPath = process.env.NEXT_PUBLIC_PUBLIC_IMAGES;
  return (
    <>

<div className="row">
<div className="col-md-12">
<div className="row">

{
 tableData?.length == 0 ?
 (<>
     <Empty/>
 </>)
 :
 (
     <>
     {tableData?.map((data,index) => 

<div className="col-md-4" key={index}>
   <div className="row">
    <div className="col-12"> 
    <div className="pro_img_list">
               <div className="pro_img">

<Image
             
             layout="fill"  
             objectFit='contain'
             placeholder='blur'
             blurDataURL={localimagPath+data?.pro_image}
             src={localimagPath+data?.pro_image} />
</div>

</div>
</div>
        
</div>           

        
          
      </div>
    
)}
     </>
 )

}


</div>
    </div>
    
</div>
    </>
  )
}

export default ViewImages