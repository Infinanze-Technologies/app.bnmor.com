import create from 'zustand'
import { getRequest } from "@/hooks/apiService";
import { devtools } from "zustand/middleware";

const useCreatePermission = create(
  devtools((set) => ({
    Perm: [],
    loading: false,
    error: null,
    fetch: async (url, jwt) => {
      try {
        set({ loading: true })
        let results = await getRequest(url, jwt)
          .then((res) => {
          //  console.log(res?.data?.data)
            let data2 = res.data?.data?.map(data => {
              set({ loading: false }) 
                  // return data;
             return data;
            })     
            set({ Perm: data2 })
            // return res.data?.data;
          })
          .catch((err) => {
            set({ loading: false, error })
            console.log(err)
          });
        return results;
      } catch (error) {

      }
    },



  })))
export default useCreatePermission;


