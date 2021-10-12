import { http } from "../utils/http";
import BaseRequest from "./base";
import { Result } from "./model/resultModel";
import { UserInfoModel } from "./model/userModel";

// 获取验证码
export const getVerify = () => {
  return http.request("get", "/captcha");
};

// 登录
export const getLogin = (data: object) => {
  return http.request("post", "/login", data);
};

// 注册
export const getRegist = (data: object) => {
  return http.request("post", "/register", data);
};

enum API {
  info = "/user/info"
}

class User extends BaseRequest {
  /**
   *
   * @returns 当前用户详情
   */
  currentInfo(): Promise<Result<UserInfoModel>> {
    return this.get<Result<UserInfoModel>>(API.info, null);
  }
  /**
   *
   * @param id user id
   * @returns  user info
   */
  info(id: number): Promise<Result<UserInfoModel>> {
    return this.get<Result<UserInfoModel>>(
      API.info + this.info + "/" + id,
      null
    );
  }
}

export const userAPI = new User();
