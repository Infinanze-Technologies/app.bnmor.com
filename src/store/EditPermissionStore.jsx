import create from 'zustand'
import { getRequest } from "@/hooks/apiService";
import { devtools } from "zustand/middleware";

const useEditPermission = create(
  devtools((set) => ({
    Permz: [],
    loading: false,
    error: null,
    fetchPerm: async (url, jwt) => {
      try {
        set({ loading: true })
        let results = await getRequest(url, jwt)
          .then((res) => {
            set({ loading: false }) 
            // console.log('hoo') 
            // let dataObject = res?.data?.data?.items?.map(item => {
            //  
            //  return item;
            // })  
           
            set({ Permz: res?.data?.data })
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
export default useEditPermission;


