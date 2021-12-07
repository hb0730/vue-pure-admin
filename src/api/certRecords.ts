import BaseRequest from "./base";
import { CertRecordModel, CertRecordsQuery } from "./model/cert-records";
import { Page, Result } from "./model/result";
enum API {
  apply = "/cert/record/apply/:subDomainId",
  findPage = "/cert/record/find/page/:subDomainId",
  challengesDNS = "/cert/record/:id"
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
}

export const certRecordAPI = new CertRecords();
