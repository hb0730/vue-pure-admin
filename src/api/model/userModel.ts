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
