import create from 'zustand'
import { getRequest } from "@/hooks/apiService";
import { devtools } from "zustand/middleware";

const useUserPermission = create(
  devtools((set) => ({
    UserPerm: [],
    loading: false,
    error: null,
    fetchUserPerm: async (url,id, jwt) => {
      try {
        set({ loading: true })
        let results = await getRequest(url+`/${id}`, jwt)
          .then((res) => {
            set({ loading: false })            
            set({ UserPerm: res?.data?.data?.items })
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
export default useUserPermission;


