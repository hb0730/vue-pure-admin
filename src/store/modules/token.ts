import { defineStore } from "pinia";
import { tokenAPI } from "/@/api/token";
import { cookies } from "/@/utils/storage/cookie";
import { warnMessage } from "/@/utils/message";
import { userAPI } from "/@/api/user";
import { router } from "/@/router";
import { db } from "/@/utils/storage/db";
import { optionStore } from "/@/store/modules/option";
import { store } from "/@/store";
import { routeStoreHok } from "./router";
import { initRouter } from "/@/router/utils";

export const tokenStore = defineStore({
  id: "pure-token-store",
  actions: {
    getToken(): string | {} | undefined {
      return cookies.get("token");
    },
    setToken(info: string | undefined) {
      const timeout = optionStore().getTokenTimeout();
      const token = info ? info : "";
      cookies.set("token", token, { expires: timeout.timeout });
    },
    getExpire(): string | {} | undefined {
      return cookies.get("token-expire");
    },
    setExpire(info: string | undefined) {
      const timeout = optionStore().getTokenTimeout();
      const token = info ? info : "";
      cookies.set("token-expire", token, { expires: timeout.maxRefreshTime });
    },
    getUserId(): string | {} | undefined {
      return cookies.get("uuid");
    },
    setUserId(userId: number | undefined) {
      this.userId = userId ? userId : "";
      cookies.set("uuid", userId.toString(), { expires: 30 });
    },
    setRemember(login: { username; password; remember }, remember: boolean) {
      if (remember) {
        db.dbSet({
          dbName: "sys",
          path: "remember",
          value: JSON.stringify(login)
        });
      } else {
        db.dbSet({ dbName: "sys", path: "remember", value: "" });
      }
    },
    getRemember() {
      const user =
        db.dbGet({ dbName: "sys", path: "remember" }) ||
        JSON.stringify({ username: "", password: "", remember: false });
      return JSON.parse(user);
    },
    async login({ username = "", password = "", remember = false } = {}) {
      this.setRemember(
        { username: username, password: password, remember: remember },
        remember
      );
      try {
        const result = await tokenAPI.login(username, password);
        if (result.code === 0) {
          this.setToken(result.data.token);
          this.setExpire(result.data.token);
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
      router.go(0);
      return;
    },
    async refreshToken() {
      const result = await tokenAPI.refresh(this.getExpire() as string);
      if (result.code === 0) {
        this.setToken(result.data.token);
        this.setExpire(result.data.token);
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
      routeStoreHok().clean();
      this.setToken("");
      this.setExpire("");
      this.setUserId("");
      db.dbSet({ dbName: "sys", path: "userInfo", value: "", user: true });
    }
  }
});

export function tokenStoreHok() {
  return tokenStore(store);
}
