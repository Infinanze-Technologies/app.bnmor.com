import { useEffect, useState } from 'react'
import axios from 'axios'
import { getApiUrl } from '@/config/getApiUrl'

export default function useGetEntity({ url,jwkToken }) {
  const [isloading, setLoading] = useState(true);
  const [data, setData] = useState({});
  let domain = getApiUrl()

  
  useEffect(() => {
    refetchEntity();
  }, [url,jwkToken]);

  const refetchEntity = async () => {
    try {
      if(url){
        setLoading(true);
        await axios.get(domain + url,
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${jwkToken}`
              }
            }
            )
            .then((res) => {
              setData({ ...res?.data });
            })
            .catch((err) => console.log(err))
            .finally((err) => setLoading(false));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    loading: isloading,
    refetchEntity: refetchEntity,
    data,
  };
}
