import React from 'react'
import Lottie from 'react-lottie';
import * as loading from './waiting.json'

function Loading() {

    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: loading,
        // rendererSettings: {
        //   preserveAspectRatio: 'xMidYMid slice'
        // }
      };

    return (
        <div className='col-12'>
    <p style={{ textAlign : "center" }}>

    <Lottie options={defaultOptions}
              width={'18rem'}
      height={'18rem'}
           />
    </p>
    
  </div>
    )
}

export default Loading
