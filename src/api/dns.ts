import { stringify } from "qs";
import BaseRequest from "./base";
import { DNSModel, DNSProvider, DNSQuery } from "./model/dns";
import { Page, Result } from "./model/result";
enum API {
  providers = "/dns/providers",
  save = "/dns/save",
  update = "/dns/update/:id",
  find = "/dns/find",
  findPage = "/dns/find/page",
  delete = "/dns/delete"
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
  /**
   * 查询列表
   * @param query 查询参数
   * @returns  列表
   */
  find(query?: DNSQuery): Promise<Result<Array<DNSModel>>> {
    return this.get<Result<Array<DNSModel>>>(API.find, query);
  }
  /**
   * 分页查询
   * @param query 查询参数
   * @returns  分页列表
   */
  findPage(query: DNSQuery): Promise<Result<Page<DNSModel>>> {
    return this.get<Result<Page<DNSModel>>>(API.findPage, query);
  }
  deleteDNS(ids: number[]): Promise<Result<any>> {
    const params = stringify(
      { id: ids },
      {
        encode: false,
        arrayFormat: "comma"
      }
    );
    return this.delete<Result<any>>(API.delete, { id: params.split("=")[1] });
  }
}
export const dnsAPI = new DNS();
