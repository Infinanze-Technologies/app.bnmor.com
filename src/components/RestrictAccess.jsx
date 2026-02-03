import { URL_SHOW_USERS_PERMISSIONS } from '@/config/api-paths';
import useUserPermission from '@/store/UserPermissionStore';
import { useEffect } from 'react'

export default function RestrictApp  ({role_id,jwt})  {
    const {fetchUserPerm,UserPerm,loading,error }  = useUserPermission((state) => state)
    useEffect(() => {
      fetchUserPerm(URL_SHOW_USERS_PERMISSIONS,role_id,jwt)
   
     }, []);
    // console.log(props?.user?.role_id)
    
   
     const get_roles = UserPerm?.permissions?.map((perm) => {
      return perm.name
    });
   
    return {
        get_roles,
        UserPerm,
        loading,
        error 
    };
 
}

