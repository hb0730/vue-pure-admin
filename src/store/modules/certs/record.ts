import { defineStore } from "pinia";
import { certRecordAPI } from "/@/api/certRecords";
import { Result } from "/@/api/model/result";
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
  state: (): CertRecordState => ({
    domainListModel: db.dbGet({
      dbName: "database",
      path: "certRecord",
      user: true
    })
  }),
  getters: {
    getDomainListModel(): any {
      return this.domainListModel;
    }
  },
  actions: {
    async setDomainListModel(model: any) {
      db.dbSet({
        dbName: "database",
        path: "certRecord",
        user: true,
        value: model
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
    }
  }
});
export function certRecordStoreHook() {
  return certRecordStore(store);
}
