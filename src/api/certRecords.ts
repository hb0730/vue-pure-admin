import { downloadFileBlob } from "../utils/file";
import { http } from "../utils/http";
import { PureHttpRequestConfig, PureHttpResoponse } from "../utils/http/types";
import { cookies } from "../utils/storage/cookie";
import BaseRequest from "./base";
import { CertRecordModel, CertRecordsQuery } from "./model/cert-records";
import { Page, Result } from "./model/result";
enum API {
  apply = "/cert/record/apply/:subDomainId",
  findPage = "/cert/record/find/page/:subDomainId",
  challengesDNS = "/cert/record/:id",
  downloadCert = "/cert/record/:id/download"
}
class CertRecords extends BaseRequest {
  /**
   * 申请证书
   * @param certId 申请列表的id
   * @returns 是否成功
   */
  applyCert(subDomainId: number): Promise<Result<any>> {
    return this.get<Result<any>>(
      API.apply.replace(":subDomainId", subDomainId.toString()),
      null
    );
  }
  /**
   * 查询申请证书列表
   * @param query 查询参数
   * @returns 分页列表
   */
  findPage(query: CertRecordsQuery): Promise<Result<Page<CertRecordModel>>> {
    return this.get<Result<Page<CertRecordModel>>>(
      API.findPage.replace(":subDomainId", query.subDomainId.toString()),
      query
    );
  }
  /**
   *验证记录
   * @param certRecordId 申请id
   * @returns 是否成功
   */
  challengesDNS(certRecordId: number): Promise<Result<any>> {
    return this.get<Result<any>>(
      API.challengesDNS.replace(":id", certRecordId.toString()),
      null
    );
  }
  downloadCert(certRecordId: number) {
    let response: PureHttpResoponse = null;
    return http
      .request(
        "put",
        API.downloadCert.replace(":id", certRecordId.toString()),
        null,
        {
          timeout: 30000,
          responseType: "blob",
          beforeRequestCallback: function (request: PureHttpRequestConfig) {
            const token = cookies.get("token");
            if (token) {
              request.headers = {
                ...request.headers,
                Authorization: "Bearer " + token
              };
            }
          },
          beforeResponseCallback: function (res: PureHttpResoponse) {
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
}

export const certRecordAPI = new CertRecords();
