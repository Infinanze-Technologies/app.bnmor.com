import { useCallback } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { getApiUrl } from "@/config/getApiUrl";
import useHandleResponse from "./useHandleResponse";

export default function useFormRequest() {
  const { data: session } = useSession();
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const baseURL = getApiUrl();

  // 🧠 Get JWT token (from session or localStorage)
  const token = session?.user?.jwt || session?.jwt || localStorage.getItem("jwt");

  // 🛠 Generic request function
  const sendRequest = useCallback(
    async (method, url, data = null, customToken) => {
      const jwt = customToken || token;
      const config = {
        method,
        url: baseURL + url,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: jwt ? `Bearer ${jwt}` : undefined,
        },
        data,
      };

      try {
        const res = await axios(config);
        handleRequestResponse(res);
        return res.data;
      } catch (err) {
        handleRequestError(err);
        throw err;
      }
    },
    [baseURL, token, handleRequestError, handleRequestResponse]
  );

  // 🧩 Individual helpers
  const postRequest = (url, data, jwt) => sendRequest("POST", url, data, jwt);
  const putRequest = (url, data, jwt) => sendRequest("PUT", url, data, jwt);
  const patchRequest = (url, data, jwt) => sendRequest("PATCH", url, data, jwt);
  const deleteRequest = (url, jwt) => sendRequest("DELETE", url, null, jwt);

  return {
    postRequest,
    putRequest,
    patchRequest,
    deleteRequest,
    sendRequest, // optional generic export
  };
}
