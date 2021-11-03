import BaseRequest from "./base";
import { Result } from "./model/result";

enum API {
  find = "/options"
}

class Option extends BaseRequest {
  /**
   *
   * @param type 类型
   * @param name 名称
   * @returns  返回值
   */
  find<T>(type: string, name: string): Promise<Result<T>> {
    return this.get<Result<T>>(API.find + "/" + type + "/" + name, null);
  }
}

export const optionAPI = new Option();
