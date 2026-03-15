import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api"    //creating an instance of axios with baseURL as our backend API URL
});

api.interceptors.request.use(config => {     //acts as a middleware for all outgoing requests, allowing us to modify the request config before it is sent to the server
    const token = localStorage.getItem("token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {

    if (error.response && error.response.status === 401) {

      localStorage.removeItem("token");

      window.location.href = "/login";    //cannot use navigate here because this is outside of a React component, so we use window.location.href to redirect to login page on 401 Unauthorized response from backend, which indicates that the user's token is invalid or expired, so we log them out and send them back to login page to get a new token

    }

    return Promise.reject(error);
  }
);

export default api;


/*Without this file(interceptor), every request would look like:

axios.get("/contacts", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});

That would be repeated everywhere.
Instead we centralize it in one place.

Login
  ↓
Save token in localStorage
  ↓
Axios interceptor
  ↓
Automatically attach token
  ↓
Backend verifies user

*/