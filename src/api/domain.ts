import { stringify } from "qs";
import BaseRequest from "./base";
import { DomainModel, DomainQuery } from "./model/domain";
import { Page, Result } from "./model/result";

enum API {
  save = "/domain/save",
  update = "/domain/update/:id",
  find = "/domain/find",
  findPage = "/domain/find/page",
  delete = "/domain/delete"
}

class Domain extends BaseRequest {
  /**
   * 保存
   * @param model 参数
   * @returns 是否成功
   */
  save(model: DomainModel): Promise<Result<any>> {
    return this.post<Result<any>>(API.save, model);
  }
  /**
   * 根据id修改
   * @param model 参数
   * @param id  id
   * @returns  是否成功
   */
  update(model: DomainModel, id: number): Promise<Result<any>> {
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
  find(query?: DomainQuery): Promise<Result<Array<DomainModel>>> {
    return this.get<Result<Array<DomainModel>>>(API.find, query);
  }
  /**
   * 分页查询
   * @param query 查询参数
   * @returns 分页列表
   */
  findPage(query?: DomainQuery): Promise<Result<Page<DomainModel>>> {
    return this.get<Result<Page<DomainModel>>>(API.findPage, query);
  }
  /**
   * 删除
   * @param ids id list
   * @returns  是否成功
   */
  deleteDomain(ids: number[]): Promise<Result<any>> {
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

export const domainAPI = new Domain();
