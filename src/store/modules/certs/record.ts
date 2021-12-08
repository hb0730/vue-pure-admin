import { defineStore } from "pinia";
import { certRecordAPI } from "/@/api/certRecords";
import { CertRecordModel, CertRecordsQuery } from "/@/api/model/cert-records";
import { Page, Result } from "/@/api/model/result";
import { store } from "/@/store";
import { warnMessage } from "/@/utils/message";
import { db } from "/@/utils/storage/db";
import { open } from "/@/utils/util";
export interface CertRecordState {
  domainListModel: {
    id: number;
    domainId: number;
    domainName: string;
    domainList: string;
    certbotName: string;
    certbotId: number;
  };
}
const certRecordStore = defineStore({
  id: "cert-record-store",
  actions: {
    async setDomainListModel(model: any) {
      db.dbSet({
        dbName: "database",
        path: "certRecord",
        user: true,
        value: model
      });
    },
    getDomainListModel(): any {
      return db.dbGet({
        dbName: "database",
        path: "certRecord",
        user: true
      });
    },
    async openRecord(model: any) {
      if (!model) {
        warnMessage("打开失败");
        return;
      }
      await this.setDomainListModel(model);
      open("/cert/record");
    },
    /**
     * 申请证书
     * @param certId 申请列表的id
     * @returns 是否成功
     */
    applyCert(domainListId: number): Promise<Result<any>> {
      return certRecordAPI.applyCert(domainListId);
    },
    /**
     * 查询申请证书列表
     * @param query 查询参数
     * @returns 分页列表
     */
    findPage(query: CertRecordsQuery): Promise<Result<Page<CertRecordModel>>> {
      return certRecordAPI.findPage(query);
    },
    /**
     *验证记录
     * @param certRecordId 申请id
     * @returns 是否成功
     */
    challengesDNS(certRecordId: number): Promise<Result<any>> {
      return certRecordAPI.challengesDNS(certRecordId);
    },
    /**
     *证书下载
     * @param certRecordId 申请id
     * @returns 是否成功
     */
    downloadCert(certRecordId: number) {
      return certRecordAPI.downloadCert(certRecordId);
    }
  }
});
export function certRecordStoreHook() {
  return certRecordStore(store);
}
