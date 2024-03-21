import router from "@/router";
import {
  login_service
} from "@/services/auth";
import {
  defineStore
} from "pinia";
// auth store

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: null,
    results: null,
    btnLoading: false,
    error_message: null,
    is_error: false,
  }),

  getters: {
    isLoggedIn: (state) => !!state.accessToken,
  },

  actions: {
    async submitLogin({
      email,
      password,
    }) {
      this.btnLoading = true;
      // login

      let response = await login_service({
        email,
        password,
      });

      if (response.error === false) {
        localStorage.setItem("accessToken", response.results.token);
        localStorage.setItem("results", JSON.stringify(response.results));
        this.accessToken = response.results.token;
        this.results = response.results;
        this.btnLoading = false;
        router.push("/");
        this.is_error = false;
      } else {
        this.error_message = response.message;
        this.btnLoading = false;
        this.is_error = true;
      }
    },
    logout() {
      // logout logic
    },
  },
});
