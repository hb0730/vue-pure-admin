import { http } from "../utils/http";
import BaseRequest from "./base";
import { Result, Page } from "./model/result";
import { UpdatePasswordModel, UserInfoModel } from "./model/user";

interface userType extends Promise<any> {
  svg?: string;
  code?: number;
  info?: object;
}

// 获取验证码
export const getVerify = (): userType => {
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
  findPage = "/user/page",
  info = "/user/info",
  updateProfile = "/user/update/profile",
  updatePassword = "/user/update/password",
  save = "/user/save",
  rePassword = "/user/reset/:id"
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
  /**
   * 分页查找
   * @param params 查询条件
   * @returns 分页结果
   */
  pageFind(params: any): Promise<Result<Page<UserInfoModel>>> {
    return this.post<Result<Page<UserInfoModel>>>(API.findPage, params);
  }
  /**
   * 新增用户
   * @param user 用户信息
   * @returns  是否成功
   */
  save(user: UserInfoModel): Promise<Result<any>> {
    return this.post<Result<any>>(API.save, user);
  }
  /**
   * 重置密码
   * @param userId user id
   * @returns  是否成功
   */
  rePassword(userId: number): Promise<Result<any>> {
    return this.get<Result<any>>(
      API.rePassword.replace(":id", userId.toString()),
      null
    );
  }
}

export const userAPI = new User();
