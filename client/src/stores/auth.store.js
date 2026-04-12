import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    error: null,
    token: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    async register(data) {
      try {
        const response = await axios.post(
          "http://localhost:3000/auth/register",
          data,
          { withCredentials: true }
        );

          console.log("Register response:", response.data.user); 
          this.user = response.data.user;
          this.token = response.data.token;
          this.error = null;
          
          localStorage.setItem("user", JSON.stringify(this.user));
          localStorage.setItem("token", this.token);
       
      } catch (err) {
        this.error = err.response?.data?.message || "Registration failed";
        throw err;
      }
    },
    async signIn(data) {
      try {
        const response = await axios.post(
          "http://localhost:3000/auth/login",
          data,
           { withCredentials: true }
        );
        const { user, token } = response.data;
        this.user = user;
        this.token = token;
        this.error = null;
        
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
      } catch (err) {
        this.user = null;
        this.token = null;
        this.error = err.response?.data?.message || "Login failed";
        throw new Error(this.error);
      }
    },
    async loadUser() {
      const stored = localStorage.getItem("user");
      const token = localStorage.getItem("token");
     
       if (stored && stored !== "undefined") {
        try {
          this.user = JSON.parse(stored);
          this.token = token;
        } catch {
          this.user = null;
          this.token = null;
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      }
    },
    async logout() {
      try {       
        const response = await axios.post(
        "http://localhost:3000/auth/logout",
        {},
        { 
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        }
      );
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      this.user = null;
      this.token = null;
    }catch (e) {
      console.log(e)
    }
    },
    async refreshToken() {
      try {
        const response = await axios.post(
          "http://localhost:3000/auth/refresh-token",
          {},
          { withCredentials: true }
        );
        this.token = response.data.accessToken;
        localStorage.setItem("token", this.token);
        this.error = null;
        return this.token;
      } catch (err) {
        this.token = null;
        this.user = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        this.error = err.response?.data?.message || "Token refresh failed";
        throw new Error(this.error);
      }
    },
  },
});
