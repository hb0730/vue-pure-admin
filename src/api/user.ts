import { http } from "../utils/http";
import BaseRequest from "./base";
import { Result } from "./model/resultModel";
import { UpdatePasswordModel, UserInfoModel } from "./model/userModel";

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
  info = "/user/info",
  updateProfile = "/user/update/profile",
  updatePassword = "/user/update/password"
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

  /**
   * 更新用户信息
   * @param user 用户信息
   * @returns  响应
   */
  updateProfile(user: UserInfoModel): Promise<Result<any>> {
    return this.post(API.updateProfile, user);
  }
  /**
   * update password
   * @param password update password model
   * @returns  响应
   */
  updatePassword(password: UpdatePasswordModel): Promise<Result<any>> {
    return this.post(API.updatePassword, password);
  }
}

export const userAPI = new User();
