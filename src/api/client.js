import axios from "axios";

// The BFF gateway (see the companion sso-gateway-bff project) sits in front of this API
// and relays an OAuth2 session cookie, so requests never carry a bearer token directly —
// the browser only ever holds a same-site session cookie.
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // The gateway returns 401 once the session cookie is gone or expired; bounce back
    // to sign-in rather than showing a broken screen full of failed requests.
    if (error.response && error.response.status === 401) {
      window.location.href = "/sign-in";
    }
    return Promise.reject(error);
  }
);

export default api;
