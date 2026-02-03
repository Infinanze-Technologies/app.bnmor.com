import { getApiUrl } from "@/config/getApiUrl";
import axios from "axios";


export const getRequest = async (url,jwt) => {
  let api_url = getApiUrl();
  return axios.get(api_url + url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  }).catch(err => console.log(err));
};

export const postRequest = async (url,data,jwt) => {
  let api_url = getApiUrl();
  return await axios.post(api_url + url,data, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });
};



export const updateRequest = async (url,id,data,jwt) => {
  let api_url = getApiUrl();
  return axios.put(api_url + url +`/${id}`,data, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });
};


export const deleteRequest = async (url,id,jwt) => {
  let api_url = getApiUrl();
  return axios.delete(api_url + url + `/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });
};
