const getApiUrl = () => {
    try {
      
      let url
      if(process.env.NODE_ENV === 'development') {
          url = process.env.NEXT_PUBLIC_API_URL
        }
        
        if(process.env.NODE_ENV === 'production') {
          url = process.env.NEXT_PUBLIC_API_URL
        }
   return url
    } catch (error) {
      console.log(error)
    }
  }
  
  
  export  {getApiUrl};