import { useEffect, useState } from 'react'
import { getApiUrl } from "@/config/getApiUrl";
import axios from "axios";
// import { useSession } from 'next-auth/react'

export default function useGetSingleEntity(props) {
  let domain = getApiUrl()
  let { url, id,jwkToken } = props

  

  // const dispatch = useDispatch();
  useEffect(() => {
    refetchEntity()
  }, [url, id,jwkToken])

  useEffect(() => {
    refetchEntity()
  }, [id])

  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const refetchEntity = async () => {
    try {
  
      if (id) {
        
        setLoading(true)
        await axios
          .get(domain + url + '/' + id, {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${jwkToken}`,
            },
          })
          .then((res) => {
            setData({ ...res?.data })
          })
          .catch((err) => console.log(err))
          .finally((err) => setLoading(false))
      } else {
      }
    } catch (error) {
      setError(error)
      console.log(error)
    }
  }

  return {
    loading: loading,
    refetchEntity: refetchEntity,
    data,
    error,
  }
}



