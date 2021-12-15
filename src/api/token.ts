import BaseRequest from "./base";
import { Result } from "./model/result";
import { TokenResultModel } from "./model/user";
import { encryptPassword } from "/@/utils/util";
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
    const newPassword = encryptPassword(password);
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
  refresh(token: string): Promise<Result<TokenResultModel>> {
    return this.get(API.Refresh, { token: token });
  }
}

export const tokenAPI = new Token();
