import { defineStore } from "pinia";
import { store } from "/@/store";

import { constantRoutesArr, ascending, filterTree } from "/@/router/index";

export const usePermissionStore = defineStore({
  id: "pure-permission",
  state: () => ({
    // 静态路由
    constantRoutes: constantRoutesArr,
    wholeRoutes: [],
    buttonAuth: []
  }),
  actions: {
    asyncActionRoutes(routes) {
      if (this.wholeRoutes.length > 0) return;
      //合并
      const total = this.constantRoutes.concat(routes);
      const temp = {}; //用于name判断重复
      const result = []; //最后的新数组

      total.map(function (item, _) {
        if (!temp[item.path]) {
          result.push(item);
          temp[item.path] = true;
        }
      });
      this.wholeRoutes = filterTree(ascending(result)).filter(
        v => v.meta.showLink
      );

      const getButtonAuth = (arrRoutes: Array<string>) => {
        if (!arrRoutes || !arrRoutes.length) return;
        arrRoutes.forEach((v: any) => {
          if (v.meta && v.meta.authority) {
            this.buttonAuth.push(...v.meta.authority);
          }
          if (v.children) {
            getButtonAuth(v.children);
          }
        });
      };

      getButtonAuth(this.wholeRoutes);
    },
    async changeSetting(routes) {
      await this.asyncActionRoutes(routes);
    }
  }
});

export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
