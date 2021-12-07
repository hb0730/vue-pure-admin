import { encode } from "../utils/crypto/base64";
import BaseRequest from "./base";
import {
  HostFileModel,
  HostModel,
  HostQuery,
  HostTestModel
} from "./model/host";
import { Page, Result } from "./model/result";
import { stringify } from "qs";
import { http } from "../utils/http";
import { cookies } from "../utils/storage/cookie";
import {
  EnclosureHttpRequestConfig,
  EnclosureHttpResoponse
} from "../utils/http/types";
import { downloadFileBlob } from "../utils/file";
enum API {
  findPage = "/host/get",
  testConnection = "/host/test",
  save = "/host/save",
  update = "/host/update",
  delete = "/host/delete",

  fileList = "/host/file/:id",
  fileDown = "/host/file/:id/down",
  fileUpload = "/host/file/:id/upload?hostId=:hostId&path=:path"
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
    return this.requestNoLoading<Result<HostFileModel>>(
      "get",
      API.fileList.replace(":id", id),
      {
        params: {
          hostId: hostId,
          path: path
        }
      }
    );
  }
  /**
   * 关闭
   * @param id id
   * @returns  是否成功
   */
  fileClose(id: string): Promise<Result<any>> {
    return this.requestNoLoading<Result<any>>(
      "delete",
      API.fileList.replace(":id", id),
      null
    );
  }
  /**
   *  download file
   * @param id id
   * @param hostId hostId
   * @param path  path
   */
  downloadFile(id: string, hostId: number, path?: string) {
    let response: EnclosureHttpResoponse = null;
    return http
      .request(
        "get",
        API.fileDown.replace(":id", id),
        //@ts-ignore
        { hostId: hostId, path: path },
        {
          timeout: 30000,
          responseType: "blob",
          beforeRequestCallback: function (
            request: EnclosureHttpRequestConfig
          ) {
            const token = cookies.get("token");
            if (token) {
              request.headers = {
                ...request.headers,
                Authorization: "Bearer " + token
              };
            }
          },
          beforeResponseCallback: function (res: EnclosureHttpResoponse) {
            response = res;
          }
        }
      )
      .then(async result => {
        const headers = <Map<string, string>>response.headers;
        const contentDisposition = headers["content-disposition"];
        downloadFileBlob(result, headers["content-type"], contentDisposition);
        Promise.resolve(result);
      });
  }
  /**
   * 文件路径
   * @param id id
   * @param hostId hostId
   * @param files  文件集
   * @param path  上传路径
   */
  uploadFile(
    id: string,
    hostId: number,
    files: any[],
    path?: string
  ): Promise<Result<any>> {
    const filedata = new FormData();
    files.forEach(file => filedata.append("file", file));
    return http.request(
      "post",
      API.fileUpload
        .replace(":id", id)
        .replace(":hostId", hostId.toString())
        .replace(":path", path),
      //@ts-ignore
      filedata,
      {
        timeout: 30000,
        headers: { "content-type": "multiple/form-data" },
        data: filedata,
        beforeRequestCallback: function (request: EnclosureHttpRequestConfig) {
          const token = cookies.get("token");
          if (token) {
            request.headers = {
              ...request.headers,
              Authorization: "Bearer " + token
            };
          }
        }
      }
    );
  }
}

export const HostAPI = new Host();
