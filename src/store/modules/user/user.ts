import { defineStore } from "pinia";
import { Result } from "/@/api/model/resultModel";
import { UpdatePasswordModel, UserInfoModel } from "/@/api/model/userModel";
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
    }
  }
});
