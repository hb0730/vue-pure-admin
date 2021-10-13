export interface TokenResultModel {
  code: number;
  token: string;
  expire: string;
}

export interface UserInfoModel {
  id: number;
  username: string;
  nickName: string;
  email: string;
  isAdmin: number;
}

export interface UpdatePasswordModel {
  oldPassword: string;
  newPassword: string;
  newPassword2: string;
}
