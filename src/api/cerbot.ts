import { stringify } from "qs";
import BaseRequest from "./base";
import { CertbotModel, CertbotQuery } from "./model/certbot";
import { Page, Result } from "./model/resultModel";

enum API {
  finPage = "/boot/find/page",
  find = "/boot/find",
  save = "/boot/save",
  update = "/boot/update/:id",
  delete = "/boot/delete"
}
class CertBot extends BaseRequest {
  /**
   * 分页查询
   * @param query 查询参数
   * @returns 分页列表
   */
  findPage(query: CertbotQuery): Promise<Result<Page<CertbotModel>>> {
    return this.get<Result<Page<CertbotModel>>>(API.finPage, query);
  }
  /**
   * 列表查询
   * @param query 查询参数
   * @returns 列表
   */
  find(query: CertbotQuery): Promise<Result<Array<CertbotModel>>> {
    return this.get<Result<Array<CertbotModel>>>(API.find, query);
  }
  /**
   * 保存
   * @param model 保存信息
   * @returns  是否成功
   */
  save(model: CertbotModel): Promise<Result<any>> {
    return this.post<Result<any>>(API.save, model);
  }
  /**
   * 根据id更新
   * @param model 更新信息
   * @param id id
   * @returns 是否成功
   */
  update(model: CertbotModel, id: number): Promise<Result<any>> {
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

export const certBotAPI = new CertBot();
