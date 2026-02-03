import { Image } from "antd";
import { useEffect, useState } from "react";


const ViewDocument = (props) => {
  const {record,fileType } = props;

  let public_path = process.env.NEXT_PUBLIC_PUBLIC_IMAGES
  useEffect(() => {
    try {
    
    } catch (error) {
      console.log(error);
    }
  }, [record,props]);
  // console.log('====================================');
  // console.log(public_path);
  // console.log('====================================');
  // console.log('====================================');
  // console.log(props);
  // console.log('====================================');
 return (
    <>

        <div className="row">

        <div className="view-profile-card">
        {
            fileType == 'profile'

            &&

            (
                <>


                <div className="col-sm-12 d-flex justify-content-center">
<Image

width='250px'
height='250px'
placeholder='blur'
blurDataURL={public_path+record?.profile}
src={public_path+record?.profile}
 alt={fileType}/>
</div>


                </>
            )
        }


        {
            fileType == 'certificate'

            &&

            (
                <>

                <div className="col-sm-12">
        <object
                          data={public_path+record?.certificate}
                          type="application/pdf"
                          width="100%"
                          height="600px"
                        >
                          <p>
                            Alternative text - include a link{' '}
                            <a href={public_path+record?.certificate}>to the PDF!</a>
                          </p>
                        </object>   

                        </div>

                </>
            )
        }

      

        {
            fileType == 'resume'

            &&

            (
                <>

                <div className="col-sm-12">
        <object
                          data={public_path+record?.resume}
                          type="application/pdf"
                          width="100%"
                          height="600px"
                        >
                          <p>
                            Alternative text - include a link{' '}
                            <a href={public_path+record?.resume}>to the PDF!</a>
                          </p>
                        </object>   

                        </div>

                </>
            )
        }


    



               
        </div>



        </div>
   
    </>
  );
};

export default ViewDocument;
