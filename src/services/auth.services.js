
import axios from "axios";
import { getApiUrl } from "@/config/getApiUrl";
import { useSession } from "next-auth/react";

class AuthService {
  domain;
  user_id;
  token;
  isLogin;
 
  constructor() {
    this.domain = getApiUrl();
  }

  requestLOGIN(url,user) {
    // console.log('VALUES__', user)

    return axios.post(
      this.domain + url,
      {
        ...user,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
  }
  publicPOST(url, data) {
    // console.log('VALUES__', user)

    return axios.post(
      this.domain + url,
      {
        ...data,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
  }
  getHeaders() {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${this.getToken()}`,
    };
  }

  signout() {
    return this.removeToken();
  }

  loggedIn() {
    const token = this.getToken();
    return !!token;
  }

  requestGET(path) {
    let url = this.domain + path;

    return axios.get(url, {
      headers: this.getHeaders(),
    });
  }

  requestPOST(path, data) {
    return axios.post(this.domain + path, data, {
      headers: this.getHeaders(),
    });
  }

  // getSesion() {
  //   const { data:session } = useSession();
  //   console.log(session.jwt)
  //     return session.jwt

  // }

  requestPUT(path, data) {
    return axios.put(
      this.domain + path,
      {
        ...data,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        Authorization: `Bearer ${this.getSesion()}`,
      }
    );
  }

  // publicPOST(url,data) {
  //   // console.log('VALUES__', user)

  //   return axios.post(this.domain + url, {
  //     ...data
  //   }, {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json"}
  //     }
  //   )
  // }

  requestPATCH(path, data) {
    return axios.patch(this.domain + path, data, {
      headers: this.getHeaders(),
    });
  }

  requestDELETE(path) {
    return axios.delete(this.domain + path, {
      headers: this.getHeaders(),
    });
  }

  getToken() {
    // const { data:session } = useSession();
    //   return session.jwt
  }

  setToken(token) {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
    return true;
  }

  removeToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    return true;
  }
}

export default new AuthService();
