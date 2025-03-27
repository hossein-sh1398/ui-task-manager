import axios from "axios";
import { useAuthUserStore } from "../stores/auth_user";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});
api.interceptors.request.use(
  function (config) {
    const authUserStore = useAuthUserStore();

    if (authUserStore.checkUserIsSigned) {
      config.headers.Authorization = "Bearer " + authUserStore.getApiToken;
    }

    return config;
  },
  (err) => new Promise.reject(err)
);

api.interceptors.response.use(
  (res) => res,
  (err) => {
    return Promise.reject(err);
  }
);

export default api;
