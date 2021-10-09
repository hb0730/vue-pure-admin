import { rsa } from "/@/utils/crypto/rsa";
import BaseRequest from "./base";
import { Result } from "./model/resultModel";
import { TokenResultModel } from "./model/userModel";
import { db } from "../utils/storage/db";
enum API {
  Login = "/login",
  Logout = "/logout",
  Refresh = "/refresh/token"
}

class Token extends BaseRequest {
  /**
   * Login
   * @param username 用户名
   * @param password 用户密码
   * @returns 登录响应信息
   */
  login(username: string, password: string): Promise<Result<TokenResultModel>> {
    //加密
    rsa.setPublicKey(db.dbGet({ dbName: "sys", path: "password" }));
    const newPassword = rsa.encrypt(password);
    return this.post<Result<TokenResultModel>>(API.Login, {
      username: username,
      password: newPassword
    });
  }
  /**
   * 注销
   * @returns
   */
  logout(): Promise<Result<any>> {
    return this.delete(API.Logout, null);
  }
  /**
   * 刷新令牌
   * @returns
   */
  refresh(): Promise<Result<TokenResultModel>> {
    return this.post(API.Refresh, null);
  }
}

export const tokenAPI = new Token();
