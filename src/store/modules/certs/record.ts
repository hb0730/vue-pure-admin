import { defineStore } from "pinia";
import { store } from "/@/store";
import { warnMessage } from "/@/utils/message";
import { db } from "/@/utils/storage/db";
import { open } from "/@/utils/util";
export interface CertRecordState {
  certModel: {
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
    certModel: db.dbGet({ dbName: "database", path: "certRecord", user: true })
  }),
  getters: {
    getCertModel(): any {
      return this.certModel;
    }
  },
  actions: {
    async setCertModel(model: any) {
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
      await this.setCertModel(model);
      open("/cert/record");
    }
  }
});
export function certRecordStoreHook() {
  return certRecordStore(store);
}
