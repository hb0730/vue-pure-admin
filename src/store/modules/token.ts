import { defineStore } from "pinia";
import { tokenAPI } from "/@/api/token";
import { cookies } from "/@/utils/storage/cookie";
import { warnMessage } from "/@/utils/message";
import { userAPI } from "/@/api/user";
import { initRouter, router } from "/@/router";
import { db } from "/@/utils/storage/db";
import dayjs from "dayjs";

interface TokenState {
  userId?: number;
  token?: string;
  expire: number;
}

export const tokenStore = defineStore({
  id: "pure-token-store",
  state: (): TokenState => ({
    userId: undefined,
    token: undefined,
    expire: -1
  }),
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : "";
      cookies.set("token", info, { expires: 30 });
    },
    setExpire(expire: string | undefined) {
      this.expire = expire ? dayjs(expire).valueOf() : -1;
      cookies.set("token-expire", this.expire + "", { expires: 365 });
    },
    setUserId(userId: number | undefined) {
      this.userId = userId ? userId : "";
      cookies.set("uuid", userId.toString(), { expires: 30 });
    },
    async login({ username = "", password = "" } = {}) {
      try {
        const result = await tokenAPI.login(username, password);
        if (result.code === 0) {
          this.setToken(result.data.token);
          this.setExpire(result.data.expire);
          return this.afterLoginAction();
        } else {
          warnMessage(result.msg);
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async logout() {
      await tokenAPI.logout();
      await this.afterLogoutAction();
      router.push("/login");
      initRouter();
      return;
    },
    async refreshToken() {
      const result = await tokenAPI.refresh();
      if (result.code === 0) {
        this.setToken(result.data.token);
        this.setExpire(result.data.expire);
      } else {
        warnMessage("登录失效重新登录");
        setTimeout(() => {
          this.logout();
        }, 3000);
      }
    },
    async afterLoginAction() {
      const userInfo = await userAPI.currentInfo();
      //注销
      if (userInfo.code != 0) {
        return this.logout();
      }
      this.setUserId(userInfo.data.id);
      db.dbSet({
        dbName: "sys",
        path: "userInfo",
        value: JSON.stringify(userInfo.data),
        user: true
      });

      router.push("/");
      initRouter();
    },
    async afterLogoutAction() {
      this.setToken("");
      this.setExpire("");
      this.setUserId("");
      db.dbSet({ dbName: "sys", path: "userInfo", value: "", user: true });
    }
  }
});

export function tokenStoreHok() {
  return tokenStore();
}
