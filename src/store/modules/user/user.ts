import { defineStore } from "pinia";
import { Page, Result } from "/@/api/model/result";
import { UpdatePasswordModel, UserInfoModel } from "/@/api/model/user";
import { userAPI } from "/@/api/user";
import { encryptPassword } from "/@/utils/util";

export const userStore = defineStore({
  id: "user-store",
  actions: {
    /**
     * 更新用户信息
     * @param user 需要更新的用户信息
     * @returns  是否成功
     */
    updateProfile(user: UserInfoModel): Promise<Result<any>> {
      return userAPI.updateProfile(<UserInfoModel>user);
    },
    /**
     *  修改密码
     * @param password 需要修改密码的model
     * @returns 是否成功
     */
    updatePassword(password: UpdatePasswordModel): Promise<Result<any>> {
      password.newPassword = encryptPassword(password.newPassword);
      password.newPassword2 = encryptPassword(password.newPassword2);
      password.oldPassword = encryptPassword(password.oldPassword);
      return userAPI.updatePassword(password);
    },
    /**
     * 分页查询
     * @param params 查询添加
     * @returns 分页结果
     */
    findPage(params: any): Promise<Result<Page<UserInfoModel>>> {
      return userAPI.pageFind(params);
    },
    /**
     * 新增用户
     * @param user 用户信息
     * @returns  是否成功
     */
    save(user: UserInfoModel): Promise<Result<any>> {
      return userAPI.save(user);
    },
    /**
     * 重置密码
     * @param userId user id
     * @returns  是否成功
     */
    rePassword(userId: number): Promise<Result<any>> {
      return userAPI.rePassword(userId);
    }
  }
});
