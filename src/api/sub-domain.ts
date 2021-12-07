import { stringify } from "qs";
import BaseRequest from "./base";
import { SubDomainModel, SubDomainQuery } from "./model/sub-domain";
import { Page, Result } from "./model/result";
enum API {
  findPage = "/sub/domain/find/page",
  save = "/sub/domain/save",
  update = "/sub/domain/update/:id",
  delete = "/sub/domain/delete"
}
class SubDomain extends BaseRequest {
  /**
   * 分页查询
   * @param query 查询参数
   * @returns 分页列表
   */
  findPage(query?: SubDomainQuery): Promise<Result<Page<SubDomainModel>>> {
    return this.get<Result<Page<SubDomainModel>>>(API.findPage, query);
  }
  /**
   * 保存
   * @param model 保存参数
   * @returns 是否成功
   */
  save(model: SubDomainModel): Promise<Result<any>> {
    return this.post<Result<any>>(API.save, model);
  }
  /**
   * 根据id修改
   * @param model 修改参数
   * @param id  id
   * @returns  是否成功
   */
  update(model: SubDomainModel, id: number): Promise<Result<any>> {
    return this.put<Result<any>>(
      API.update.replace(":id", id.toString()),
      model
    );
  }
  /**
   * 根据id批量删除
   * @param ids id list
   * @returns  是否成功
   */
  deleteByIds(ids: number[]): Promise<Result<any>> {
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

export const subDomainAPI = new SubDomain();
