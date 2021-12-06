import { http } from "../utils/http";
import BaseRequest from "./base";

export const getAsyncRoutes = (data?: object) => {
  return http.request("get", "/getAsyncRoutes", { data });
};

enum API {
  find = "/router/get"
}

class Router extends BaseRequest {
  findRouter() {
    return this.get(API.find, null);
  }
}

export const routerAPI = new Router();
