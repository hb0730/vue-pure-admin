import BaseRequest from "./base";
import { Result } from "./model/result";
enum API {
  apply = "/cert/record/apply/:domainListId"
}
class CertRecords extends BaseRequest {
  /**
   * 申请证书
   * @param certId 申请列表的id
   * @returns 是否成功
   */
  applyCert(domainListId: number): Promise<Result<any>> {
    return this.get<Result<any>>(
      API.apply.replace(":domainListId", domainListId.toString()),
      null
    );
  }
}

export const certRecordAPI = new CertRecords();
