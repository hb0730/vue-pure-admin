import { defineStore } from "pinia";
import { Result } from "/@/api/model/result";
import { routerAPI } from "/@/api/routes";
import { store } from "/@/store";
import { db } from "/@/utils/storage/db";
export const routeStore = defineStore({
  id: "route-store",
  actions: {
    async clean() {
      this.dynamicRoutes = [];
      db.dbSet({ dbName: "sys", path: "menu", user: true, value: "" });
    },
    async getDynamicRoutes(): Promise<Array<any>> {
      return this.loadRoutes();
    },
    async loadRoutes() {
      const menu = db.dbGet({ dbName: "sys", path: "menu", user: true });
      if (!menu || !menu.length) {
        // @ts-ignore
        const result: Result<any> = await routerAPI.findRouter();
        db.dbSet({
          dbName: "sys",
          path: "menu",
          user: true,
          value: JSON.stringify(result.data)
        });
        return result.data;
      } else {
        return JSON.parse(menu);
      }
    }
  }
});
export function routeStoreHok() {
  return routeStore(store);
}
