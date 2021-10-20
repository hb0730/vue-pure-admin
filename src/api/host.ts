import { encode } from "../utils/crypto/base64";
import BaseRequest from "./base";
import { HostModel, HostQuery, HostTestModel } from "./model/hostModel";
import { Page, Result } from "./model/resultModel";
enum API {
  findPage = "/host/get",
  testConnection = "/host/test",
  save = "/host/save"
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
  /**
   * 测试连接
   * @param model 连接参数
   * @returns  是否成功
   */
  testConnection(model: HostTestModel): Promise<Result<any>> {
    model.password = encode(model.password);
    return this.post<Result<any>>(API.testConnection, model);
  }
  /**
   * 新增
   * @param model 新增参数
   * @returns 是否成功
   */
  save(model: HostModel): Promise<Result<any>> {
    model.password = encode(model.password);
    return this.post<Result<any>>(API.save, model);
  }
}

export const HostAPI = new Host();
