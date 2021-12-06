import {
  Router,
  createRouter,
  RouteComponent,
  createWebHashHistory,
  RouteRecordNormalized,
  RouteRecordName,
  RouteMeta
} from "vue-router";
import { openLink } from "/@/utils/link";
import NProgress from "/@/utils/progress";
import { split, uniqBy } from "lodash-es";
import { useTimeoutFn } from "@vueuse/core";
import { RouteConfigs } from "/@/layout/types";
import { storageLocal } from "/@/utils/storage";
import { usePermissionStoreHook } from "/@/store/modules/permission";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";
// 静态路由
import tabsRouter from "./modules/tabs";
import homeRouter from "./modules/home";
import Layout from "/@/layout/index.vue";
import errorRouter from "./modules/error";
import editorRouter from "./modules/editor";
import nestedRouter from "./modules/nested";
import externalLink from "./modules/externalLink";
import remainingRouter from "./modules/remaining";
import flowChartRouter from "./modules/flowchart";
import componentsRouter from "./modules/components";

// 动态路由
import { cookies } from "../utils/storage/cookie";
import { tokenStore } from "../store/modules/token";
import dayjs from "dayjs";
import { routeStoreHok } from "../store/modules/router";
import { toRaw } from "vue";
import { transformI18n } from "/@/plugins/i18n";

// https://cn.vitejs.dev/guide/features.html#glob-import
const modulesRoutes = import.meta.glob("/src/views/**/*.vue");

const constantRoutes: Array<RouteComponent> = [
  tabsRouter,
  homeRouter,
  flowChartRouter,
  editorRouter,
  componentsRouter,
  nestedRouter,
  externalLink,
  errorRouter
];
// 按照路由中meta下的rank等级升序来排序路由
export const ascending = arr => {
  return arr.sort((a: any, b: any) => {
    return a?.meta?.rank - b?.meta?.rank;
  });
};
export const fileImport = file => {
  return () => import(`../views/${file}.vue`);
};
// 将所有静态路由导出
export const constantRoutesArr: Array<RouteComponent> = ascending(
  constantRoutes
).concat(...remainingRouter);

// 过滤meta中showLink为false的路由
export const filterTree = data => {
  const newTree = data.filter(v => v.meta.showLink);
  newTree.forEach(v => v.children && (v.children = filterTree(v.children)));
  return newTree;
};

// 从路由中提取keepAlive为true的name组成数组（此处本项目中并没有用到，只是暴露个方法）
export const getAliveRoute = () => {
  const alivePageList = [];
  const recursiveSearch = treeLists => {
    if (!treeLists || !treeLists.length) {
      return;
    }
    for (let i = 0; i < treeLists.length; i++) {
      if (treeLists[i]?.meta?.keepAlive) alivePageList.push(treeLists[i].name);
      recursiveSearch(treeLists[i].children);
    }
  };
  recursiveSearch(router.options.routes);
  return alivePageList;
};

// 批量删除缓存路由
export const delAliveRoutes = (delAliveRouteList: Array<RouteConfigs>) => {
  delAliveRouteList.forEach(route => {
    usePermissionStoreHook().cacheOperate({
      mode: "delete",
      name: route?.name
    });
  });
};

// 处理缓存路由（添加、删除、刷新）
export const handleAliveRoute = (
  matched: RouteRecordNormalized[],
  mode?: string
) => {
  switch (mode) {
    case "add":
      matched.forEach(v => {
        usePermissionStoreHook().cacheOperate({ mode: "add", name: v.name });
      });
      break;
    case "delete":
      usePermissionStoreHook().cacheOperate({
        mode: "delete",
        name: matched[matched.length - 1].name
      });
      break;
    default:
      usePermissionStoreHook().cacheOperate({
        mode: "delete",
        name: matched[matched.length - 1].name
      });
      useTimeoutFn(() => {
        matched.forEach(v => {
          usePermissionStoreHook().cacheOperate({ mode: "add", name: v.name });
        });
      }, 100);
  }
};

// 过滤后端传来的动态路由 重新生成规范路由
export const addAsyncRoutes = (arrRoutes: Array<RouteComponent>) => {
  if (!arrRoutes || !arrRoutes.length) return arrRoutes;
  return arrRoutes.map((v: any) => {
    if (v.redirect) {
      v.component = Layout;
    } else if (v.component) {
      v.component = fileImport(v.component);
    } else {
      v.component = modulesRoutes[`/src/views${v.path}/index.vue`];
    }
    if (v.children) {
      v.children = addAsyncRoutes(v.children);
    }
    return v;
  });
};

// 创建路由实例
export const router: Router = createRouter({
  history: createWebHashHistory(),
  routes: ascending(constantRoutes).concat(...remainingRouter),
  scrollBehavior(to, from, savedPosition) {
    return new Promise(resolve => {
      if (savedPosition) {
        return savedPosition;
      } else {
        if (from.meta.saveSrollTop) {
          const top: number =
            document.documentElement.scrollTop || document.body.scrollTop;
          resolve({ left: 0, top });
        }
      }
    });
  }
});

/**
 * 将dynamic routes 加入router
 * @param dynamicsRoutes 动态路由
 */
export const resetDynamicsRouter = async (dynamicsRoutes: any) => {
  const routes = dynamicsRoutes || [];
  if (!routes) {
    usePermissionStoreHook().changeSetting([]);
  }
  const filterRoutes = addAsyncRoutes(routes).filter(v => {
    return (
      router.options.routes.findIndex(value => value.path === v.path) === -1
    );
  });
  router.options.routes.push(...filterRoutes);
  ascending(router.options.routes);
  filterRoutes.forEach((v: any) => {
    router.addRoute(v.name, v);
  });
  usePermissionStoreHook().changeSetting(filterRoutes);
};

export const initRouter = async () => {
  const routes = await routeStoreHok().getDynamicRoutes();
  await resetDynamicsRouter(toRaw(routes));
  router.addRoute({
    path: "/:pathMatch(.*)",
    redirect: "/error/404"
  });
};

// 重置路由
export function resetRouter() {
  router.getRoutes().forEach(route => {
    const { name } = route;
    if (name) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}
async function refreshToken() {
  const expire = cookies.get("token-expire");
  const expireDay = dayjs(Number(expire));
  const nowDay = dayjs();
  if (expireDay.valueOf() - nowDay.valueOf() <= 180000) {
    tokenStore().refreshToken();
  }
}
const whiteList = ["/login"];
router.beforeEach(async (to, _from, next) => {
  if (to.meta?.keepAlive) {
    const newMatched = to.matched;
    handleAliveRoute(newMatched, "add");
    // 页面整体刷新和点击标签页刷新
    if (_from.name === undefined || _from.name === "redirect") {
      handleAliveRoute(newMatched);
    }
  }
  const id = cookies.get("uuid");
  NProgress.start();
  const externalLink = to?.redirectedFrom?.fullPath;
  if (!externalLink)
    to.matched.some(item => {
      item.meta.title
        ? (document.title = transformI18n(
            item.meta.title as string,
            item.meta?.i18n as boolean
          ))
        : "";
    });
  if (id) {
    await refreshToken();
    if (_from?.name) {
      // 如果路由包含http 则是超链接 反之是普通路由
      if (externalLink && externalLink.includes("http")) {
        openLink(`http${split(externalLink, "http")[1]}`);
        NProgress.done();
      } else {
        next();
      }
    } else {
      // 刷新
      if (usePermissionStoreHook().wholeRoutes.length === 0) {
        await initRouter();
        if (!useMultiTagsStoreHook().getMultiTagsCache) {
          const handTag = (
            path: string,
            parentPath: string,
            name: RouteRecordName,
            meta: RouteMeta
          ): void => {
            useMultiTagsStoreHook().handleTags("push", {
              path,
              parentPath,
              name,
              meta
            });
          };
          const to1 = router
            .getRoutes()
            .filter(route => route.path == to.path)[0];
          const parentPath = to1?.path;
          if (to1.meta?.realPath) {
            const { path, name, meta } = to1?.children[0];
            handTag(path, parentPath, name, meta);
            router.push(path);
          } else {
            const { path, name, meta } = to1;
            handTag(path, parentPath, name, meta);
            router.push(to.path);
          }
        }
        router.push(to.path);
        // 刷新页面更新标签栏与页面路由匹配
        const localRoutes = storageLocal.getItem("responsive-tags");
        const optionsRoutes = router.options?.routes;
        const newLocalRoutes = [];
        optionsRoutes.forEach(ors => {
          localRoutes.forEach(lrs => {
            if (ors.path === lrs.parentPath) {
              newLocalRoutes.push(lrs);
            }
          });
        });
        storageLocal.setItem("responsive-tags", uniqBy(newLocalRoutes, "path"));
      }
      next();
    }
  } else {
    if (to.path !== "/login") {
      if (whiteList.indexOf(to.path) !== -1) {
        next();
      } else {
        next({ path: "/login" });
      }
    } else {
      next();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
