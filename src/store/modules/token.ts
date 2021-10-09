import { defineStore } from "pinia";
import { tokenAPI } from "/@/api/token";
import { cookies } from "/@/utils/storage/cookie";
import { warnMessage } from "/@/utils/message";

interface TokenState {
  token?: string;
  expire: number;
}

export const tokenStore = defineStore({
  id: "pure-token-store",
  state: (): TokenState => ({
    token: undefined,
    expire: -1
  }),
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : "";
      cookies.set("token", info);
    },
    setExpire(expire: string | undefined) {
      this.expire = expire ? Date.parse(expire) : -1;
      cookies.set("token-expire", this.expire);
    },
    async login({ username = "", password = "" } = {}) {
      try {
        const result = await tokenAPI.login(username, password);
        if (result.code === 0) {
          this.setToken(result.data.token);
          this.setExpire(result.data.expire);
        } else {
          warnMessage(result.msg);
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async logout() {
      return tokenAPI.logout();
    },
    async refreshToken() {
      const result = await tokenAPI.refresh();
      if (result.code === 0) {
        this.setToken(result.data.token);
        this.setExpire(result.data.expire);
      }
    },
    async afterLoginAction() {}
  }
});

export function tokenStoreHok() {
  return tokenStore();
}
