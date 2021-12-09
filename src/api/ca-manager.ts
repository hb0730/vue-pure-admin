import { stringify } from "qs";
import BaseRequest from "./base";
import { CAManagerModel, CAManagerQuery, CAType } from "./model/ca-manager";
import { Page, Result } from "./model/result";

enum API {
  findCAType = "/ca/manager/type/:code",
  finPage = "/ca/manager/find/page",
  find = "/ca/manager/find",
  save = "/ca/manager/save",
  update = "/ca/manager/update/:id",
  delete = "/ca/manager/delete"
}
class CAManager extends BaseRequest {
  /**
   * find support types
   * @param code ca code
   * @returns ca types
   */
  findCAType(code?: string): Promise<Result<CAType[]>> {
    if (!code) {
      code = "";
    }
    return this.get<Result<CAType[]>>(
      API.findCAType.replace(":code", code),
      null
    );
  }
  /**
   * 分页查询
   * @param query 查询参数
   * @returns 分页列表
   */
  findPage(query: CAManagerQuery): Promise<Result<Page<CAManagerModel>>> {
    return this.get<Result<Page<CAManagerModel>>>(API.finPage, query);
  }
  /**
   * 列表查询
   * @param query 查询参数
   * @returns 列表
   */
  find(query: CAManagerQuery): Promise<Result<Array<CAManagerModel>>> {
    return this.get<Result<Array<CAManagerModel>>>(API.find, query);
  }
  /**
   * 保存
   * @param model 保存信息
   * @returns  是否成功
   */
  save(model: CAManagerModel): Promise<Result<any>> {
    return this.post<Result<any>>(API.save, model);
  }
  /**
   * 根据id更新
   * @param model 更新信息
   * @param id id
   * @returns 是否成功
   */
  update(model: CAManagerModel, id: number): Promise<Result<any>> {
    return this.put(API.update.replace(":id", id.toString()), model);
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

export const caManagerAPI = new CAManager();
