import router from "../router";
import { db } from "./storage/db";
import { rsa } from "/@/utils/crypto/rsa";

export const open = (path: string) => {
  // menuSelect(path);
  router.push(path);
};

/**
 * 加密
 * @param value 需要加密的值
 * @returns  加密后的值
 */
export const encryptPassword = (value?: string): string => {
  //加密
  rsa.setPublicKey(db.dbGet({ dbName: "sys", path: "password" }));
  const newValue = rsa.encrypt(value);
  return newValue as string;
};
