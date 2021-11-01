import { defineStore } from "pinia";
import { Result } from "/@/api/model/resultModel";
import { routerAPI } from "/@/api/routes";
import { store } from "/@/store";
import { db } from "/@/utils/storage/db";
interface RouterState {
  dynamicRoutes: [];
}
export const routeStore = defineStore({
  id: "route-store",
  state: (): RouterState => ({
    dynamicRoutes: []
  }),
  actions: {
    async clean() {
      this.dynamicRoutes = [];
      db.dbSet({ dbName: "sys", path: "menu", user: true, value: "" });
    },
    async getDynamicRoutes(): Promise<Array<any>> {
      if (!this.dynamicRoutes || !this.dynamicRoutes.length) {
        await this.loadRoutes();
      }
      return this.dynamicRoutes;
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
          value: result.data
        });
        this.dynamicRoutes = result.data;
      } else {
        this.dynamicRoutes = menu;
      }
      return this.dynamicRoutes;
    }
  }
});
export function routeStoreHok() {
  return routeStore(store);
}
