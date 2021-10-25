import { encode } from "../utils/crypto/base64";
import BaseRequest from "./base";
import {
  HostFileModel,
  HostModel,
  HostQuery,
  HostTestModel
} from "./model/hostModel";
import { Page, Result } from "./model/resultModel";
import { stringify } from "qs";
enum API {
  findPage = "/host/get",
  testConnection = "/host/test",
  save = "/host/save",
  update = "/host/update",
  delete = "/host/delete",

  fileList = "/host/file"
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
  /**
   * 修改
   * @param model 修改参数
   * @returns  是否成功
   */
  update(model: HostModel): Promise<Result<any>> {
    model.password = encode(model.password);
    return this.put<Result<any>>(API.update + "/" + model.id, model);
  }
  /**
   * 删除
   * @param id id集合
   * @returns 是否成功
   */
  deleteHost(id: number[]): Promise<Result<any>> {
    const params = stringify(
      { id: id },
      {
        encode: false,
        arrayFormat: "comma"
      }
    );
    return this.delete<Result<any>>(API.delete, { id: params.split("=")[1] });
  }
  //-------------------files-------------------
  /**
   * server file list
   * @param id id
   * @param hostId host id
   * @returns  文件列表
   */
  listFiles(
    id: string,
    hostId: number,
    path?: string
  ): Promise<Result<HostFileModel>> {
    return this.get<Result<HostFileModel>>(API.fileList + "/" + id, {
      hostId: hostId,
      path: path
    });
  }
  /**
   * 关闭
   * @param id id
   * @returns  是否成功
   */
  fileClose(id: string): Promise<Result<any>> {
    return this.delete<Result<any>>(API.fileList + "/" + id, null);
  }
}

export const HostAPI = new Host();
