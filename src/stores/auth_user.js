import { defineStore } from "pinia";

export const useAuthUserStore = defineStore("auth_user", {
  state: () => {
    const authUser = localStorage.getItem("auth_user");
    const api_token = localStorage.getItem("api_token");
    return {
      user: authUser ? JSON.parse(authUser) : null,
      api_token: api_token ?? null,
    };
  },
  getters: {
    checkUserIsSigned: (state) => !!state.api_token,
    getAuthUser: (state) => state.user,
    getApiToken: (state) => state.api_token,
  },
  actions: {
    setAuthUser(payload) {
      this.user = payload;
      
      if (payload) {
        localStorage.setItem("auth_user", JSON.stringify(payload));
      } else {
        localStorage.removeItem("auth_user");
      }
    },
    setApiToken(payload) {
      this.api_token = payload;

      if (payload) {
        localStorage.setItem("api_token", payload);
      } else {
        localStorage.removeItem("api_token");
      }
    },
  },
});
