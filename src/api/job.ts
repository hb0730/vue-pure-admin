import BaseRequest from "./base";
import { DomainJobModel, DomainJobQuery } from "./model/job";
import { Page, Result } from "./model/result";
import qs from "qs";
enum API {
  save = "/job/domain/save",
  updateById = "/job/domain/:id",
  deleteByIds = "/job/domain",
  findPage = "/job/domain/find/page"
}
class DomainJob extends BaseRequest {
  /**
   * 分页查询
   * @param query 查询参数
   * @returns 分页列表
   */
  findPage(query: DomainJobQuery): Promise<Result<Page<DomainJobModel>>> {
    return this.get<Result<Page<DomainJobModel>>>(API.findPage, query);
  }
  /**
   *新增
   * @param model 新增参数
   * @returns 是否成功
   */
  save(model: DomainJobModel): Promise<Result<any>> {
    return this.post<Result<any>>(API.save, model);
  }
  /**
   * 根据id修改
   * @param model 修改参数
   * @param id id
   * @returns 是否成功
   */
  updateById(model: DomainJobModel, id: number): Promise<Result<any>> {
    return this.put<Result<any>>(
      API.updateById.replace(":id", id.toString()),
      model
    );
  }
  /**
   * 根据id删除
   * @param ids id 集合
   * @returns  是否成功
   */
  deleteById(ids: number[]): Promise<Result<any>> {
    const params = qs.stringify(
      { id: ids },
      {
        encode: false,
        arrayFormat: "comma"
      }
    );
    return this.delete<Result<any>>(API.deleteByIds, {
      id: params.split("=")[1]
    });
  }
}
export const DomainJobAPI = new DomainJob();
