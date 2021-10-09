import { defineStore } from "pinia";
import { option } from "/@/api/option";
import { db } from "/@/utils/storage/db";

export const optionStore = defineStore({
  id: "pure-option-db",
  actions: {
    async getPasswordPublicKey(): Promise<null> {
      const result = await option.find<string>("yml", "password.publicKey");
      if (result.code === 0) {
        db.dbSet({
          dbName: "sys",
          path: "password",
          value: result.data,
          user: false
        });
      }
      return null;
    }
  }
});
