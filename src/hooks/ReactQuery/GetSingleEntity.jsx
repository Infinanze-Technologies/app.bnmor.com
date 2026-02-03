import { useEffect, useState } from 'react'
import axios from 'axios'
import { getApiUrl } from '@/config/getApiUrl'

export default function GetSingleEntity({ url,jwt,id }) {
  const [isloading, setLoading] = useState(true);
  const [data, setData] = useState({});
  let domain = getApiUrl()

  
  useEffect(() => {
    refetchEntity();
  }, [url,jwt,id]);

  const refetchEntity = async () => {
    try {
      if(url){
        setLoading(true);
        await axios.get(domain + url + `/${id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${jwt}`
              }
            }
            )
            .then((res) => {
              setData({ ...res?.data })
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
