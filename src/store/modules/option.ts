import { defineStore } from "pinia";
import { Timeout } from "/@/api/model/token";
import { optionAPI } from "/@/api/option";
import { db } from "/@/utils/storage/db";

export const optionStore = defineStore({
  id: "pure-option-db",
  actions: {
    async storagePasswordPublicKey() {
      const result = await optionAPI.find<string>("yml", "password.publicKey");
      if (result.code === 0) {
        db.dbSet({
          dbName: "sys",
          path: "password",
          value: result.data,
          user: false
        });
      }
    },
    getPasswordPublicKey(): string {
      return db.dbGet({
        dbName: "sys",
        path: "password",
        defaultValue: "",
        user: false
      });
    },
    getTokenTimeout(): Timeout {
      const defaultValue: Timeout = {
        timeout: 1,
        maxRefreshTime: 2
      };
      const timeout = db.dbGet({
        dbName: "sys",
        path: "timeout",
        defaultValue: JSON.stringify(defaultValue),
        user: false
      });
      return JSON.parse(timeout);
    },
    async tokenTimeoutStorage() {
      const result = await optionAPI.find<number>("yml", "server.jwt.timeout");
      const refreshTimeResult = await optionAPI.find<number>(
        "yml",
        "server.jwt.maxRefreshTime"
      );
      let timeout = 1;
      let refreshTime = 2;
      if (result.code == 0) {
        timeout = result.data;
      }
      if (refreshTimeResult.code == 0) {
        refreshTime = refreshTimeResult.data;
      }
      const json: Timeout = {
        timeout: timeout,
        maxRefreshTime: refreshTime
      };
      db.dbSet({
        dbName: "sys",
        path: "timeout",
        value: JSON.stringify(json),
        user: false
      });
    }
  }
});
