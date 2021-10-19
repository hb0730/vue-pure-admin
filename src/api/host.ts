import BaseRequest from "./base";
import { HostModel, HostQuery } from "./model/hostModel";
import { Page, Result } from "./model/resultModel";
enum API {
  findPage = "/host/get"
}
class Host extends BaseRequest {
  /**
   *  分页查询
   * @param params 查询参数
   * @returns  查询结果
   */
  findPage(params?: HostQuery): Promise<Result<Page<HostModel>>> {
    return this.get<Result<Page<HostModel>>>(API.findPage, params);
  }
}

export const HostAPI = new Host();
