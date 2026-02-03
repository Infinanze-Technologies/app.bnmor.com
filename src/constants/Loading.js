import React from 'react'
import Lottie from 'react-lottie';
import * as loading from './spinner.json'

function Loading() {

    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: loading.default,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
      };

    return (
        <div className='col-12'>
    <p style={{ textAlign : "center" }}>

    <Lottie options={defaultOptions}
              height={100}
              width={100}
           />
    </p>
    
  </div>
    )
}

export default Loading
