import BaseRequest from "./base";
import { DNSModel, DNSProvider } from "./model/dnsModel";
import { Result } from "./model/resultModel";
enum API {
  providers = "/dns/providers",
  save = "/dns/save",
  update = "/dns/update/:id"
}
class DNS extends BaseRequest {
  /**
   * 获取提供商列表
   * @returns 提供商列表
   */
  getProviders(): Promise<Result<DNSProvider[]>> {
    return this.get<Result<DNSProvider[]>>(API.providers, null);
  }
  /**
   *  保存
   * @param model 参数
   * @returns 是否成功
   */
  save(model: DNSModel): Promise<Result<any>> {
    return this.post<Result<any>>(API.save, model);
  }
  /**
   * 根据id修改
   * @param model 需要修改的参数
   * @param id  id
   * @returns  是否成功
   */
  updateById(model: DNSModel, id: number): Promise<Result<any>> {
    return this.put<Result<any>>(
      API.update.replace(":id", id.toString()),
      model
    );
  }
}
export const dnsAPI = new DNS();
