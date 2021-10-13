import { defineStore } from "pinia";
import { Result } from "/@/api/model/resultModel";
import { UserInfoModel } from "/@/api/model/userModel";
import { userAPI } from "/@/api/user";

export const userStore = defineStore({
  id: "user-store",
  actions: {
    updateProfile(user: UserInfoModel): Promise<Result<any>> {
      return userAPI.updateProfile(<UserInfoModel>user);
    }
  }
});
