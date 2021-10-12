import router from "../router";
import { algorithm } from "./algorithm";
import { emitter } from "./mitt";

export const open = (path: string) => {
  menuSelect(path);
  router.push(path);
};
const menuSelect = (indexPath: string): void => {
  let parentPath = "";
  const parentPathIndex = indexPath.lastIndexOf("/");
  if (parentPathIndex > 0) {
    parentPath = indexPath.slice(0, parentPathIndex);
  }
  // 找到当前路由的信息
  // eslint-disable-next-line no-inner-declarations
  function findCurrentRoute(routes) {
    return routes.map(item => {
      if (item.path === indexPath) {
        // 切换左侧菜单 通知标签页
        emitter.emit("changLayoutRoute", {
          indexPath,
          parentPath
        });
      } else {
        if (item.children) findCurrentRoute(item.children);
      }
    });
  }
  findCurrentRoute(algorithm.increaseIndexes(router.getRoutes()));
};
